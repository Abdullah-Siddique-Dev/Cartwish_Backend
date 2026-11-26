
import express from "express";
import User from "../models/users.js";
import Joi from "joi";
import { hashPassword } from "../utils/hashpass.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

const createUserSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    deliveryAddress: Joi.string().min(5).required()
});

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, password, deliveryAddress } = req.body;

        const joiValidation = createUserSchema.validate(req.body);

        if (joiValidation.error) {
            return res.status(400).json({
                message: joiValidation.error.details[0].message
            });
        }

        const user = await User.findOne({
            email: email
        });

        if (user) {
            return res.status(400).json({
                message: "User already exist."
            });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            deliveryAddress: deliveryAddress,
        });

        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign(
            {
                _id: newUser._id,
                role: newUser.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            message: "User registered successfully",
            token: token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                deliveryAddress: newUser.deliveryAddress
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
});

export default router;
