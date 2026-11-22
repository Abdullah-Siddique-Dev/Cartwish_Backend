
import express from "express";
import User from "../models/users.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, password, deliveryAddress } = req.body;

        const user = await User.findOne({
            email: email
        });

        if (user) {
            return res.status(400).json({
                message: "User already exist."
            });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: password,
            deliveryAddress: deliveryAddress,
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                deliveryAddress: newUser.deliveryAddress,
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
