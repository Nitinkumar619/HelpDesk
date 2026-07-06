const express = require("express");
const router = express.Router();
const {
  getPersonnels,
  getAvailablePersonnels,
  addPersonnels
} = require("../controllers/personnelController");
const { authenticate, authorise } = require("../middleware/authMiddleware");
// GET all personnel records
router.get("/",authenticate,authorise(['admin','user']), getPersonnels);

// GET available personnel filtered by role
router.get("/available/:role",authenticate,authorise(['admin','user']), getAvailablePersonnels);

// POST a new personnel record
router.post("/",authenticate,authorise(['admin','user']), addPersonnels);

module.exports = router;