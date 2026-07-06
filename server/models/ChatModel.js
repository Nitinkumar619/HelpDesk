// Import the configured pool from your db config file
const pool = require('../config/db');

/**
 * Saves a new chat message to the database.
 * @param {number} userId - The ID of the user sending the message.
 * @param {string} message - The content of the chat message.
 * @param {string} fromRole - The role of the sender ('user' or 'admin').
 * @returns {Promise<void>}
 */
const saveChatMessage = async (userId, message, fromRole) => {
  // The SQL query uses $1, $2, $3 as placeholders for parameters, which is the standard for node-postgres.
  const query = 'INSERT INTO chat (user_id, message, from_role) VALUES ($1, $2, $3)';
  const values = [userId, message, fromRole];

  try {
    // Execute the query using the pool. No need for .promise()
    await pool.query(query, values);
    console.log('Chat message saved successfully.');
  } catch (error) {
    console.error('Error saving chat message:', error);
    // Re-throwing the error allows the calling function to handle it.
    throw error;
  }
};

/**
 * Fetches a limited number of chat messages for a specific user, ordered by most recent.
 * @param {number} userId - The ID of the user whose messages are to be fetched.
 * @param {number} limit - The maximum number of messages to retrieve.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of chat message objects.
 */
const getChatMessagesByUserId = async (userId, limit) => {
  // The query is updated to use PostgreSQL placeholders ($1, $2).
  // Note: The column name is 'createdAt' to be consistent with the schema corrections.
  const query = 'SELECT * FROM chat WHERE user_id = $1 ORDER BY createdAt DESC LIMIT $2';
  const values = [userId, limit];

  try {
    // The result object from pool.query contains a 'rows' property, which is an array of the results.
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    // Corrected the error variable name in the catch block.
    console.error('Error fetching chat messages by user ID:', error);
    throw error;
  }
};

/**
 * Fetches a unique list of all users who have ever sent a chat message.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects (id, name, email).
 */
const getChatMessageByUsers = async () => {
  // This SQL query is standard and requires no changes as it has no parameters.
  const query = `
    SELECT DISTINCT users.id, users.name, users.email
    FROM chat
    JOIN users ON chat.user_id = users.id
    ORDER BY users.name
  `;

  try {
    // Destructure 'rows' directly from the result of the query.
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    // Corrected the error variable name in the catch block.
    console.error('Error fetching users from chat messages:', error);
    throw error;
  }
};

// Export the functions for use in other parts of the application.
module.exports = {
  saveChatMessage,
  getChatMessagesByUserId,
  getChatMessageByUsers
};
