import express from "express";

import mongoose from "mongoose";

const app = express();

import { router as userRoutes } from "./routes/users.js";



const MONGO_URI="mongodb+srv://cartwish:cart123@cluster0.b3gdydm.mongodb.net/"


async function connectDB(){
    try{

       await  mongoose.connect(MONGO_URI);

       console.log("Mongodb Connected Successfully!")
    }
    catch(err){

        console.log(`Failed to connect`, err);
    }
}


app.use(express.json());

app.use("/api/user",userRoutes);


const port =3000;

app.use(express.json());

app.listen(port,()=>{
    console.log(`App is listening at  port ${port}`);
})

connectDB();


