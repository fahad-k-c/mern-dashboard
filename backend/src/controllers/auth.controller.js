import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePic: "", // Optional: Default profile picture or empty string
    });

    // Save the user and generate a token
    await newUser.save();
    generateToken(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the stored password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate and send the token
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }
    const uploadResponse = await cloudinary.updateProfile(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
