import jwt from "jsonwebtoken";
import Movie from "../models/Movies.js";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

const handleError = (res, err, message, status = 500) => {
  console.error(err);
  return res.status(status).json({ message });
};

/**
 * Adds a new movie to the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the movie is added successfully, or rejects with an error.
 */
export const addMovie = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(404).json({ message: "Token Not Found" });
  }

  const extractedToken = authHeader.split(" ")[1];
  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(400).json({ message: `${err.message}` });
  }

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
    !title || !cast || !description || !duration ||
    !releaseDate || !posterUrl || !ticketPrice ||
    title.trim() === "" || cast.trim() === "" ||
    description.trim() === "" || duration.trim() === "" ||
    releaseDate.trim() === "" || posterUrl.trim() === "" ||
    ticketPrice.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ message: "Movie Already Added!" });
    }

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

    return res.status(200).json({ message: "Movie Added Successfully", movie });
  } catch (error) {
    return handleError(res, error, "Request Failed");
  }
};

/**
 * Retrieves all movies from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} A promise that resolves to the response object with the movies data or an error message.
 */
export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    if (!movies || movies.length === 0) {
      return res.status(404).json({ message: "No Movies Found" });
    }
    return res.status(200).json({ movies });
  } catch (err) {
    return handleError(res, err, "Request Failed");
  }
};

/**
 * Retrieves a movie by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<Object>} The movie object if found, or an error response.
 */
export const getMovieById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie Not Found" });
    }
    return res.status(200).json({ movie });
  } catch (err) {
    return handleError(res, err, "Request Failed");
  }
};
