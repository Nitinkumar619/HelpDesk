const express = require("express");
const router = express.Router();
const {
  submitComplaint,
  getAllComplaints,
  getUserComplaints,
  assign,
  resolvedComplaint,
  track,
  complaintTypes
} = require("../controllers/complaintController");
const upload = require("../utils/upload");
const { authenticate, authorise } = require("../middleware/authMiddleware");

// GET all complaints (for admin)
router.get("/", authenticate,authorise(['admin','user']),getAllComplaints);

// POST a new complaint with optional file attachments
router.post("/", authenticate,authorise(['admin','user']),upload.array("attachments"), submitComplaint);

// GET all available complaint types
router.get("/complaint_types", authenticate,authorise(['admin','user']),complaintTypes);

// GET all complaints for a specific user by email
router.get("/user/:email", authenticate,authorise(['admin','user']),getUserComplaints);

// PUT to assign a personnel to a complaint
router.put("/:id/assign", authenticate,authorise(['admin','user']),assign);

// PATCH to mark a complaint as resolved
router.patch("/:id", authenticate,authorise(['admin','user']),resolvedComplaint);

// POST to track a ticket using email and code
router.post("/track", authenticate,authorise(['admin','user']),track);

module.exports = router;