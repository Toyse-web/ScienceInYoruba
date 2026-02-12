import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

        return conn;
    } catch (err) {
        console.error(`Mongo connect error: ${err.message}`);
        process.exit(1);
    }
};