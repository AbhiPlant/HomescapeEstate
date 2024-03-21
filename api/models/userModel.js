import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1495088043%2Fvector%2Fuser-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DdhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0%3D&tbnid=LM8-AM5jyhEXvM&vet=12ahUKEwjPrKjvguOEAxXH0KACHf9tAfAQMygEegQIARB4..i&imgrefurl=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fempty-profile-picture&docid=moJO9Z5eXM4X5M&w=612&h=612&q=profile%20image&ved=2ahUKEwjPrKjvguOEAxXH0KACHf9tAfAQMygEegQIARB4"
    }
},{timestamps:true});

const User = mongoose.model("User",userSchema);

export default User;