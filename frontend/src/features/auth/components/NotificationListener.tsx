import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/socket.context";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, X } from "lucide-react";

interface PopNotification {
  id: string;
  message: string;
  senderName: string;
}

export const NotificationListener = () => {
  const { socket } = useSocket();
  const [toasts, setToasts] = useState<PopNotification[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: any) => {
      const newToast: PopNotification = {
        id: notification._id || Date.now().toString(),
        message: notification.message,
        senderName: notification.sender?.fullname || "Someone",
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 5000);
    };

    socket.on("new_notification", handleNewNotification);

    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="flex w-80 items-start gap-3 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-2xl"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-black">{toast.senderName}</h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-black transition"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
