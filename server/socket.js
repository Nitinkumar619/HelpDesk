const { Server } = require("socket.io");

let io;

const connectSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
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

    socket.on("join", ({ userId, isAdmin }) => {
      socket.userId = userId;
      socket.isAdmin = isAdmin;
      if (!isAdmin) {
        users.set(userId, socket.id);
        emitUserListToAdmins(); 
      } else {
        socket.emit("userList", Array.from(users.keys()));
      }
    });

     socket.on("userMessage", ({ userId, message }) => {
      emitUserListToAdmins(); 
    });

    socket.on("adminReply", ({ userId, message }) => {
      console.log(`Admin reply to ${userId}: ${message}`);
      if (!socket.isAdmin) return;
      const socketId = users.get(userId);
      if (socketId) {
        io.to(socketId).emit("adminReply", { message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (socket.userId && !socket.isAdmin) {
        users.delete(socket.userId);
      }
    });
  });
}

module.exports = { connectSocket };