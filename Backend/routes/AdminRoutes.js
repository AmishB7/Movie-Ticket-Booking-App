import express from "express";
import {
  adminLogin,
  adminSignup,
  getAllAdmin,
  getAdminById,
} from "../controllers/AdminControllers.js";

const adminRouter = express.Router();

adminRouter.post("/signup", adminSignup);

adminRouter.post("/login", adminLogin);

adminRouter.get("/", getAllAdmin);

adminRouter.get("/:id", getAdminById);

export default adminRouter;
