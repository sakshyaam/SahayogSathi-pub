import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/auth.api";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  Wallet
} from "lucide-react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchUnreadNotificationsCount = async () => {
    try {
      const res = await api.get("/api/v1/notifications");
      const count = res.data.data?.filter((n: any) => !n.isRead).length || 0;
      setUnreadNotifications(count);
    } catch (err) {
      console.error("Failed to load notifications count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadNotificationsCount();
    // Poll notifications every 30s
    const timer = setInterval(fetchUnreadNotificationsCount, 30000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Tasks", icon: Briefcase, path: "/my-tasks" },
    { label: "My Posts", icon: FileText, path: "/myposts" },
    { label: "Messages", icon: MessageSquare, path: "/chat" },
    { label: "Notifications", icon: Bell, path: "/notifications", badge: unreadNotifications },
    { label: "Wallet", icon: Wallet, path: "/wallet" },
  ];

  if (!user) return <div className="p-10 text-center text-zinc-600 bg-stone-50 min-h-screen">Loading user profile...</div>;

  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900 flex">
      {/* LEFT SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200 bg-white min-h-screen fixed top-0 bottom-0 z-30 justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-zinc-150">
            <div className="flex h-9 w-9 items-center justify-center bg-black text-white font-display font-black text-lg">
              S
            </div>
            <span className="font-display font-black text-sm tracking-wider uppercase text-black">SAHAYOGSATHI</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-4 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 bg-black rounded-2xl shadow-md shadow-black/10"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`relative z-10 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? "bg-white text-black" : "bg-rose-500 text-white"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile details & logout at bottom */}
        <div className="p-4 border-t border-zinc-150">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center text-sm font-bold text-zinc-600 border border-zinc-300">
              {user?.avatar ? (
                <img src={user.avatar} className="h-full w-full object-cover" />
              ) : (
                user?.username?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-xs font-bold text-black truncate">{user?.fullname}</span>
              <span className="text-[10px] text-zinc-500 truncate">@{user?.username}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-zinc-200 bg-white z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-zinc-100 rounded-lg">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-display font-black text-sm uppercase">SAHAYOGSATHI</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center text-xs font-bold text-zinc-600">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-white z-50 p-6 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                  <span className="font-display font-black text-sm uppercase">SAHAYOGSATHI</span>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="space-y-2 relative">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive ? "text-white" : "text-zinc-700 hover:bg-zinc-100"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="mobile-sidebar-active-indicator"
                            className="absolute inset-0 bg-black rounded-xl shadow-md shadow-black/10"
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-3 w-full">
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-1 md:ml-64 min-h-screen relative flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
