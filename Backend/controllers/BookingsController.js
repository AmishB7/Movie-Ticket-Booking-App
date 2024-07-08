import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movies.js";
import User from "../models/User.js";

const handleError = (res, err, message, status = 500) => {
  console.error(err);
  return res.status(status).json({ message });
};

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
      seatNumber,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Duplicate Booking",
      });
    }

    const booking = new Bookings({
      movie,
      date: new Date(date),
      seatNumber,
      user,
      ticketPrice,
    });

    existingUser.bookings.push(booking);
    movieExists.bookings.push(booking);

    await Promise.all([
      existingUser.save(),
      movieExists.save(),
      booking.save(),
    ]);

    return res.status(201).json({ booking });
  } catch (err) {
    return handleError(res, err, "Unable to create booking");
  }
};

export const getBookingById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await Bookings.findById(id).populate("title");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
  } catch (err) {
    return handleError(res, err, "Unexpected Error");
  }
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndDelete(id).populate("user movie");
    console.log(booking);
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unable to Delete" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};
