import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:true,
         minglength: 5
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true
    },
    deliveryAddress:{
        type:String,
        required:true,
        minglength: 5
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },
    }
)

const User = mongoose.model("User", userSchema);

export default User;
