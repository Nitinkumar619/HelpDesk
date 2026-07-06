const {
  createComplaint,
  getAll,
  getUserComplaint,
  assignPersonnel,
  markResolved,
  trackTicket,
  getComplaintTypes
} = require('../models/complaintModel');

/**
 * Controller to handle the submission of a new complaint.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const submitComplaint = async (req, res) => {
  try {
    const { name, email, priority, location, type, message } = req.body;
    // Process file attachments, creating a comma-separated string of filenames.
    const attachments = req.files?.map((file) => file.filename).join(",") || "";

    if (!name || !email || !priority || !location || !type || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    const complaint = { name, email, priority, location, type, message, attachments };

    await createComplaint(complaint);

    res.status(201).json({
      success: true,
      message: "Ticket submitted and email sent."
    });
  } catch (error) {
    console.error("Error submitting complaint:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting complaint'
    });
  }
};

/**
 * Controller to fetch all complaints from the database.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getAllComplaints = async (req, res) => {
  try {
    const results = await getAll();
    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error fetching all complaints:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints"
    });
  }
};

/**
 * Controller to fetch all complaints for a specific user.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getUserComplaints = async (req, res) => {
  try {
    const { email } = req.params;
    const results = await getUserComplaint(email);
    res.status(200).json({
      success: true,
      complaints: results
    });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user complaints"
    });
  }
};

/**
 * Controller to assign a personnel to a specific complaint.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const assign = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedName, assignedContact } = req.body;

    if (!assignedName || !assignedContact) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both name and contact of personnel'
      });
    }

    await assignPersonnel(id, assignedName, assignedContact);

    res.status(200).json({
      success: true,
      message: "Personnel assigned successfully"
    });
  } catch (error) {
    console.error("Error assigning personnel:", error);
    // Check for the specific "Personnel not found" error thrown from the model
    if (error.message === "Personnel not found.") {
      return res.status(404).json({
        success: false,
        message: "Personnel not found"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to assign personnel"
    });
  }
};

/**
 * Controller to mark a complaint as resolved.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const resolvedComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    await markResolved(id);
    res.status(200).json({
      success: true,
      message: "Complaint marked as resolved"
    });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resolve complaint"
    });
  }
};

/**
 * Controller to track a ticket by email and code.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const track = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and ticket code are required"
      });
    }

    const results = await trackTicket(email, code);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    const { status, personnel_name, personnel_contact } = results[0];
    const response = { success: true, status };

    if (status === 'Assigned') {
      response.personnel = {
        name: personnel_name,
        contact: personnel_contact
      };
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Error tracking ticket:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/**
 * Controller to fetch all available complaint types.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const complaintTypes = async (req, res) => {
  try {
    const results = await getComplaintTypes();
    res.status(200).json({
      success: true,
      complaintTypes: results
    });
  } catch (error) {
    console.error("Error fetching complaint types:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  submitComplaint,
  getAllComplaints,
  getUserComplaints,
  assign,
  resolvedComplaint,
  track,
  complaintTypes
};
