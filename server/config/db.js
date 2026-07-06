// const mysql = require('mysql2');
// const dotenv = require('dotenv');
// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
// });

// db.connect((err) => {
//   if (err) {
//     console.error('❌ MySQL connection failed:', err);
//     process.exit(1);
//   }
//   console.log('✅ MySQL Connected!');
//   initializeTables();
// });

// function initializeTables() {
//   const createUsersTable = `
//     CREATE TABLE IF NOT EXISTS users (
//       id INT NOT NULL AUTO_INCREMENT,
//       email VARCHAR(255) NOT NULL UNIQUE,
//       password VARCHAR(255) NOT NULL,
//       name VARCHAR(255),
//       role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
//       PRIMARY KEY (id)
//     );
//   `;

//   const createPersonnelTable = `
//     CREATE TABLE IF NOT EXISTS personnel (
//       id INT NOT NULL AUTO_INCREMENT,
//       name VARCHAR(100) NOT NULL,
//       contact VARCHAR(15) NOT NULL,
//       role ENUM('Network', 'Cleaning', 'Carpentry', 'PC Maintenance', 'Plumbing', 'Electricity') NOT NULL,
//       available TINYINT(1) NOT NULL,
//       PRIMARY KEY (id)
//     );
//   `;

//   const createComplaintTypesTable = `
//     CREATE TABLE IF NOT EXISTS complaint_types (
//       id INT NOT NULL AUTO_INCREMENT,
//       type_name VARCHAR(50) NOT NULL UNIQUE,
//       PRIMARY KEY (id)
//     );
//   `;

//   const createComplaintsTable = `
//     CREATE TABLE IF NOT EXISTS complaints (
//       id INT NOT NULL AUTO_INCREMENT,
//       status ENUM('Pending','Assigned','Resolved') DEFAULT 'Pending',
//       createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
//       priority ENUM('Low','Medium','High') DEFAULT 'Low',
//       location VARCHAR(100) DEFAULT NULL,
//       message TEXT,
//       attachments TEXT,
//       complaint_type_id INT DEFAULT NULL,
//       assigned_personnel_id INT DEFAULT NULL,
//       feedback_given BOOLEAN DEFAULT FALSE,
//       user_id INT DEFAULT NULL,
//       code VARCHAR(10) DEFAULT NULL,
//       PRIMARY KEY (id),
//       KEY fk_complaint_type (complaint_type_id),
//       KEY fk_personnel (assigned_personnel_id),
//       KEY fk_user (user_id),
//       CONSTRAINT fk_complaint_type FOREIGN KEY (complaint_type_id) REFERENCES complaint_types (id),
//       CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id),
//       CONSTRAINT fk_assigned_personnel FOREIGN KEY (assigned_personnel_id) REFERENCES personnel (id)
//     );
//   `;

//   const createFeedbackTable = `
//     CREATE TABLE IF NOT EXISTS feedback (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       complaint_id INT NOT NULL,
//       user_id INT NOT NULL,
//       assigned_personnel_id INT NOT NULL,
//       rating INT CHECK (rating BETWEEN 1 AND 5),
//       comment TEXT,
//       createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (complaint_id) REFERENCES complaints(id),
//       FOREIGN KEY (user_id) REFERENCES users(id),
//       FOREIGN KEY (assigned_personnel_id) REFERENCES personnel(id)
//     );
//   `;

//   const createChatTable = `
//     CREATE TABLE IF NOT EXISTS chat (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       user_id INT NOT NULL,
//       message TEXT NOT NULL,
//       from_role ENUM('user', 'admin') NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (user_id) REFERENCES users(id)
//     );
//   `;

//   const queries = [
//     createComplaintTypesTable,
//     createUsersTable,
//     createPersonnelTable,
//     createComplaintsTable,
//     createFeedbackTable,
//     createChatTable
//   ];

//   queries.forEach((query, index) => {
//     db.query(query, (err) => {
//       if (err) {
//         console.error(`❌ Failed to execute query ${index + 1}: ${err.message}`);
//       } else {
//         console.log(`✅ Table ${index + 1} ensured to exist.`);
//       }
//     });
//   });
// }

// module.exports = db;

require('dotenv').config();
const { Pool } = require('pg');

const connectionString = process.env.DB_STRING;

if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env file");
  process.exit(1); 
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // For Neon or other managed Postgres with SSL
  },
});

// Test the connection once at startup
pool.connect()
  .then((client) => {
    console.log('✅ Database connected successfully');
    client.release(); // Release back to pool
  })
  .catch((error) => {
    console.error('❌ Error connecting to the database:', error.stack);
    process.exit(1);
  });

// Optional: Catch runtime pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected DB pool error (runtime):', err);
});

module.exports = pool;