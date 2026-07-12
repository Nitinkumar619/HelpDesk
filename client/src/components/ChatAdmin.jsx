import React, { useState, useEffect, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import apiClient from "../utils/apiClient";
import { useChat } from "../hooks/useChat";

const ChatAdmin = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { messages, sendMessage } = useChat({
    userId: selectedUser?.id,
    isAdmin: true,
  });

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Auto-scroll to bottom only when a new message actually arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const displayName = user.name || user.email || `User #${user.id}`;
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      setError(null);
      const { data } = await apiClient.get("/api/chat/users");
      setUsers(data);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSend = () => {
    if (!chatInput.trim() || !selectedUser || sendingMessage) return;

    sendMessage({ message: chatInput.trim() });
    setChatInput("");
    chatInputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastMessage = (user) => {
    return "Click to view conversation";
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* User List */}
      <div className="w-1/3 bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white font-bold mb-3">Admin Chat</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none text-sm"
            />
            <svg
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="p-4 mx-4 mt-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
              <button
                onClick={() => {
                  setError(null);
                  fetchUsers();
                }}
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {usersLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-indigo-400 rounded-full"></div>
              <div className="text-gray-400 mt-2">Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              {searchTerm ? "No users found" : "No users yet"}
            </div>
          ) : (
            <div className="p-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-all duration-200 hover:bg-gray-700 ${
                    selectedUser && selectedUser.id === user.id
                      ? "bg-indigo-700 text-white shadow-lg"
                      : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {user.name || user.email || `User #${user.id}`}
                      </div>
                      <div className="text-xs text-gray-400 truncate mt-1">
                        {getLastMessage(user)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedUser && selectedUser.id === user.id
                            ? "bg-white"
                            : "bg-green-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-gray-800">
        {selectedUser ? (
          <>
            <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">
                  {selectedUser.name || selectedUser.email || `User #${selectedUser.id}`}
                </h3>
                <p className="text-gray-400 text-sm">Online</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                title="Refresh messages"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-400">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.fromRole === "admin" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          msg.fromRole === "admin"
                            ? "bg-indigo-600 text-white rounded-br-sm"
                            : "bg-gray-600 text-gray-100 rounded-bl-sm"
                        }`}
                      >
                        <div className="break-words">{msg.message}</div>
                        <div
                          className={`text-xs mt-1 ${
                            msg.fromRole === "admin" ? "text-indigo-200" : "text-gray-400"
                          }`}
                        >
                          {msg.createdAt ? formatTime(msg.createdAt) : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="p-4 border-t border-gray-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-3 items-end"
              >
                <div className="flex-1">
                  <textarea
                    ref={chatInputRef}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-indigo-500 focus:outline-none resize-none"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                    disabled={sendingMessage}
                    style={{ maxHeight: "120px", minHeight: "44px" }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!chatInput.trim() || sendingMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-2xl transition-colors duration-200 flex items-center justify-center"
                >
                  {sendingMessage ? (
                    <div className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full"></div>
                  ) : (
                    <svg
                      className="w-5 h-5 transform rotate-90"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  )}
                </button>
              </form>
              <div className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <svg
                className="w-16 h-16 text-gray-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <div className="text-gray-400 text-lg font-medium">
                Select a user to start chatting
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Choose from the user list to view conversation history
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAdmin;