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
  User,
  Check,
  CheckCheck,
  Zap,
  Lock,
  BadgeAlert,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Smile
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
    <div className="flex-1 h-screen flex flex-col pt-16 md:pt-0 overflow-hidden bg-[#F6F6F6]">
      <div className="flex-1 flex overflow-hidden bg-white animate-fade-in">
        
        {/* 1. Chats Sidebar List */}
        <div className="w-full sm:w-80 border-r border-zinc-200 flex flex-col bg-zinc-50/50 shrink-0">
          
          {/* Search header Block */}
          <div className="p-4 border-b border-zinc-100 space-y-3.5 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black font-mono uppercase tracking-wider text-zinc-800">Messages Workspace</h2>
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter chat contacts..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-black placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Contacts scrolling area */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100/50">
            {fetchingUsers ? (
              <p className="p-6 text-center text-xs font-mono text-zinc-400">Loading conversations...</p>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs font-mono">
                No conversational partners found.
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUser?._id === u._id;
                const isOnline = onlineUsers.includes(u._id);

                return (
                  <button
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full text-left p-4 flex gap-3 transition-colors relative ${
                      isSelected ? 'bg-zinc-100/80 border-r-2 border-black' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.fullname}
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-zinc-200 flex items-center justify-center border border-zinc-200 font-bold text-zinc-650">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {isOnline && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-xs font-bold font-mono text-zinc-900 truncate">{u.fullname}</p>
                      </div>
                      <p className={`text-[10px] truncate font-mono text-zinc-500 leading-normal`}>
                        @{u.username}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Chat Pane */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedUser ? (
            <>
              {/* Chat Pane Header */}
              <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/20">
                <div className="flex items-center gap-3">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.fullname}
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 flex items-center justify-center border border-zinc-200 font-bold text-zinc-650">
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-bold font-mono text-zinc-900 leading-none mb-1">
                      {selectedUser.fullname}
                    </h3>
                    <p className="text-[9px] font-mono flex items-center gap-1 leading-none font-semibold">
                      {onlineUsers.includes(selectedUser._id) ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-emerald-600">ACTIVE PARTNER</span>
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                          <span className="text-zinc-500">OFFLINE</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status bar block */}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 font-bold font-mono text-[9px] text-zinc-500 rounded-lg uppercase tracking-wide flex items-center gap-1 select-none">
                    <Lock className="w-2.5 h-2.5 text-zinc-400" /> Secure Encryption Active
                  </span>
                </div>
              </div>

              {/* Scrollable Messages list panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/20">
                {fetchingMessages ? (
                  <p className="text-center text-xs font-mono text-zinc-400 py-10">Syncing conversation records...</p>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center">
                    <p className="text-zinc-500 font-mono text-xs">Start your discussion with {selectedUser.fullname}.</p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-1 max-w-[200px]">Send deliverables logs, clear requirements, or update milestones directly here.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const senderIdStr = typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;
                    const isMe = senderIdStr === currentUser._id;
                    const isSystem = senderIdStr === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg._id} className="flex justify-center my-4 animate-fade-in">
                          <div className="max-w-md bg-stone-50 px-4 py-3 border border-stone-200 rounded-xl flex items-start gap-2.5 shadow-[0_2px_8px_rgb(0,0,0,0.01)]">
                            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <div className="text-[11px] font-mono text-stone-700 leading-relaxed">
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div className={`max-w-[70%] space-y-1`}>
                          <div className={`p-3.5 rounded-2xl text-[11px] font-mono leading-relaxed ${
                            isMe
                              ? 'bg-black text-white rounded-br-none'
                              : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none shadow-sm'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-1.5 text-[9px] text-zinc-400 font-mono ${
                            isMe ? 'justify-end' : 'justify-start'
                          }`}>
                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Send input footer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 bg-white flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Type negotiation comments, send milestones updates, discuss details..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-black hover:bg-zinc-800 text-white rounded-xl transition-colors shadow-md shadow-black/10 shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/20">
              <div className="w-16 h-16 rounded-3xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-400 mb-4 animate-bounce">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-zinc-700">Select conversation partner</h3>
              <p className="text-[11px] text-zinc-450 font-mono mt-1.5 max-w-sm leading-relaxed">
                Choose a bidder contact from the sidebar list to arrange task procedures, optimize slide design structures, or securely lock dynamic escrows.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
