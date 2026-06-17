import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../hooks/useAuth";

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
  const { handleLogout } = useAuth();
  const { fetchPosts, loading, error } = usePost();
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const onLogout = async () => {
    try {
      await handleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
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
  }, []);

	const filteredPosts =
		selectedCategory === "All"
			? posts
			: posts.filter(
					(post) =>
						post.category.toLowerCase() ===
						selectedCategory.toLowerCase()
			  );

	return (
		<div className="min-h-screen bg-stone-50 text-zinc-900">
			<main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8">
				
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-black">
								Browse Tasks
							</h1>
							<p className="mt-2 text-sm text-zinc-500">
								Found {filteredPosts.length} supporting requests in your area.
							</p>
						</div>
						<div className="flex items-center gap-4">
							<Link
								to="/chat"
								className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-black"
							>
								Messages
							</Link>
							<button
								onClick={onLogout}
								className="rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-black"
							>
								Logout
							</button>
							<Link
								to="/createpost"
								className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
							>
								Post a request
							</Link>
						</div>
					</div>

					
					<div className="flex flex-wrap gap-2">
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setSelectedCategory(cat)}
								className={`rounded-full px-5 py-2 text-sm font-medium transition ${
									selectedCategory === cat
										? "bg-black text-white"
										: "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"
								}`}
							>
								{cat}
							</button>
						))}
					</div>

					{/* Post Grid */}
					{loading ? (
						<div className="flex h-64 items-center justify-center">
							<p className="text-zinc-500">Loading tasks...</p>
						</div>
					) : error ? (
						<div className="flex h-64 items-center justify-center text-red-500">
							{error}
						</div>
					) : (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredPosts.map((post) => (
								<div
									key={post._id}
									className="group flex flex-col rounded-[2.5rem] border border-zinc-200 bg-white p-6 transition-all hover:shadow-xl hover:shadow-zinc-200/50"
								>
									<div className="mb-4 flex items-center justify-between">
										<span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-600">
											{post.category}
										</span>
										{post.isUrgent && (
											<span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-600">
												Urgent
											</span>
										)}
									</div>

									<h3 className="mb-2 text-xl font-semibold text-black group-hover:text-zinc-700">
										{post.title}
									</h3>

                  <p className="mb-6 grow text-sm leading-relaxed text-zinc-600 line-clamp-3">
                    {post.description}
                  </p>									<div className="mb-6 grid grid-cols-2 gap-4 rounded-3xl bg-zinc-50 p-4">
										<div>
											<p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
												Budget
											</p>
											<p className="font-semibold text-black">
												{post.currency} {post.budgetMin} -{" "}
												{post.budgetMax}
											</p>
										</div>
										<div>
											<p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
												Deadline
											</p>
											<p className="font-semibold text-black">
												{new Date(post.deadline).toLocaleDateString()}
											</p>
										</div>
									</div>

									<div className="flex items-center justify-between border-t border-zinc-100 pt-4">
										<div className="flex items-center gap-3">
											<div className="h-8 w-8 rounded-full bg-zinc-200 overflow-hidden">
												{post.postedBy?.avatar ? (
													<img
														src={post.postedBy.avatar}
														alt=""
														className="h-full w-full object-cover"
													/>
												) : (
													<div className="h-full w-full bg-zinc-300 flex items-center justify-center text-[10px] font-bold text-white">
														{post.postedBy?.username?.charAt(0).toUpperCase()}
													</div>
												)}
											</div>
											<div>
												<p className="text-xs font-bold text-black">
													{post.postedBy?.fullname}
												</p>
												<p className="text-[10px] text-zinc-500">
													{post.postedBy?.university}
												</p>
											</div>
										</div>
										<Link
											to={`/post/${post._id}`}
											className="rounded-full bg-zinc-900 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-black"
										>
											View Details
										</Link>
									</div>
								</div>
							))}
						</div>
					)}

					{!loading && filteredPosts.length === 0 && (
						<div className="flex h-64 flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200">
							<p className="text-zinc-500">No tasks found in this category.</p>
							<Link
								to="/createpost"
								className="mt-4 text-sm font-semibold text-black underline"
							>
								Post the first one
							</Link>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default Dashboard;