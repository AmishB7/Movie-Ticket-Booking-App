import express from "express";
import { addMovie, getAllMovies, getMoviesById } from "../controllers/MovieControllers.js";

const movieRouter = express.Router();

movieRouter.get("/:id", getMoviesById);
movieRouter.get("/", getAllMovies);
movieRouter.post("/", addMovie);

export default movieRouter;