import { useState } from "react";
import { useChat } from "../hooks/useChat";
import { jwtDecode } from "jwt-decode";

const Chat = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const { messages, sendMessage } = useChat({
    userId: decoded?.id,
    isAdmin: false,
  });
  const [chatInput, setChatInput] = useState("");

  const handleSend = () => {
    if (chatInput.trim() && decoded?.id) {
      sendMessage({ message: chatInput.trim() });
      setChatInput("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-90 bg-gray-900 rounded-xl shadow-lg border border-gray-700 p-4">
      <h3 className="text-lg font-bold text-white mb-2">Chat with Admin</h3>
      <div className="h-68 overflow-y-auto bg-gray-800 rounded-lg p-2 mb-2">
        {(messages || []).map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`mb-1 text-sm ${
              msg.fromRole === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-2 py-1 rounded ${
                msg.fromRole === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {msg.message}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 px-3 py-2 rounded bg-gray-700 text-white"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;