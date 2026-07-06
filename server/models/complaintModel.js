// Import the configured pool and other dependencies
const pool = require("../config/db");
require("dotenv").config();
const {
  sendTicketSubmissionMail,
  adminAssignedPersonnelMail,
  complaintResolvedMail
} = require("../utils/mailer");

// Helper function to generate a random 4-digit code for tickets
const generateCode = () => Math.floor(1000 + Math.random() * 9000);

/**
 * Fetches all complaints with joined user, personnel, and type information.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of all complaint objects.
 */
const getAll = async () => {
  // The SQL query is standard and requires no changes.
  const sql = `
    SELECT 
      c.*, 
      u.name AS name,
      u.email AS email,
      p.name AS assigned_name, 
      p.contact AS assigned_contact,
      ct.type_name AS complaint_type
    FROM complaints c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN personnel p ON c.assigned_personnel_id = p.id
    LEFT JOIN complaint_types ct ON c.complaint_type_id = ct.id
    ORDER BY c.createdAt DESC
  `;
  try {
    const { rows } = await pool.query(sql);
    return rows;
  } catch (error) {
    console.error('Error fetching all complaints:', error);
    throw error;
  }
};

/**
 * Creates a new complaint and sends a confirmation email.
 * @param {Object} complaint - An object containing the complaint details.
 * @returns {Promise<Object>} A promise that resolves to the result of the insert operation.
 */
const createComplaint = async (complaint) => {
  const { name, email, priority, location, type, message, attachments } = complaint;
  const code = generateCode();

  // The query is updated to use PostgreSQL placeholders ($1, $2, etc.).
  const sql = `
    INSERT INTO complaints 
    (priority, location, complaint_type_id, message, attachments, code, user_id)
    VALUES (
      $1, $2, 
      (SELECT id FROM complaint_types WHERE type_name = $3 LIMIT 1),
      $4, $5, $6, 
      (SELECT id FROM users WHERE email = $7 LIMIT 1)
    )
    RETURNING *
  `;
  const values = [priority, location, type, message, attachments, code, email];

  try {
    const { rows } = await pool.query(sql, values);
    // After successfully inserting, send the confirmation email.
    await sendTicketSubmissionMail(email, name, type, code);
    return rows[0]; // Return the newly created complaint
  } catch (error) {
    console.error('Error creating complaint:', error);
    throw error;
  }
};

/**
 * Fetches all complaints for a specific user by their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of the user's complaints.
 */
const getUserComplaint = async (email) => {
  // First, get the user's ID from their email.
  const userQuery = "SELECT id FROM users WHERE email = $1";
  const { rows: userRows } = await pool.query(userQuery, [email]);

  if (userRows.length === 0) {
    throw new Error("User not found");
  }
  const user_id = userRows[0].id;

  // Then, fetch all complaints associated with that user ID.
  const q = `
    SELECT 
      c.*, 
      ct.type_name AS type, 
      f.rating AS feedback, 
      p.name AS assigned_personnel_name
    FROM complaints c
    LEFT JOIN complaint_types ct ON c.complaint_type_id = ct.id
    LEFT JOIN feedback f ON f.complaint_id = c.id
    LEFT JOIN personnel p ON c.assigned_personnel_id = p.id
    WHERE c.user_id = $1
    ORDER BY c.createdAt DESC
  `;
  try {
    const { rows } = await pool.query(q, [user_id]);
    return rows;
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    throw error;
  }
};

/**
 * Assigns a personnel to a complaint, updates statuses, and sends a notification email.
 * @param {number} id - The ID of the complaint.
 * @param {string} assignedName - The name of the personnel being assigned.
 * @param {string} assignedContact - The contact of the personnel being assigned.
 * @returns {Promise<void>}
 */
