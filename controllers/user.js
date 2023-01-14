/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModal from "../models/user.js";
dotenv.config();
const secret = process.env.SECRET_HASH;

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const oldUser = await UserModal.findOne({ email });
        if (!oldUser)
            return res.status(404).json({ message: "User doesn't exist" });
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
        if (!isPasswordCorrect)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
            expiresIn: "1h",
        });
        res.status(200).json({ result: oldUser, token });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
export const signup = async (req, res) => {
    const { email, password, firstName, lastName, googleId, selectedFile } =
    req.body;

    try {
        const oldUser = await UserModal.findOne({ email });

        if (oldUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const result = await UserModal.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
            selectedFile: selectedFile,
            googleId: googleId,
        });

        const token = jwt.sign({ email: result.email, id: result._id }, secret, {
            expiresIn: "1h",
        });

        res.status(201).json({ result, token });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};
export const googleSignUp = async (req, res) => {
    let { email, password, firstName, googleId, selectedFile } =
    req.body;
    password = process.env.GOOGLE_PASSWORD;
    try {
        const oldUser = await UserModal.findOne({ email });

        if (oldUser) {
            const token = jwt.sign(
                { email: oldUser.email, id: oldUser._id },
                secret,
                { expiresIn: "1h" }
            );
            res.status(200).json({ result: oldUser, token });
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);

            const result = await UserModal.create({
                email,
                password: hashedPassword,
                name: `${firstName}`,
                selectedFile: selectedFile,
                googleId: googleId,
            });

            const token = jwt.sign({ email: result.email, id: result._id }, secret, {
                expiresIn: "1h",
            });

            res.status(201).json({ result, token });
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });

        console.log(error);
    }
};
export const updateProfile = async (req, res) => {
    const { id, name, selectedFile } = req.body;
    const user = await UserModal.findOne({ _id: id });
    const updateduser = {
        _id: user._id,
        email: user.email,
        password: user.password,
        googleId: user.googleId,
        name: name,
        selectedFile: selectedFile,
    };
    await UserModal.findByIdAndUpdate(id, updateduser, { new: true });

    res.json(updateduser);
};
