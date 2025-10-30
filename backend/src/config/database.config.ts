import mongoose from "mongoose";
import { Env } from "../config/env.config";

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(Env.MONGODB_URI!);
        console.log("Connected to MongoDB database.", connection.connection.db?.databaseName);
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;