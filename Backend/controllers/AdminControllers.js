import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const handleError = (res, err, message, status = 500) => {
  console.error(err);
  return res.status(status).json({ message });
};

export const adminSignup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin Already Exists!" });
    }

    const hashedPassword = bcrypt.hashSync(password);
    const admin = new Admin({ email, password: hashedPassword });

    await admin.save();
    return res.status(201).json({ admin });
  } catch (err) {
    return handleError(res, err, "Cannot store admin");
  }
};

export const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });

    if (!existingAdmin) {
      return res.status(404).json({ message: "Cannot Find Such Admin" });
    }

    const comparePassword = bcrypt.compareSync(
      password,
      existingAdmin.password
    );

    if (!comparePassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    return res
      .status(200)
      .json({ message: "Login Successful", token, id: existingAdmin._id });
  } catch (err) {
    return handleError(res, err, "Login Failed");
  }
};

export const getAllAdmin = async (req, res, next) => {
  try {
    const admins = await Admin.find();

    if (!admins) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ admins });
  } catch (err) {
    return handleError(res, err, "Fetching Admins Failed");
  }
};

export const getAdminById = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findById(id).populate("addedMovies", "title");
  } catch (err) {
    return handleError(res, err, "Fetching Admins Failed");
  }
  if (!admin) {
    return res.status(404).json({ message: "Admin Not Found" });
  }
  return res.status(200).json({ admin });
};
