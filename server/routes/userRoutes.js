const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  userDetails,
  feedback,
  ForgotPassword,
  ResetPassword
} = require('../controllers/userController');
const { authorise, authenticate } = require('../middleware/authMiddleware');

// Route for user login
router.post('/login', login);

// Route for new user registration
router.post('/signup', signup);

// Route to initiate the password reset process
router.post("/forgot-password", ForgotPassword);

// Route to finalize the password reset with a token
router.post("/reset-password/:token", ResetPassword);

// Route to submit feedback, protected by middleware
router.post("/feedback", authenticate,authorise(['admin','user']), feedback);

// Route to get a user's details, protected by middleware
router.get("/:email", authenticate,authorise(['admin','user']), userDetails);

module.exports = router;