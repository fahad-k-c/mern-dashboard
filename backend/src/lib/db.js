import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    // Connect to MongoDB without deprecated options
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the application if the connection fails
  }
};
