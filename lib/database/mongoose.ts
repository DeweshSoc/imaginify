import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    };
}

export const connectToDatabase = async () => {
    try {
        if (cached.conn) return cached.conn;
        console.log(MONGODB_URL);
        if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

        const connection = mongoose.connect(MONGODB_URL, {
            dbName: "imaginify",
            bufferCommands: false,
        });

        cached.promise = cached.promise || connection;

        cached.conn = await cached.promise;

        return cached.conn;
    } catch (err) {
        console.log(err);
    }
};
