
const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv');
const http = require("http");

// Import your custom modules
const { createTable } = require('./config/createTable'); // Your table creation script
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require("./routes/complaintRoutes");
const personnelRoutes = require("./routes/personnelRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { connectSocket } = require("./socket");

// Load environment variables
dotenv.config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// --- Middleware Setup ---
// Enable CORS with specific origin for security
app.use(cors({
  // origin: "https://help-desk-iiita.vercel.app", // Use your production frontend URL
  origin: "http://localhost:5173",
}));

// Body parsers for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// --- API Routes ---
app.use('/api/users', userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/chat", chatRoutes);

// A simple health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is running and healthy." });
});


/**
 * Main function to start the server.
 * It first ensures the database tables are created and then starts listening for requests.
 */
const startServer = async () => {
  try {
    // Step 1: Connect to the database and create tables if they don't exist.
    console.log("Initializing database... Initializing tables...");
    await createTable();
    console.log("✅ Database tables are ready.");

    // Step 2: Connect the Socket.IO server.
    connectSocket(server);
    console.log("✅ Socket.IO connected.");


    // Step 3: Start the HTTP server.
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server is live and running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start the server.");
    console.error(error);
    process.exit(1); // Exit the process with an error code
  }
};

// --- Run the Server ---
startServer();
