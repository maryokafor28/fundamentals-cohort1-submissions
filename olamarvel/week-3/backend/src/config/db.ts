import mongoose from "mongoose";

export default function connectDb(){
    if(!process.env.DB_URI){
        throw new Error("DB_URI is not defined in environment variables");
    }
    mongoose.connect(process.env.DB_URI)
}