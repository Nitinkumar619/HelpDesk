// // const db = require("../config/db");
// // // currently not in use
// // const categories = [
// //   "Network",
// //   "Cleaning",
// //   "Carpentry",
// //   "PC Maintenance",
// //   "Plumbing",
// //   "Electricity",
// // ];

// // const insertCategories = () => {
// //   const sql = "INSERT IGNORE INTO complaint_types (type_name) VALUES ?";
// //   const values = categories.map((category) => [category]);

// //   db.query(sql, [values], (err, result) => {
// //     if (err) {
// //       console.error("Error inserting complaint types:", err);
// //     } else {
// //       console.log("Complaint types seeded successfully.");
// //     }
// //     db.end();
// //   });
// // };

// // insertCategories();


// const pool = require("../config/db");

// const categories = [
//   "Network",
//   "Cleaning",
//   "Carpentry",
//   "PC Maintenance",
//   "Plumbing",
//   "Electricity",
// ];

// const insertCategories = async () => {
//   try {
//     // Ensure type_name has UNIQUE constraint in DB so ON CONFLICT works
//     const query = `
//       INSERT INTO complaint_types (type_name)
//       SELECT UNNEST($1::text[])
//       ON CONFLICT (type_name) DO NOTHING;
//     `;

//     await pool.query(query, [categories]);

//     console.log("✅ Complaint types seeded successfully.");
//   } catch (err) {
//     console.error("❌ Error inserting complaint types:", err);
//   } finally {
//     await pool.end();
//   }
// };

// insertCategories();
// Import the configured pool from your db config file
const pool = require("../config/db");

const categories = [
  "Network",
  "Cleaning",
  "Carpentry",
  "PC Maintenance",
  "Plumbing",
  "Electricity",
];

const insertCategories = async () => {
  console.log("Attempting to seed complaint types...");

  const sql = `
    INSERT INTO complaint_types (type_name)
    SELECT unnest($1::text[])
    ON CONFLICT (type_name) DO NOTHING;
  `;

  try {
    const result = await pool.query(sql, [categories]);
    console.log("✅ Complaint types seeded successfully.");
    console.log(`Rows inserted: ${result.rowCount}`);
  } catch (err) {
    console.error("❌ Error inserting complaint types:", err.stack);
  } finally {
    await pool.end();
    console.log("Pool has been closed.");
  }
};

insertCategories();
