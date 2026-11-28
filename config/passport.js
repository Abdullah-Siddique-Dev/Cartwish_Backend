import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// ═══════════════════════════════════════════════════════════
// GOOGLE OAUTH STRATEGY CONFIGURATION
// ═══════════════════════════════════════════════════════════

passport.use(
    new GoogleStrategy(
        {
            // 1. CLIENT ID - Identifies your application to Google
            clientID: process.env.GOOGLE_CLIENT_ID,

            // 2. CLIENT SECRET - Secret key to verify your application
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            // 3. CALLBACK URL - Where Google redirects after user logs in
            // This MUST match the URL you added in Google Console
            callbackURL: "http://localhost:3000/auth/google/callback",

            // 4. PASS REQUEST TO CALLBACK - Allows access to req object
            passReqToCallback: true,
        },

        // ═══════════════════════════════════════════════════════════
        // VERIFY CALLBACK FUNCTION
        // This runs AFTER user successfully logs in with Google
        // ═══════════════════════════════════════════════════════════
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                // STEP 1: Check if user already exists in database
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User exists - log them in
                    return done(null, user);
                } else {
                    // User doesn't exist - create new user
                    const newUser = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        // No password needed for Google users
                    });

                    await newUser.save();
                    return done(null, newUser);
                }

            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// ═══════════════════════════════════════════════════════════
// SERIALIZE USER - Store user id in session
// Called when user logs in
// ═══════════════════════════════════════════════════════════
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// ═══════════════════════════════════════════════════════════
// DESERIALIZE USER - Retrieve full user object from id
// Called on every request to get user data
// ═══════════════════════════════════════════════════════════
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
