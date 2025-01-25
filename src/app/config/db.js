import mongoose from "mongoose";

export const connectionStr = process.env.MONGO_URI;

export async function connectDB() {
    try {
        await mongoose.connect(connectionStr);
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}