import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Movie from "../models/Movies.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
  const { movie, date, seatNumber, user, ticketPrice } = req.body;
  let movieExists;
  let existingUser;
  try {
    movieExists = await Movie.findById(movie);
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!movieExists) {
    return res.status(404).json({ message: "Movie not found" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }
  let booking;
  try {
    booking = new Bookings({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
      ticketPrice,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.bookings.push(booking);
    movieExists.bookings.push(booking);
    await existingUser.save({ session });
    await movieExists.save({ session });
    await booking.save({ session });
    session.commitTransaction();
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "unable to create bookings" });
  }
  return res.status(201).json({ booking });
};

export const getBookingById = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!booking) {
    return res.status(500).json({ message: "Unexpected Error" });
  }
  return res.status(200).json({ booking });
};

export const deleteBooking = async (req, res, next) => {
  const id = req.params.id;
  let booking;
  try {
    booking = await Bookings.findByIdAndDelete(id).populate("user movie");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    if (booking.user) {
      await booking.user.bookings.pull(booking);
      await booking.user.save({ session });
    }
    if (booking.movie) {
      await booking.movie.bookings.pull(booking);
      await booking.movie.save({ session });
    }
    session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting booking" });
  }
  return res.status(200).json({ message: "Successfully Deleted" });
};
