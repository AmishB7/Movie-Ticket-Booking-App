import express from "express";
import { addMovie, getAllMovies, getMovieById } from "../controllers/MovieControllers.js";

const movieRouter = express.Router();

movieRouter.get("/:id", getMovieById);
movieRouter.get("/", getAllMovies);
movieRouter.post("/", addMovie);

export default movieRouter;