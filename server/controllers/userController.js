const {
  createUser,
  findUserByEmail,
  getUserDetailsByEmail,
  addFeedback // Using the combined feedback function from the model
} = require('../models/userModel');

const pool = require('../config/db'); // Use pool for direct queries if needed
const crypto = require("crypto");
const { sendForgotPasswordMail } = require("../utils/mailer");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { userSchema } = require('../schemas/userSchema');
const { feedbackSchema } = require('../schemas/feedbackSchema');
const { generateToken,verifyToken } = require('../utils/utility');
const SECRET_KEY = process.env.SECRET_KEY;

// In-memory store for password reset tokens. In a production environment,
// this should be replaced with a more persistent store like Redis or a database table.
const resetTokens = {};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Use the prebuilt generateToken function
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

/**
 * Controller to handle new user registration (signup).
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const signup = async (req, res) => {
  try {
    const parseResult = userSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: parseResult.error.errors,
      });
    }
    const { name, email, password } = parseResult.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword, 'user');

    // Use the prebuilt generateToken function
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { name: newUser.name, email: newUser.email, isAdmin: false },
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

/**
 * Controller to fetch public details for a specific user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const userDetails = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getUserDetailsByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * Controller to handle submission of feedback for a complaint.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const feedback = async (req, res) => {
  try {
    const parseResult = feedbackSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: parseResult.error.errors,
      });
    }

    const { complaint_id, user_id, assigned_personnel_id, rating, comment } = parseResult.data;

    // The addFeedback model function now handles checking, inserting, and updating.
    await addFeedback(complaint_id, user_id, assigned_personnel_id, rating, comment);

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully.",
    });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    // Handle the specific error for already submitted feedback
    if (error.message.includes("already been submitted")) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback.",
    });
  }
};

/**
 * Controller to initiate the password reset process.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const query = `SELECT name FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);

    if (rows.length === 0) {
      // Still return success to prevent user enumeration
      return res.status(200).json({ success: true, message: "If a user with that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 1000 * 60 * 60; // 1 hour validity

    resetTokens[token] = { email, expiresAt };

    const resetLink = `http://localhost:5173/reset-password/${token}`;
    await sendForgotPasswordMail(email, rows[0].name, resetLink);

    res.json({ success: true, message: "If a user with that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).send("Error sending reset email.");
  }
};

/**
 * Controller to handle the final password reset with a valid token.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const entry = resetTokens[token];

    if (!entry || entry.expiresAt < Date.now()) {
      return res.status(400).send("Invalid or expired token.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const email = entry.email;

    const updateQuery = `UPDATE users SET password = $1 WHERE email = $2`;
    await pool.query(updateQuery, [hashedPassword, email]);

    delete resetTokens[token]; // Invalidate the token after use
    res.send("Password has been reset successfully. You can now log in.");

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Database error while resetting password." });
  }
};

module.exports = {
  login,
  signup,
  userDetails,
  feedback,
  ForgotPassword,
  ResetPassword,
};
