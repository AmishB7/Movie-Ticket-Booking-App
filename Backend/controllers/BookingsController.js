import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movies.js";
import User from "../models/User.js";

/**
 * Handles an error by logging it, setting the response status, and sending a JSON message.
 *
 * @param {Object} res - The response object.
 * @param {Error} err - The error object.
 * @param {string} message - The error message to be sent in the response.
 * @param {number} [status=500] - The HTTP status code to be set in the response. Defaults to 500.
 * @return {Object} The response object with the error message and status.
 */
const handleError = (res, err, message, status = 500) => {
  console.error(err);
  return res.status(status).json({ message });
};

/**
 * Creates a new booking for a movie.
 *
 * @param {Object} req - The request object containing the booking details.
 * @param {Object} req.body - The body of the request containing the following properties:
 *   - {string} movie - The ID of the movie.
 *   - {string} date - The date of the booking.
 *   - {number} seatNumber - The seat number of the booking.
 *   - {string} user - The ID of the user.
 *   - {number} ticketPrice - The price of the ticket.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} A promise that resolves to the created booking object.
 * @throws {Error} If the movie or user is not found, or if a booking already exists for the same movie, date, and seat number.
 */
export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user, ticketPrice } = req.body;

  try {
    const [movieExists, existingUser] = await Promise.all([
      Movie.findById(movie),
      User.findById(user),
    ]);

    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingBooking = await Bookings.findOne({
      movie,
      date: new Date(date),
      seatNumber,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Booking already exists for this movie, date, and seat number" });
    }

    const booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
      ticketPrice,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    existingUser.bookings.push(booking);
    movieExists.bookings.push(booking);

    await Promise.all([
      existingUser.save({ session }),
      movieExists.save({ session }),
      booking.save({ session }),
    ]);

    await session.commitTransaction();

    return res.status(201).json({ booking });

  } catch (err) {
    return handleError(res, err, "Unable to create booking");
  }
};

/**
 * Retrieves a booking by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} The booking object if found, or an error response.
 */
export const getBookingById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Bookings.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });

  } catch (err) {
    return handleError(res, err, "Unexpected Error");
  }
};

/**
 * Deletes a booking by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} The response object.
 */
export const deleteBooking = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Bookings.findById(id).populate("user movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    if (booking.user) {
      booking.user.bookings.pull(booking);
      await booking.user.save({ session });
    }

    if (booking.movie) {
      booking.movie.bookings.pull(booking);
      await booking.movie.save({ session });
    }

    await booking.remove({ session });

    await session.commitTransaction();

    return res.status(200).json({ message: "Successfully Deleted" });

  } catch (err) {
    return handleError(res, err, "An error occurred while deleting booking");
  }
};
