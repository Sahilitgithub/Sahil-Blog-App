import mongoose from 'mongoose';

let isConnected: boolean = false; // Track the connection status

const DbConnect = async (): Promise<void> => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined in the .env file");
    }

    // If already MongoDB is connected, skip the connection
    if (isConnected) {
        console.log("Mongodb is already connected");
        return;
    }

    try {
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true; // Set connection status to true
        console.log("Mongodb connected successfully");

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error("Mongodb connection error:", err);
            isConnected = false; // Mark the connection as false
        });

        mongoose.connection.on('disconnected', () => {
            console.log("Mongoose connection disconnected");
            isConnected = false; // Mark the connection as false
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error while connecting to MongoDB:", error.message);
        } else {
            console.error("Unknown error while connecting to MongoDB");
        }
        // Optionally throw the error here or handle it as needed
        throw new Error("Could not connect to MongoDB");
    }
};

export default DbConnect;

