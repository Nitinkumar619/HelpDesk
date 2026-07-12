const { Server } = require("socket.io");
const {
  saveChatMessage,
  getChatMessagesByUserId,
} = require("./models/ChatModel");

let io;

const mapRow = (row) => ({
  userId: row.user_id,
  message: row.message,
  fromRole: row.from_role,
  createdAt: row.createdat || row.createdAt,
});

const connectSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  const users = new Map();

  function emitUserListToAdmins() {
    const userList = Array.from(users.keys());
    for (let [id, s] of io.sockets.sockets) {
      if (s.isAdmin) {
        s.emit("userList", userList);
      }
    }
  }

  io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    socket.on("join", async ({ userId, isAdmin }) => {
      socket.userId = userId;
      socket.isAdmin = isAdmin;

      if (!isAdmin) {
        users.set(userId, socket.id);
        emitUserListToAdmins();

        // Send this student their own chat history right away
        try {
          const rows = await getChatMessagesByUserId(userId, 50);
          rows.reverse();
          socket.emit("chatHistory", rows.map(mapRow));
        } catch (err) {
          console.error("Error loading chat history on join:", err);
        }
      } else {
        socket.emit("userList", Array.from(users.keys()));
      }
    });

    // Admin selecting a specific user's conversation
    socket.on("getChatHistory", async ({ userId }) => {
      try {
        const rows = await getChatMessagesByUserId(userId, 50);
        rows.reverse();
        socket.emit("chatHistory", rows.map(mapRow));
      } catch (err) {
        console.error("Error loading chat history:", err);
      }
    });

    socket.on("userMessage", async ({ userId, message }) => {
      try {
        await saveChatMessage(userId, message, "user");
        const payload = {
          userId,
          message,
          fromRole: "user",
          createdAt: new Date().toISOString(),
        };
        for (let [id, s] of io.sockets.sockets) {
          if (s.isAdmin) {
            s.emit("receiveMessage", payload);
          }
        }
        emitUserListToAdmins();
      } catch (err) {
        console.error("Error saving user message:", err);
      }
    });

    socket.on("adminReply", async ({ userId, message }) => {
      if (!socket.isAdmin) return;
      try {
        await saveChatMessage(userId, message, "admin");
        const payload = {
          userId,
          message,
          fromRole: "admin",
          createdAt: new Date().toISOString(),
        };
        const socketId = users.get(userId);
        if (socketId) {
          io.to(socketId).emit("receiveMessage", payload);
        }
      } catch (err) {
        console.error("Error saving admin reply:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (socket.userId && !socket.isAdmin) {
        users.delete(socket.userId);
      }
    });
  });
};

module.exports = { connectSocket };