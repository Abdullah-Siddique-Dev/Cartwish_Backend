import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3  // Fixed typo: minglength → minLength
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: false  // Not required for Google OAuth users
    },
    deliveryAddress: {
        type: String,
        required: false,  // Optional for Google users initially
        minLength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true  // Allows null values, only enforces uniqueness when present
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

const User = mongoose.model("User", userSchema);

export default User;
