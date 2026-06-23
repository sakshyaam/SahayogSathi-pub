import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/auth.api";
import { Bell, ArrowLeft, CheckCircle2, MessageSquare, Briefcase, DollarSign } from "lucide-react";

interface NotificationItem {
  _id: string;
  sender: {
    fullname: string;
    avatar?: string;
    username: string;
  };
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: any;
  referenceModel?: string;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/v1/notifications");
      setNotifications(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/v1/notifications/all/read", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markSingleAsRead = async (id: string) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.isRead) {
      await markSingleAsRead(n._id);
    }

    if ((n.referenceModel === "Order" || n.referenceModel === "Proposal") && n.referenceId) {
      const postId = typeof n.referenceId.post === "string" ? n.referenceId.post : n.referenceId.post?._id;
      if (postId) {
        navigate(`/post/${postId}`);
      }
    } else if (n.referenceModel === "Post" && n.referenceId) {
      const postId = typeof n.referenceId === "string" ? n.referenceId : n.referenceId._id;
      if (postId) {
        navigate(`/post/${postId}`);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "WORK_SUBMITTED":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "PROPOSAL_ACCEPTED":
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case "PAYMENT_RECEIVED":
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-zinc-600" />;
    }
  };

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 flex-1">
      <main className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black flex items-center gap-2">
                Notifications <Bell className="h-6 w-6 text-zinc-500" />
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Keep track of your project updates and work submissions.
              </p>
            </div>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-zinc-600 border border-zinc-200 bg-white hover:border-zinc-400 rounded-full px-4 py-2 transition"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-zinc-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            {error}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-white p-8 text-center">
            <Bell className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-zinc-500 font-medium">All caught up!</p>
            <p className="text-xs text-zinc-400 mt-1">No notifications yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => handleNotificationClick(n)}
                className={`flex items-start gap-4 rounded-[2rem] border p-5 transition cursor-pointer ${
                  n.isRead
                    ? "bg-white border-zinc-150"
                    : "bg-zinc-900 border-zinc-900 text-white shadow-lg"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    n.isRead ? "bg-zinc-100" : "bg-white"
                  }`}
                >
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${n.isRead ? "text-black" : "text-white"}`}>
                      {n.sender?.fullname}
                    </p>
                    <span
                      className={`text-[10px] ${
                        n.isRead ? "text-zinc-400" : "text-zinc-300"
                      }`}
                    >
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p
                    className={`mt-1 text-xs leading-relaxed ${
                      n.isRead ? "text-zinc-600" : "text-zinc-200"
                    }`}
                  >
                    {n.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
