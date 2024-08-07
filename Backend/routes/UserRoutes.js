import express from "express";
import {
  deleteUser,
  getAllBookings,
  getAllUsers,
  login,
  signup,
  updateUser,
  getUserById,
} from "../controllers/UserControllers.js";

const UserRouter = express.Router();

UserRouter.get("/", getAllUsers);
UserRouter.get("/:id", getUserById);
UserRouter.post("/signup", signup);
UserRouter.put("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);
UserRouter.post("/login", login);
UserRouter.get("/bookings/:id", getAllBookings);

export default UserRouter;
