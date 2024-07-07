import Jwt from "jsonwebtoken";
import Movie from "../models/Movies.js";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not found" });
  }

  let adminId;
  // Verify token
  try {
    const decrypted = Jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }

  // Create new movie
  const {
    title,
    cast,
    description,
    duration,
    releaseDate,
    posterUrl,
    trailerUrl,
    ticketPrice,
  } = req.body;
  if (
    !title.trim() ||
    !cast.trim() ||
    !description.trim() ||
    !duration.trim() ||
    !releaseDate.trim() ||
    !posterUrl.trim() ||
    !ticketPrice.trim()
  ) {
    return res.status(402).json({ message: "Invalid Inputs" });
  }
  let existingMovie;
  try {
    existingMovie = await Movie.findOne({ title });
  } catch (err) {
    return console.log(err);
  }
  if (existingMovie) {
    return res.status(400).json({ message: "Movie Already Added !" });
  }

  try {
    const movie = new Movie({
      title,
      cast,
      description,
      releaseDate,
      duration,
      posterUrl,
      trailerUrl,
      admin: adminId,
      ticketPrice,
    });

    const session = await mongoose.startSession();
    const adminUser = await Admin.findById(adminId);
    session.startTransaction();
    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ message: "Movie added successfully", movie });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Request failed" });
  }
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return console.log(err);
  }
  if (!movies) {
    return res.status(500).json({ message: "Request Failed" });
  }
  return res.status(200).json({ movies });
};

export const getMoviesById = async (req, res, next) => {
  let id, movie;
  id = req.params.id;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!id) {
    return res.status(500).json({ message: "Request Failed" });
  }

  return res.status(200).json({ movie });
};
