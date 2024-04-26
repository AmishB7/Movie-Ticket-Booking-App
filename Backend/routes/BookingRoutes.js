import express from "express";
import { deleteBooking, getBookingById, newBooking } from "../controllers/BookingsController.js";

export const bookingsRouter = express.Router();

bookingsRouter.post("/",newBooking);
bookingsRouter.get("/:id",getBookingById);
bookingsRouter.delete("/:id",deleteBooking);