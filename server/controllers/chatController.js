// Import the required model functions for chat operations
const {
  saveChatMessage,
  getChatMessageByUsers,
  getChatMessagesByUserId
} = require('../models/ChatModel');

/**
 * Controller to handle sending/saving a new chat message.
 * Expects userId, message, and fromRole in the request body.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const sendMessages = async (req, res) => {
  // Use camelCase 'fromRole' to be consistent with JavaScript conventions and the model function
  const { userId, message, fromRole } = req.body;

  if (!userId || !message || !fromRole) {
    return res.status(400).json({
      success: false,
      message: 'userId, message, and fromRole are required fields.'
    });
  }

  try {
    await saveChatMessage(userId, message, fromRole);
    return res.status(201).json({ // 201 Created is often more appropriate for successful resource creation
      success: true,
      message: 'Message sent successfully.'
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

/**
 * Controller to fetch chat messages for a specific user.
 * Expects user_id and an optional limit in the query parameters.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getMessages = async (req, res) => {
  // Use a more descriptive name for the userId from the query
  const { user_id: userId } = req.query;
  const limit = parseInt(req.query.limit) || 20; // Default to fetching 20 messages

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'user_id is required as a query parameter.'
    });
  }

  try {
    const rows = await getChatMessagesByUserId(userId, limit);
    // The query fetches messages in DESC order (newest first).
    // Reversing the array displays them from oldest to newest, which is typical for chat logs.
    rows.reverse();
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

/**
 * Controller to get a distinct list of users who have participated in chats.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getMessageByUsers = async (req, res) => {
  try {
    const rows = await getChatMessageByUsers();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};

module.exports = {
  getMessages,
  sendMessages,
  getMessageByUsers
};
