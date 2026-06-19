import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useSocket } from "../../../context/socket.context";
import { AuthContext } from "../auth.context";
import { getMessages, sendMessage, getConversationUsers } from "../services/message.api";
import { IUser, IMessage } from "../../../types";

const Chat = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [fetchingMessages, setFetchingMessages] = useState(false);

  const auth = useContext(AuthContext);
  const currentUser = auth?.user;
  const { socket, onlineUsers } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setFetchingUsers(true);
        const data = await getConversationUsers();
        if (data.success) {
          setUsers(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch conversation users:", error);
      } finally {
        setFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          setFetchingMessages(true);
          const data = await getMessages(selectedUser._id);
          if (data.success) {
            setMessages(data.data || []);
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        } finally {
          setFetchingMessages(false);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message: IMessage) => {
        const senderIdStr = typeof message.senderId === "object" ? message.senderId._id : message.senderId;
        const receiverIdStr = typeof message.receiverId === "object" ? message.receiverId._id : message.receiverId;

        if (
          selectedUser &&
          (senderIdStr === selectedUser._id || receiverIdStr === selectedUser._id)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      };

      socket.on("newMessage", handleNewMessage);
      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [socket, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const tempMessage = newMessage;
    setNewMessage("");

    try {
      const data = await sendMessage(selectedUser._id, tempMessage);
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
      setNewMessage(tempMessage); // Restore message on failure
    }
  };

  if (!currentUser) return <div className="p-10 text-center text-zinc-600 bg-stone-50 min-h-screen">Loading user profile...</div>;

  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-black">Messages</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">{currentUser.fullname}</span>
          <img src={currentUser.avatar || "/default-avatar.png"} className="w-8 h-8 rounded-full border border-zinc-200" alt="" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full sm:w-80 border-r flex flex-col bg-stone-50 overflow-y-auto">
          {fetchingUsers ? (
            <p className="p-6 text-center text-gray-500">Loading conversations...</p>
          ) : users.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1 text-center px-4">Accept a proposal to start chatting with helpers.</p>
            </div>
          ) : (
            users.map((u) => (
              <button
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`flex items-center gap-3 p-4 border-b text-left transition ${
                  selectedUser?._id === u._id ? "bg-white shadow-sm ring-1 ring-inset ring-gray-200 z-10" : "hover:bg-gray-100"
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={u.avatar || "/default-avatar.png"}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                  />
                  {onlineUsers.includes(u._id) && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-zinc-900 truncate">{u.fullname}</p>
                  <p className="text-xs text-zinc-500 truncate">@{u.username}</p>
                </div>
              </button>
            ))
          )}
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.avatar || "/default-avatar.png"}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <h3 className="font-bold text-black">{selectedUser.fullname}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-500">
                      {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {fetchingMessages ? (
                  <p className="text-center text-gray-400 py-10">Loading history...</p>
                ) : messages.length === 0 ? (
                  <p className="text-center text-gray-400 py-10">Start your conversation with {selectedUser.fullname}</p>
                ) : (
                  messages.map((msg) => {
                    const senderIdStr = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                    const isMine = senderIdStr === currentUser._id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                            isMine
                              ? "bg-zinc-900 text-white rounded-br-none"
                              : "bg-white text-zinc-900 border rounded-bl-none border-zinc-200"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <span className={`text-[9px] mt-2 block opacity-50 ${isMine ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-stone-50 border-zinc-200 border rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 transition text-black"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-zinc-900 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-gray-50 text-center">
              <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-zinc-300">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Your Conversations</h2>
              <p className="text-zinc-500 max-w-xs">Select a helper or student from the sidebar to start discussing your collaboration.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
