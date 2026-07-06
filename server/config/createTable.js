// // const pool = require('./db');

// // const categories = [
// //   "Network",
// //   "Cleaning",
// //   "Carpentry",
// //   "PC Maintenance",
// //   "Plumbing",
// //   "Electricity",
// // ];

// // const createTable = async () => {
// //   try {
// //     // Users table
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS users (
// //         id SERIAL PRIMARY KEY,
// //         email VARCHAR(255) NOT NULL UNIQUE,
// //         password VARCHAR(255) NOT NULL,
// //         name VARCHAR(255),
// //         phone_number VARCHAR(15) UNIQUE,
// //         dob DATE,
// //         role TEXT CHECK (role IN ('user', 'admin', 'citizen')) NOT NULL DEFAULT 'user'
// //       );
// //     `);

// //     // Personnel table
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS personnel (
// //         id SERIAL PRIMARY KEY,
// //         name VARCHAR(100) NOT NULL,
// //         contact VARCHAR(15) NOT NULL,
// //         role TEXT CHECK (role IN ('Network', 'Cleaning', 'Carpentry', 'PC Maintenance', 'Plumbing', 'Electricity')) NOT NULL,
// //         available BOOLEAN NOT NULL
// //       );
// //     `);

// //     // Complaint types table
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS complaint_types (
// //         id SERIAL PRIMARY KEY,
// //         type_name VARCHAR(50) NOT NULL UNIQUE
// //       );
// //     `);

// //     // Complaints table
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS complaints (
// //         id SERIAL PRIMARY KEY,
// //         status TEXT CHECK (status IN ('Pending','Assigned','Resolved')) DEFAULT 'Pending',
// //         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// //         priority TEXT CHECK (priority IN ('Low','Medium','High')) DEFAULT 'Low',
// //         location VARCHAR(100),
// //         message TEXT,
// //         attachments TEXT,
// //         complaint_type_id INT REFERENCES complaint_types(id) ON DELETE SET NULL,
// //         assigned_personnel_id INT REFERENCES personnel(id) ON DELETE SET NULL,
// //         feedback_given BOOLEAN DEFAULT FALSE,
// //         user_id INT REFERENCES users(id) ON DELETE CASCADE,
// //         code VARCHAR(10)
// //       );
// //     `);

// //     // Feedback table
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS feedback (
// //         id SERIAL PRIMARY KEY,
// //         complaint_id INT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
// //         user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
// //         assigned_personnel_id INT NOT NULL REFERENCES personnel(id) ON DELETE SET NULL,
// //         rating INT CHECK (rating BETWEEN 1 AND 5),
// //         comment TEXT,
// //         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// //       );
// //     `);

// //     // Chat table
// //     await pool.query(`
// //       CREATE TABLE IF NOT EXISTS chat (
// //         id SERIAL PRIMARY KEY,
// //         user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
// //         message TEXT NOT NULL,
// //         from_role TEXT CHECK (from_role IN ('user', 'admin')) NOT NULL,
// //         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// //       );
// //     `);

// //     // ✅ Seed complaint types
// //     await pool.query(`
// //       INSERT INTO complaint_types (type_name)
// //       SELECT UNNEST($1::text[])
// //       ON CONFLICT (type_name) DO NOTHING;
// //     `, [categories]);

// //     console.log("✅ Tables created and complaint types seeded successfully");

// //   } catch (err) {
// //     console.error("❌ Error in creating tables:", err.stack);
// //   }
// // };

// // module.exports = { createTable };

// const pool = require('./db');

// const categories = [
//   "Network",
//   "Cleaning",
//   "Carpentry",
//   "PC Maintenance",
//   "Plumbing",
//   "Electricity",
// ];

// const createTable = async () => {
//   try {
//     // Users table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         name VARCHAR(255),
//         phone_number VARCHAR(15) UNIQUE,
//         dob DATE,
//         role TEXT CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user'
//       );
//     `);

//     // Personnel table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS personnel (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         contact VARCHAR(15) NOT NULL,
//         role TEXT CHECK (role IN ('Network', 'Cleaning', 'Carpentry', 'PC Maintenance', 'Plumbing', 'Electricity')) NOT NULL,
//         available BOOLEAN NOT NULL
//       );
//     `);

//     // Complaint types table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS complaint_types (
//         id SERIAL PRIMARY KEY,
//         type_name VARCHAR(50) NOT NULL UNIQUE
//       );
//     `);

//     // Complaints table (snake_case + added `type` column)
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS complaints (
//         id SERIAL PRIMARY KEY,
//         status TEXT CHECK (status IN ('Pending','Assigned','Resolved')) DEFAULT 'Pending',
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         priority TEXT CHECK (priority IN ('Low','Medium','High')) DEFAULT 'Low',
//         location VARCHAR(100),
//         message TEXT,
//         attachments TEXT,
//         type TEXT, -- ✅ Added column to match code
//         complaint_type_id INT REFERENCES complaint_types(id) ON DELETE SET NULL,
//         assigned_personnel_id INT REFERENCES personnel(id) ON DELETE SET NULL,
//         feedback_given BOOLEAN DEFAULT FALSE,
//         user_id INT REFERENCES users(id) ON DELETE CASCADE,
//         code VARCHAR(10)
//       );
//     `);

//     // Feedback table (snake_case)
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS feedback (
//         id SERIAL PRIMARY KEY,
//         complaint_id INT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
//         user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//         assigned_personnel_id INT NOT NULL REFERENCES personnel(id) ON DELETE SET NULL,
//         rating INT CHECK (rating BETWEEN 1 AND 5),
//         comment TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Chat table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS chat (
//         id SERIAL PRIMARY KEY,
//         user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//         message TEXT NOT NULL,
//         from_role TEXT CHECK (from_role IN ('user', 'admin')) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // ✅ Seed complaint types
//     await pool.query(`
//       INSERT INTO complaint_types (type_name)
//       SELECT UNNEST($1::text[])
//       ON CONFLICT (type_name) DO NOTHING;
//     `, [categories]);

//     console.log("✅ Tables created/updated and complaint types seeded successfully");

//   } catch (err) {
//     console.error("❌ Error in creating tables:", err.stack);
//   }
// };

// module.exports = { createTable };


const pool = require('./db');

// Define the categories for complaint types and personnel roles
const categories = [
  "Network",
  "Cleaning",
  "Carpentry",
  "PC Maintenance",
  "Plumbing",
  "Electricity",
];

/**
 * Creates all necessary tables in the PostgreSQL database if they don't already exist.
 * This version aligns column names and structure with the provided SQL schema,
 * while using appropriate PostgreSQL data types and constraints.
 */
const createTable = async () => {
  try {
    // Users table
    // Correctly uses TEXT for role with a CHECK constraint, which is the PostgreSQL equivalent of ENUM.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone_number VARCHAR(15) UNIQUE,
        dob DATE,
        role TEXT CHECK (role IN ('user', 'admin')) NOT NULL DEFAULT 'user'
      );
    `);

    // Personnel table
    // Uses BOOLEAN type, which is standard in PostgreSQL for true/false values.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personnel (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact VARCHAR(15) NOT NULL,
        role TEXT CHECK (role IN ('Network', 'Cleaning', 'Carpentry', 'PC Maintenance', 'Plumbing', 'Electricity')) NOT NULL,
        available BOOLEAN NOT NULL
      );
    `);

    // Complaint types table
    // This table helps normalize complaint categories.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS complaint_types (
        id SERIAL PRIMARY KEY,
        type_name VARCHAR(50) NOT NULL UNIQUE
      );
    `);

    // Complaints table
    // Renamed 'created_at' to 'createdAt' to match the target schema.
    // Removed the redundant 'type' column to rely solely on 'complaint_type_id'.
    // Foreign keys are defined inline with ON DELETE actions for data integrity.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id SERIAL PRIMARY KEY,
        status TEXT CHECK (status IN ('Pending','Assigned','Resolved')) DEFAULT 'Pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Renamed to match SQL schema
        priority TEXT CHECK (priority IN ('Low','Medium','High')) DEFAULT 'Low',
        location VARCHAR(100),
        message TEXT,
        attachments TEXT,
        complaint_type_id INT REFERENCES complaint_types(id) ON DELETE SET NULL,
        assigned_personnel_id INT REFERENCES personnel(id) ON DELETE SET NULL,
        feedback_given BOOLEAN DEFAULT FALSE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        code VARCHAR(10)
      );
    `);

    // Feedback table
    // Renamed 'created_at' to 'createdAt' to match the target schema.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        complaint_id INT NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        assigned_personnel_id INT NOT NULL REFERENCES personnel(id) ON DELETE SET NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Renamed to match SQL schema
      );
    `);

    // Chat table
    // Renamed 'created_at' to 'createdAt' to match the target schema.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        from_role TEXT CHECK (from_role IN ('user', 'admin')) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Renamed to match SQL schema
      );
    `);

    // Seed the complaint_types table with the defined categories.
    // This query cleverly inserts only the types that don't already exist.
    await pool.query(`
      INSERT INTO complaint_types (type_name)
      SELECT UNNEST($1::text[])
      ON CONFLICT (type_name) DO NOTHING;
    `, [categories]);

    console.log("✅ Tables created/updated and complaint types seeded successfully");

  } catch (err) {
    console.error("❌ Error in creating tables:", err.stack);
  }
};

module.exports = { createTable };
