import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/product.route.js";

import express from "express";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

const app = express();
const port = process.env.PORT || 5001;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Add your frontend URL here
    credentials: true,
  })
);

// Route for authentication
app.use("/api/auth", authRoutes);
app.use("/api/products", router);

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit process if the database connection fails
  });
