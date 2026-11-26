
import express from "express";
import User from "../models/users.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jsonwebtoken from "jsonwebtoken";


const createUserSchema = Joi.object({
    name:Joi.string().min(3).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    deliveryAddress:Joi.string().min(5).required()
})

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, password, deliveryAddress } = req.body;

      const joiValidation=  createUserSchema.validate(req.body);
      if(joiValidation.error){
        return res.status(400).json(joiValidation.error.details[0].message);
      }

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


const token = Jwt.sign({_id:newUser._id, name:newUser.name}, 
    process.env.JWT_KEY,
    {expiresIn:"2h"}

);


res.status(201).json(newUser);
export default router;
