import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePost } from "../hooks/usePost";

const PostDetails = () => {
  const { postId } = useParams();
  const { fetchPostById, loading, error } = usePost();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchPostById(postId);
        if (response.success) {
          setPost(response.data);
        }
      } catch (err) {
        console.error("Failed to load post details:", err);
      }
    };
    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-zinc-500">Loading post details...</p>
      </div>
    );
  }

  if (error || (!post && !loading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error || "Post not found"}</p>
          <Link to="/dashboard" className="mt-4 inline-block text-sm font-semibold text-black underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 text-zinc-900">
      <main className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link 
          to="/dashboard" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-black"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to tasks
        </Link>

        <div className="overflow-hidden rounded-[3rem] border border-zinc-200 bg-white shadow-sm">
          {/* Hero Section */}
          <div className="border-b border-zinc-100 p-8 sm:p-12">
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-full bg-zinc-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-zinc-600">
                {post.category}
              </span>
              {post.isUrgent && (
                <span className="rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-600">
                  Urgent
                </span>
              )}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-8 border-t border-zinc-100 pt-10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-zinc-200 overflow-hidden">
                   {post.postedBy?.avatar ? (
                      <img src={post.postedBy.avatar} alt="" className="h-full w-full object-cover" />
                   ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-300 text-lg font-bold text-white">
                        {post.postedBy?.username?.charAt(0).toUpperCase()}
                      </div>
                   )}
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{post.postedBy?.fullname}</p>
                  <p className="text-xs text-zinc-500">{post.postedBy?.university}</p>
                </div>
              </div>

              <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Budget Range</p>
                <p className="mt-1 font-semibold text-black">{post.currency} {post.budgetMin} - {post.budgetMax}</p>
              </div>

              <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Deadline</p>
                <p className="mt-1 font-semibold text-black">{new Date(post.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-12">
            <div className="prose prose-zinc max-w-none">
              <h2 className="text-lg font-semibold text-black">Description</h2>
              <p className="mt-4 whitespace-pre-wrap leading-relaxed text-zinc-600">
                {post.description}
              </p>
            </div>

            {post.attachments && post.attachments.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-semibold text-black">Attachments ({post.attachments.length})</h2>
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {post.attachments.map((url, idx) => (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 transition hover:border-zinc-400"
                    >
                      <img src={url} alt={`Attachment ${idx + 1}`} className="h-full w-full object-cover transition group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                        <svg className="h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-16 flex border-t border-zinc-100 pt-10">
              <button className="w-full rounded-full bg-black py-4 text-sm font-bold text-white transition hover:bg-zinc-800 sm:w-auto sm:px-12">
                Send a Proposal
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetails;
