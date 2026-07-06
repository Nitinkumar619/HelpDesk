// Import the configured pool from your db config file
const pool = require('../config/db');

/**
 * Finds a single user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<Object|undefined>} A promise that resolves to the user object or undefined if not found.
 */
const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  try {
    const { rows } = await pool.query(query, [email]);
    // Return the first user found, or undefined if no user exists with that email.
    return rows[0];
  } catch (error) {
    console.error(`Error finding user by email ${email}:`, error);
    throw error;
  }
};

/**
 * Creates a new user in the database.
 * @param {string} name - The user's full name.
 * @param {string} email - The user's email address.
 * @param {string} hashedPassword - The user's hashed password.
 * @param {string} role - The user's role (e.g., 'user', 'admin').
 * @returns {Promise<Object>} A promise that resolves to the newly created user object.
 */
const createUser = async (name, email, hashedPassword, role) => {
  // RETURNING * is a PostgreSQL feature that returns the entire row that was just inserted.
  const query = "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *";
  const values = [name, email, hashedPassword, role];
  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Fetches public details (name and email) for a user by their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object|undefined>} A promise that resolves to the user's details or undefined if not found.
 */
const getUserDetailsByEmail = async (email) => {
  const query = "SELECT name, email FROM users WHERE email = $1";
  try {
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error(`Error getting user details for email ${email}:`, error);
    throw error;
  }
};

/**
 * Inserts feedback for a complaint and marks the complaint as having feedback.
 * This function combines checking, inserting, and updating into a single transaction-like operation.
 * @param {number} complaint_id - The ID of the complaint.
 * @param {number} user_id - The ID of the user giving feedback.
 * @param {number} assigned_personnel_id - The ID of the personnel being reviewed.
 * @param {number} rating - The rating given (1-5).
 * @param {string} comment - The feedback comment.
 * @returns {Promise<Object>} A promise that resolves to the newly created feedback object.
 */
const addFeedback = async (complaint_id, user_id, assigned_personnel_id, rating, comment) => {
  try {
    // Step 1: Check if feedback for this complaint already exists.
    const checkQuery = "SELECT id FROM feedback WHERE complaint_id = $1";
    const { rows: existingFeedback } = await pool.query(checkQuery, [complaint_id]);

    if (existingFeedback.length > 0) {
      throw new Error("Feedback has already been submitted for this complaint.");
    }

    // Step 2: Insert the new feedback.
    const insertQuery = `
      INSERT INTO feedback (complaint_id, user_id, assigned_personnel_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const insertValues = [complaint_id, user_id, assigned_personnel_id, rating, comment];
    const { rows } = await pool.query(insertQuery, insertValues);
    const newFeedback = rows[0];

    // Step 3: Mark the complaint as having feedback provided.
    const updateQuery = "UPDATE complaints SET feedback_given = TRUE WHERE id = $1";
    await pool.query(updateQuery, [complaint_id]);

    console.log(`Feedback added and complaint ${complaint_id} updated.`);
    return newFeedback;

  } catch (error) {
    console.error(`Error adding feedback for complaint ${complaint_id}:`, error);
    throw error;
  }
};


module.exports = {
  createUser,
  findUserByEmail,
  getUserDetailsByEmail,
  addFeedback
};
