import express from 'express';
import { adminLogin, adminSignup, getAllAdmin } from '../controllers/AdminControllers.js';

const adminRouter = express.Router();

adminRouter.post("/signup",adminSignup);

adminRouter.post("/login",adminLogin);

adminRouter.get("/", getAllAdmin);

export default adminRouter;

