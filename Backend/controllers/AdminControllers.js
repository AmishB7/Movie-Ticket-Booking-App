import Admin from "../models/Admin.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const handleError = (res, err, message, status = 500) => {
    console.error(err);
    return res.status(status).json({ message });
};

/**
 * Handles the signup process for admins, validates input, checks for existing admin,
 * hashes the password, creates a new admin, saves it to the database, and returns the admin information.
 *
 * @param {Object} req - The request object containing email and password
 * @param {Object} res - The response object for sending responses
 * @param {Function} next - The next function in the middleware chain
 * @return {Object} JSON response with admin information
 */
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

/**
 * Handles the login process for admins, validates input, finds the admin in the database,
 * compares passwords, generates a token upon successful login, and returns appropriate responses.
 *
 * @param {Object} req - The request object containing email and password
 * @param {Object} res - The response object for sending responses
 * @param {Function} next - The next function in the middleware chain
 * @return {Object} JSON response indicating login success or failure
 */
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

        const comparePassword = bcrypt.compareSync(password, existingAdmin.password);

        if (!comparePassword) {
            return res.status(400).json({ message: "Incorrect Password" });
        }

        const token = jwt.sign(
            { id: existingAdmin._id },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        return res.status(200).json({ message: "Login Successful", token, id: existingAdmin._id });

    } catch (err) {
        return handleError(res, err, "Login Failed");
    }
};

/**
 * Retrieves all admins from the database and returns them.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {Object} JSON object with admins or an error message
 */
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
