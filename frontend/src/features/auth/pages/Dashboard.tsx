import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../hooks/useAuth";
import { IPost, IUser } from "../../../types";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/auth.api";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Bell,
  MessageSquare,
  LogOut,
  Search,
  Plus,
  Menu,
  X,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  ArrowUpRight
} from "lucide-react";

const categories = [
  "All",
  "Assignment",
  "Project",
  "Notes",
  "Presentation",
  "Research",
  "Other",
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const { fetchPosts, loading, error } = usePost();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stats data states
  const [stats, setStats] = useState({
    activeTasks: 0,
    postedRequests: 0,
    unreadNotifications: 0,
  });

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch notifications, my-tasks, my-posts to calculate count
      const [notifsRes, tasksRes, postsRes] = await Promise.all([
        api.get("/api/v1/notifications"),
        api.get("/api/v1/orders/my-tasks"),
        api.get("/api/v1/posts/my-posts"),
      ]);

      const unreadCount = notifsRes.data.data?.filter((n: any) => !n.isRead).length || 0;
      const runningTasks = tasksRes.data.data?.filter((t: any) => t.status === "active" || t.status === "submitted").length || 0;
      const totalPosted = postsRes.data.data?.length || 0;

      setStats({
        activeTasks: runningTasks,
        postedRequests: totalPosted,
        unreadNotifications: unreadCount,
      });
    } catch (err) {
      console.error("Failed to load dashboard metrics:", err);
    }
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetchPosts();
        if (response.success) {
          setPosts(response.data);
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };
    loadPosts();
    fetchStats();
  }, []);

  // Filter posts based on category and search query
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" ||
      post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Tasks", icon: Briefcase, path: "/my-tasks" },
    { label: "My Posts", icon: FileText, path: "/myposts" },
    { label: "Messages", icon: MessageSquare, path: "/chat" },
    { label: "Notifications", icon: Bell, path: "/notifications", badge: stats.unreadNotifications },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 relative">
        {/* Top Header Row: Search & Profile */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
              Workspace Overview
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Welcome back, {user?.fullname}. Review tasks and client postings.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks, category, code..."
                className="w-full bg-white border border-zinc-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-zinc-400 shadow-sm"
              />
            </div>
            {/* Floating Post A Request Shortcut */}
            <Link
              to="/createpost"
              className="bg-black text-white hover:bg-zinc-800 p-2.5 sm:px-5 sm:py-2.5 rounded-full flex items-center gap-2 shadow-md shrink-0 transition"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Post Task</span>
            </Link>
          </div>
        </header>

        {/* 3. METRICS / STATS SECTION */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Wallet Balance */}
          <div className="bg-white border border-zinc-200 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Wallet Balance</span>
              <Wallet className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-black">NPR {user?.walletBalance || 0}</span>
              <p className="text-[9px] text-zinc-400 mt-1">Ready for withdrawal</p>
            </div>
          </div>

          {/* Card 2: Active Tasks */}
          <div className="bg-white border border-zinc-200 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Running Tasks</span>
              <Briefcase className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-black">{stats.activeTasks}</span>
              <p className="text-[9px] text-zinc-400 mt-1">Accepted jobs in progress</p>
            </div>
          </div>

          {/* Card 3: Posted Requests */}
          <div className="bg-white border border-zinc-200 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">My Posted Tasks</span>
              <FileText className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-black">{stats.postedRequests}</span>
              <p className="text-[9px] text-zinc-400 mt-1">Total created listings</p>
            </div>
          </div>

          {/* Card 4: Unread Messages/Notifications */}
          <div className="bg-white border border-zinc-200 p-5 rounded-[2rem] shadow-sm flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Alerts</span>
              <Bell className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-black">{stats.unreadNotifications}</span>
              <p className="text-[9px] text-zinc-400 mt-1">New platform updates</p>
            </div>
          </div>
        </section>

        {/* 4. TASK BROWSER CONTAINER */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-250 pb-4">
            <h2 className="text-lg font-bold text-black">Available Tasks Feed</h2>
            {/* Category Selector Scroll */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar max-w-[70%]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat
                      ? "bg-black text-white"
                      : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Task Bento Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-zinc-500">Loading feed tasks...</p>
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center text-red-500">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => {
                const postedBy =
                  post.postedBy && typeof post.postedBy === "object"
                    ? (post.postedBy as IUser)
                    : null;

                return (
                  <Link
                    to={`/post/${post._id}`}
                    key={post._id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/40 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Subtle Top Gradient Accent */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                    <div>
                      <div className="mb-5 flex items-center justify-between">
                        <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-600">
                          {post.category}
                        </span>
                        {post.isUrgent && (
                          <span className="flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-600 border border-rose-100/50">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                            </span>
                            Urgent
                          </span>
                        )}
                      </div>

                      <h3 className="mb-2.5 text-lg font-bold tracking-tight text-zinc-900 group-hover:text-black line-clamp-1">
                        {post.title}
                      </h3>

                      <p className="mb-6 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="mt-auto">
                      <div className="mb-6 flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-[10px] font-medium text-zinc-400">Budget</p>
                            <p className="text-xs font-semibold text-zinc-800">
                              {post.currency} {post.budgetMin}-{post.budgetMax}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-[10px] font-medium text-zinc-400">Deadline</p>
                            <p className="text-xs font-semibold text-zinc-800">
                              {new Date(post.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200">
                            {postedBy?.avatar ? (
                              <img
                                src={postedBy.avatar}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                                {postedBy?.username?.charAt(0).toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-semibold text-zinc-900 leading-tight">
                              {postedBy?.fullname || "Unknown User"}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                              {postedBy?.university || "No Campus"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 text-zinc-400 transition-colors group-hover:bg-black group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-250 bg-white">
              <p className="text-zinc-500 text-sm">No tasks found matching filters.</p>
              <Link
                to="/createpost"
                className="mt-4 text-xs font-semibold text-black underline hover:text-zinc-700"
              >
                Post a new task instead
              </Link>
            </div>
          )}
        </section>
      </div>
  );
};

export default Dashboard;
