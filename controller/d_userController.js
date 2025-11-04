import d_user from "../models/d_userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
// ✅ Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      phone,
      address,
      postalCode,
      city,
      country,
    } = req.body;

    // Check if email already exists
    const existingEmail = await d_user.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if username already exists
    const existingUsername = await d_user.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await d_user.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      postalCode,
      city,
      country,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN (Email or Username)
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    // Find user by email or username
    let user = await d_user.findOne({ email: identifier });
    if (!user) {
      user = await d_user.findOne({ username: identifier });
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid username/email or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ message: "Invalid username/email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "User logged in successfully",
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await d_user.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    let user = await d_user.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const {
      username,
      email,
      phone,
      address,
      postalCode,
      city,
      country,
      password,
    } = req.body;

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (postalCode) user.postalCode = postalCode;
    if (city) user.city = city;
    if (country) user.country = country;

    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    const updatedUser = await d_user.findById(req.user._id).select("-password");

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE USER
export const deleteUserProfile = async (req, res) => {
  try {
    await d_user.findByIdAndDelete(req.user._id);
    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const user = await d_user.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { oldPassword, newPassword } = req.body;

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect old password" });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ CHANGE EMAIL
export const changeEmail = async (req, res) => {
  try {
    const user = await d_user.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { newEmail, password } = req.body;

    // Verify current password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // Check if email already exists
    const existingUser = await d_user.findOne({ email: newEmail });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // Update email
    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await d_user.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with this email" });

    // Generate 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetPasswordCode = code;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This must be the App Password, not your normal Gmail password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${code}`,
    });

    res.status(200).json({ message: "Reset code sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await d_user.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (user.resetPasswordCode !== code)
      return res.status(400).json({ message: "Invalid code" });

    if (Date.now() > user.resetPasswordExpires)
      return res.status(400).json({ message: "Code expired" });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
