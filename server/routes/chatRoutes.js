const express = require('express');
const router = express.Router();
const {
  sendMessages,
  getMessages,
  getMessageByUsers
} = require("../controllers/chatController");
const { authenticate,authorise } = require('../middleware/authMiddleware');


// Handles sending a new message
router.post('/',authenticate,authorise(['user','admin']),sendMessages);

// Handles fetching messages for a specific user
router.get('/', authenticate,authorise(['user','admin']),getMessages);

// Handles fetching all users who have chatted
router.get('/users',authenticate,authorise(['user','admin']), getMessageByUsers);

module.exports = router;