const assignPersonnel = async (id, assignedName, assignedContact) => {
  // Step 1: Find the personnel ID.
  const fetchPersonnel = "SELECT id FROM personnel WHERE name = $1 AND contact = $2";
  const { rows: personnelRows } = await pool.query(fetchPersonnel, [assignedName, assignedContact]);

  if (personnelRows.length === 0) {
    throw new Error("Personnel not found.");
  }
  const personnelId = personnelRows[0].id;

  // Step 2: Update the complaint to assign the personnel and change status.
  const updateComplaint = "UPDATE complaints SET assigned_personnel_id = $1, status = 'Assigned' WHERE id = $2";
  await pool.query(updateComplaint, [personnelId, id]);

  // Step 3: Set the personnel's availability to FALSE (unavailable).
  const updatePersonnel = "UPDATE personnel SET available = FALSE WHERE id = $1";
  await pool.query(updatePersonnel, [personnelId]);

  // Step 4: Get user details to send a notification email.
  const getUserDetails = `
    SELECT u.name, u.email, ct.type_name
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    JOIN complaint_types ct ON c.complaint_type_id = ct.id
    WHERE c.id = $1
  `;
  const { rows: userDetailsRows } = await pool.query(getUserDetails, [id]);

  if (userDetailsRows.length > 0) {
    const { name, email, type_name } = userDetailsRows[0];
    // Step 5: Send the email.
    await adminAssignedPersonnelMail(email, name, type_name, assignedName, assignedContact);
  }
};

/**
 * Marks a complaint as resolved, releases the personnel, and sends a notification email.
 * @param {number} id - The ID of the complaint to resolve.
 * @returns {Promise<void>}
 */
const markResolved = async (id) => {
  // Step 1: Get complaint details to find the user and assigned personnel.
  const getComplaintDetails = `
    SELECT c.assigned_personnel_id, u.name, u.email, ct.type_name
    FROM complaints c
    JOIN users u ON c.user_id = u.id
    JOIN complaint_types ct ON c.complaint_type_id = ct.id
    WHERE c.id = $1
  `;
  const { rows } = await pool.query(getComplaintDetails, [id]);

  if (rows.length === 0) {
    throw new Error("Complaint not found");
  }
  const { assigned_personnel_id: personnelId, name, email, type_name: type } = rows[0];

  // Step 2: Update the complaint's status to 'Resolved'.
  const updateComplaint = "UPDATE complaints SET status = 'Resolved' WHERE id = $1";
  await pool.query(updateComplaint, [id]);

  // Step 3: Send the notification email.
  await complaintResolvedMail(email, name, type);

  // Step 4: If a personnel was assigned, update their status to available.
  if (personnelId) {
    const updatePersonnel = "UPDATE personnel SET available = TRUE WHERE id = $1";
    await pool.query(updatePersonnel, [personnelId]);
  }
};

/**
 * Tracks a ticket's status using the user's email and the ticket code.
 * @param {string} email - The user's email.
 * @param {string} code - The 4-digit ticket code.
 * @returns {Promise<Array<Object>>} A promise that resolves to the ticket's status information.
 */
const trackTicket = async (email, code) => {
  const sql = `
    SELECT c.status, 
           p.name AS personnel_name, 
           p.contact AS personnel_contact 
    FROM complaints c 
    JOIN users u ON c.user_id = u.id
    LEFT JOIN personnel p ON c.assigned_personnel_id = p.id 
    WHERE u.email = $1 AND c.code = $2
  `;
  try {
    const { rows } = await pool.query(sql, [email, code]);
    return rows;
  } catch (error) {
    console.error('Error tracking ticket:', error);
    throw error;
  }
};

/**
 * Fetches all available complaint types.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of complaint type objects.
 */
const getComplaintTypes = async () => {
  const query = "SELECT id, type_name FROM complaint_types ORDER BY type_name";
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching complaint types:', error);
    throw error;
  }
};

module.exports = {
  getAll,
  createComplaint,
  getUserComplaint,
  assignPersonnel,
  markResolved,
  trackTicket,
  getComplaintTypes
};
