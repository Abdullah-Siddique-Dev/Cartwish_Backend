import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// ROUTE 1: Initiate Google OAuth
// When user clicks "Sign in with Google"
// ═══════════════════════════════════════════════════════════
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]  // Request access to profile and email
    })
);

// ═══════════════════════════════════════════════════════════
// ROUTE 2: Google OAuth Callback
// Google redirects here after user logs in
// ═══════════════════════════════════════════════════════════
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",  // Redirect here if authentication fails
        session: false  // We're using JWT, not sessions
    }),
    (req, res) => {
        // User is authenticated, generate JWT token
        const token = jwt.sign(
            {
                _id: req.user._id,
                email: req.user.email,
                role: req.user.role
            },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
        );

        // Redirect to frontend with token
        // In production, this would be your frontend URL
        res.redirect(`http://localhost:3000/auth/success?token=${token}`);

        // OR send JSON response:
        // res.json({
        //     message: "Login successful",
        //     token: token,
        //     user: {
        //         _id: req.user._id,
        //         name: req.user.name,
        //         email: req.user.email,
        //         role: req.user.role
        //     }
        // });
    }
);

export default router;
