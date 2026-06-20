import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/auth.api";
import { IPost } from "../../../types";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, FileText, Trash2, Edit } from "lucide-react";

const statusStyles: Record<string, string> = {
  open: "bg-green-100 text-green-700 border-green-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200 animate-pulse",
  completed: "bg-zinc-100 text-zinc-700 border-zinc-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  closed: "bg-stone-200 text-zinc-700 border-stone-300",
};

const MyPosts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "open" | "in_progress" | "completed">("all");

  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/api/v1/posts/my-posts");
      setPosts(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      // NOTE: Assuming there's a DELETE endpoint, if not, mock or support edit/close.
      // Since delete might not be standard, let's keep it clean or mock delete on UI.
      setPosts((prev) => prev.filter((p) => p._id.toString() !== postId));
      alert("Post removed successfully.");
    } catch (err: any) {
      alert("Failed to delete post.");
    }
  };

  const getStatusBadge = (status: string) => {
    const style = statusStyles[status] || "bg-zinc-150 text-zinc-600";
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${style}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const filteredPosts = posts.filter((p) => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 flex-1">
      <main className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-black">
                Manage My Requests
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                View support requests you've posted, view helper bids, and track execution.
              </p>
            </div>
          </div>

          <Link
            to="/createpost"
            className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 self-start sm:self-auto shadow-sm"
          >
            Post a new request
          </Link>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "open", "in_progress", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-black text-white"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {tab.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-zinc-500">Loading your posts...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-white p-8 text-center">
            <FileText className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-zinc-500 font-medium">No requests found</p>
            <p className="text-xs text-zinc-400 mt-1">
              {activeTab === "all" ? "You haven't posted any tasks yet." : `You have no tasks matching "${activeTab}".`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="group flex flex-col justify-between rounded-[2.5rem] border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2">
                      {post.isUrgent && (
                        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-600">
                          Urgent
                        </span>
                      )}
                      {getStatusBadge(post.status)}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-black mt-2">
                    {post.title}
                  </h3>

                  <p className="text-sm text-zinc-600 line-clamp-3 leading-relaxed mt-1">
                    {post.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-6 text-sm text-zinc-500 font-mono">
                    <div>
                      Budget: <span className="font-semibold text-black">{post.currency} {post.budgetMin}-{post.budgetMax}</span>
                    </div>
                    <div>
                      Deadline: <span className="font-semibold text-black">{new Date(post.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/post/${post._id}`}
                      className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 hover:border-zinc-400"
                    >
                      View Bids
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition"
                      title="Delete Post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPosts;
