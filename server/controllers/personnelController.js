const {
  getAll,
  getAvailableByRole,
  addPersonnel,
} = require("../models/PersonnelModel");

/**
 * Controller to fetch all personnel records.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getPersonnels = async (req, res) => {
  try {
    const result = await getAll();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching personnel:", error);
    res.status(500).json({ success: false, message: "Error fetching personnel" });
  }
};

/**
 * Controller to fetch all available personnel filtered by a specific role.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getAvailablePersonnels = async (req, res) => {
  try {
    const { role } = req.params;
    const result = await getAvailableByRole(role);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error fetching available personnel:", error);
    res.status(500).json({ success: false, message: "Error fetching available personnel" });
  }
};

/**
 * Controller to add a new personnel record.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addPersonnels = async (req, res) => {
  try {
    const { name, contact, role } = req.body;

    if (!name || !contact || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    await addPersonnel({ name, contact, role });

    res.status(201).json({ success: true, message: "Personnel added successfully" });
  } catch (error) {
    console.error("Error adding personnel:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getPersonnels,
  getAvailablePersonnels,
  addPersonnels
};
