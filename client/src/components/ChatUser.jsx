import { useState, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { jwtDecode } from "jwt-decode";
import apiClient from "../utils/apiClient";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// FIX 1: Component names should be in PascalCase.
const Chat = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  // Assuming useChat correctly handles state, but we will add guards below.
  const { userMessages, setUserMessages, sendMessage } = useChat({
    userId: decoded?.id,
    isAdmin: false
  });
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    if (!decoded?.id) {
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data } = await apiClient.get('/api/chat', {
          params: { user_id: decoded.id, limit: 20 }
        });

        if (Array.isArray(data)) {
          setUserMessages(data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setUserMessages([]);
      }
    };

    fetchMessages();
  }, [decoded?.id, setUserMessages]);

  const handleSend = async () => {
    if (chatInput.trim() && decoded?.id) {
      const messagePayload = {
        userId: decoded.id,
        message: chatInput,
        fromRole: "user"
      };

      try {
        await apiClient.post('/api/chat', messagePayload);
        sendMessage(messagePayload);
        setChatInput("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-90 bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-4">
      <h3 className="text-lg font-bold text-white mb-2">Chat with Admin</h3>
      <div className="h-68 overflow-y-auto bg-gray-800 rounded-lg p-2 mb-2">
        {/* FIX 4: Use a fallback empty array to prevent .map() from ever failing. */}
        {(userMessages || []).map((msg, idx) => (
          // Use a more stable key if possible, like msg.id
          <div key={msg.id || idx} className={`mb-1 text-sm ${msg.fromRole === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-2 py-1 rounded ${msg.fromRole === "user" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-200"}`}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  )
};

export default Chat; // FIX 1 (cont.): Export with PascalCase name
