import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const useChat = ({ userId, isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [userList, setUserList] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect only if there's a user context (either a user is logged in, or an admin has selected a user)
    if (!userId) {
      return;
    }

    // Establish socket connection
    socketRef.current = io(VITE_BACKEND_URL);
    const socket = socketRef.current;

    // Join the appropriate room on the server
    socket.emit("join", { userId, isAdmin });

    // --- Event Listeners ---

    // Handles receiving a new message in real-time
    const handleReceiveMessage = (msg) => {
      // For admin, only add the message if it's for the currently selected user
      if (isAdmin && msg.userId !== userId) {
        return;
      }
      setMessages((prev) => [...prev, msg]);
    };

    // Handles receiving the initial chat history
    const handleChatHistory = (history) => {
      setMessages(history || []);
    };

    // Handles updates to the list of users who have chatted
    const handleUserList = (users) => {
      setUserList(users);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("chatHistory", handleChatHistory);
    socket.on("userList", handleUserList);

    // If an admin selects a user, clear old messages and request new history
    if (isAdmin) {
      setMessages([]);
      socket.emit("getChatHistory", { userId });
    }

    // --- Cleanup Function ---
    // This is crucial to prevent memory leaks and duplicate event listeners.
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("chatHistory", handleChatHistory);
      socket.off("userList", handleUserList);
      socket.disconnect();
    };
  }, [userId, isAdmin]); // This effect re-runs when the admin selects a different user

  const sendMessage = (msg) => {
    const socket = socketRef.current;
    if (!socket) return;

    // Optimistically update the UI with the new message
    const messagePayload = {
      ...msg,
      userId: userId,
      fromRole: isAdmin ? "admin" : "user",
    };
    setMessages((prev) => [...prev, messagePayload]);

    // Emit the message to the server
    if (isAdmin) {
      socket.emit("adminReply", { userId, message: msg.message });
    } else {
      socket.emit("userMessage", { userId, message: msg.message });
    }
  };

  return { messages, sendMessage, setMessages, userList };
};
