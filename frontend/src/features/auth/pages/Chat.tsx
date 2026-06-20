import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../../context/socket.context";
import { useAuth } from "../hooks/useAuth";
import { getMessages, sendMessage, getConversationUsers } from "../services/message.api";
import { IUser, IMessage } from "../../../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  MessageSquare
} from "lucide-react";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const { user: currentUser } = useAuth();
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
      setNewMessage(tempMessage);
    }
  };

  // Filter conversations
  const filteredUsers = users.filter((u) =>
    u.fullname.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchQuery.toLowerCase())
  );



  if (!currentUser) return <div className="p-10 text-center text-zinc-650 bg-stone-50 min-h-screen">Loading user profile...</div>;

  return (
    <div className="flex-1 flex overflow-hidden h-screen pt-16 md:pt-0 relative">
      
      {/* Middle Pane: Conversation list */}
        <aside className="w-full sm:w-80 border-r border-zinc-200 flex flex-col bg-white shrink-0">
          {/* Search bar inside conversations */}
          <div className="p-4 border-b border-zinc-150 relative">
            <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search chat history..."
              className="w-full bg-stone-50 border border-zinc-200 rounded-full pl-10 pr-4 py-2 text-xs focus:outline-none text-black"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
            {fetchingUsers ? (
              <p className="p-6 text-center text-xs text-zinc-400">Loading conversations...</p>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <p className="text-zinc-400 text-xs font-semibold">No discussions yet</p>
                <p className="text-[10px] text-zinc-450 mt-1 px-4 leading-normal">Accept tasks or request bids to initialize private messaging workspaces.</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUser?._id === u._id;
                const isOnline = onlineUsers.includes(u._id);
                return (
                  <button
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full flex items-center gap-3 p-4 text-left transition ${
                      isSelected ? "bg-stone-50/70 border-l-2 border-black" : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center border border-zinc-250">
                        {u.avatar ? (
                          <img src={u.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-zinc-650">{u.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-black truncate">{u.fullname}</p>
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">@{u.username}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane: Messages History Area */}
        <main className="flex-1 flex flex-col bg-stone-50 overflow-hidden">
          {selectedUser ? (
            <>
              {/* Active User Header */}
              <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center border border-zinc-250">
                    {selectedUser.avatar ? (
                      <img src={selectedUser.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-zinc-600">{selectedUser.username?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-black">{selectedUser.fullname}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${onlineUsers.includes(selectedUser._id) ? "bg-green-500" : "bg-zinc-300"}`}></span>
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">
                        {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="text-zinc-400 hover:text-black p-1 rounded-lg hover:bg-zinc-100 transition">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Messages Feed View */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {fetchingMessages ? (
                  <p className="text-center text-xs text-zinc-450 py-10">Syncing conversation records...</p>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center">
                    <p className="text-zinc-500 text-xs">Start your discussion with {selectedUser.fullname}.</p>
                    <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px]">Send deliverables logs, clear requirements, or update milestones directly here.</p>
                  </div>
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
                          className={`max-w-[70%] p-4 rounded-3xl shadow-sm ${
                            isMine
                              ? "bg-zinc-950 text-white rounded-br-none"
                              : "bg-white text-zinc-900 border border-zinc-200 rounded-bl-none"
                          }`}
                        >
                          <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          <span className={`text-[8px] mt-2 block opacity-50 font-mono ${isMine ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Action Bar */}
              <div className="p-4 border-t border-zinc-250 bg-white shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                  <button
                    type="button"
                    className="p-3 text-zinc-450 hover:text-black hover:bg-zinc-50 rounded-full transition"
                    title="Attach Files"
                  >
                    <Paperclip className="h-4.5 w-4.5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-stone-50 border border-zinc-200 rounded-full px-6 py-3 text-xs focus:outline-none focus:border-zinc-400 text-black placeholder-zinc-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-800 transition disabled:opacity-30 shadow-md shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="h-12 w-12 bg-white border border-zinc-200 rounded-full flex items-center justify-center mb-4 text-zinc-400 shadow-sm">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-bold text-zinc-800">Select a Conversation</h2>
              <p className="text-[11px] text-zinc-450 mt-1 max-w-[220px]">Pick a discussion partner from the sidebar list to open your secure messenger portal.</p>
            </div>
          )}
        </main>
    </div>
  );
};

export default Chat;
