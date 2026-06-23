import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/auth.api";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Wallet,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

interface TaskItem {
  _id: string;
  post: {
    _id: string;
    title: string;
    description: string;
    category: string;
    deadline: string;
  };
  client: {
    fullname: string;
    username: string;
    avatar?: string;
    university: string;
  };
  agreedAmount: number;
  currency: string;
  status: "pending_payment" | "active" | "submitted" | "completed" | "cancelled" | "disputed" | "refunded";
  escrowStatus: "unpaid" | "held" | "released" | "refunded";
  workDeadline: string;
  createdAt: string;
}

const MyTasks = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/v1/orders/my-tasks");
      setTasks(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_payment":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Pending Payment
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200 animate-pulse">
            <Clock className="h-3 w-3" /> In Progress
          </span>
        );
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-200">
            <FileText className="h-3 w-3" /> Submitted
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700 border border-zinc-200">
            <AlertCircle className="h-3 w-3" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 flex-1">
      <main className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              My Accepted Tasks
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track tasks you've accepted, submit work, and view payment statuses.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-zinc-500">Loading tasks...</p>
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center text-red-500">
            {error}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-white p-8 text-center">
            <FileText className="h-10 w-10 text-zinc-300 mb-3" />
            <p className="text-zinc-500 font-medium">No tasks accepted yet</p>
            <p className="text-xs text-zinc-400 mt-1">Browse the dashboard to find tasks and bid on proposals!</p>
            <Link
              to="/dashboard"
              className="mt-4 rounded-full bg-black px-6 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition"
            >
              Browse Tasks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/40 hover:-translate-y-1 overflow-hidden"
              >
                {/* Subtle Top Gradient Accent */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-zinc-600">
                      {task.post?.category || "Task"}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>

                  <h3 className="mb-2.5 text-lg font-bold tracking-tight text-zinc-900 group-hover:text-black line-clamp-1">
                    {task.post?.title || "Deleted Task"}
                  </h3>

                  <p className="mb-6 text-sm leading-relaxed text-zinc-500 line-clamp-2">
                    {task.post?.description || "No description available."}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="mb-6 flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-[10px] font-medium text-zinc-400">Agreed Budget</p>
                        <p className="text-xs font-semibold text-zinc-800">
                          {task.currency} {task.agreedAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-zinc-400" />
                      <div>
                        <p className="text-[10px] font-medium text-zinc-400">Deadline</p>
                        <p className="text-xs font-semibold text-zinc-800">
                          {new Date(task.workDeadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200">
                        {task.client?.avatar ? (
                          <img
                            src={task.client.avatar}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                            {task.client?.username?.charAt(0).toUpperCase() || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-900 leading-tight">
                          {task.client?.fullname || "Unknown Client"}
                        </p>
                        <p className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                          {task.client?.university || "No University"}
                        </p>
                      </div>
                    </div>

                    {task.post && (
                      <Link
                        to={`/post/${task.post._id}`}
                        className="flex items-center gap-1 rounded-full bg-black hover:bg-zinc-800 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-all shadow-sm"
                      >
                        {task.status === "active" ? "Submit Work" : "View Details"}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
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

export default MyTasks;
