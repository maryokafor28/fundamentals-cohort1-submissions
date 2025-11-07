import mongoose from "mongoose";

export default function connectDb(){
    if(!process.env.Mongo_URI){
        throw new Error("Mongo_URI is not defined in environment variables");
    }
    mongoose.connect(process.env.Mongo_URI)
}