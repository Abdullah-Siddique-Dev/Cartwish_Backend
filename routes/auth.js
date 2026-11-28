import express from "express"
const passport from "passport"

const router=express.Router();

app.get('/auth/google',
    passport.authentication('google',{
        scope:['email','profile']
    })
)

module.exports = router;