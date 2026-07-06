// Import the configured pool from your db config file
const pool = require("../config/db");

/**
 * Fetches all records from the personnel table.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of all personnel objects.
 */
const getAll = async () => {
  const query = "SELECT * FROM personnel ORDER BY name";
  try {
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error fetching all personnel:', error);
    throw error;
  }
};

/**
 * Fetches all available personnel for a specific role.
 * @param {string} role - The role to filter by (e.g., 'Plumbing', 'Network').
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of available personnel for that role.
 */
const getAvailableByRole = async (role) => {
  // Use $1 as the placeholder for the role parameter.
  const query = "SELECT * FROM personnel WHERE role = $1 AND available = TRUE ORDER BY name";
  const values = [role];
  try {
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    console.error(`Error fetching available personnel for role ${role}:`, error);
    throw error;
  }
};

/**
 * Updates a personnel's status to unavailable (assigned).
 * @param {number} id - The ID of the personnel to assign.
 * @returns {Promise<void>}
 */
const assignPersonnel = async (id) => {
  const query = "UPDATE personnel SET available = FALSE WHERE id = $1";
  const values = [id];
  try {
    await pool.query(query, values);
    console.log(`Personnel with ID ${id} has been assigned.`);
  } catch (error) {
    console.error(`Error assigning personnel with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Updates a personnel's status to available (released).
 * @param {number} id - The ID of the personnel to release.
 * @returns {Promise<void>}
 */
const releasePersonnel = async (id) => {
  const query = "UPDATE personnel SET available = TRUE WHERE id = $1";
  const values = [id];
  try {
    await pool.query(query, values);
    console.log(`Personnel with ID ${id} has been released.`);
  } catch (error) {
    console.error(`Error releasing personnel with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Adds a new person to the personnel table.
 * @param {Object} person - An object containing the new personnel's details.
 * @param {string} person.name - The name of the person.
 * @param {string} person.contact - The contact number of the person.
 * @param {string} person.role - The role of the person.
 * @returns {Promise<Object>} A promise that resolves to the newly created personnel object.
 */
const addPersonnel = async (person) => {
  // Use TRUE for boolean values in PostgreSQL.
  // RETURNING * will return the entire newly created row.
  const query = `
    INSERT INTO personnel (name, contact, role, available) 
    VALUES ($1, $2, $3, TRUE) 
    RETURNING *
  `;
  const values = [person.name, person.contact, person.role];
  try {
    const { rows } = await pool.query(query, values);
    console.log('New personnel added:', rows[0]);
    return rows[0]; // Return the new personnel record
  } catch (error) {
    console.error('Error adding new personnel:', error);
    throw error;
  }
};

module.exports = {
  getAll,
  getAvailableByRole,
  assignPersonnel,
  releasePersonnel,
  addPersonnel
};
