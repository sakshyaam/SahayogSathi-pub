import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { AuthContext } from "../auth.context";
import { createProposal, getPostProposals, acceptProposal } from "../services/proposal.api";

const PostDetails = () => {
  const { postId } = useParams();
  const { fetchPostById, loading, error } = usePost();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    coverMessage: "",
    proposedAmount: "",
    estimatedDeliveryDays: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchPostById(postId);
        if (response.success) {
          setPost(response.data);
          // If owner, fetch proposals
          if (currentUser && response.data.postedBy._id === currentUser._id) {
            fetchProposals();
          }
        }
      } catch (err) {
        console.error("Failed to load post details:", err);
      }
    };
    loadPost();
  }, [postId, currentUser]);

  const fetchProposals = async () => {
    try {
      const data = await getPostProposals(postId);
      if (data.success) {
        setProposals(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await createProposal(postId, proposalData);
      if (data.success) {
        alert("Proposal submitted successfully!");
        setShowProposalForm(false);
      }
    } catch (error) {
      alert(error.message || "Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposalId) => {
    if (!window.confirm("Are you sure you want to accept this proposal? This will close the task to others.")) return;
    try {
      const data = await acceptProposal(proposalId);
      if (data.success) {
        alert("Proposal accepted!");
        // Refresh post and proposals
        const response = await fetchPostById(postId);
        setPost(response.data);
        fetchProposals();
      }
    } catch (error) {
      alert(error.message || "Failed to accept proposal");
    }
  };

  const isOwner = currentUser && post && post.postedBy._id === currentUser._id;

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
                  {post.attachments.map((att, idx) => (
                    <a 
                      key={idx} 
                      href={att.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 transition hover:border-zinc-400"
                    >
                      <img src={att.url} alt={`Attachment ${idx + 1}`} className="h-full w-full object-cover transition group-hover:scale-105" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions / Proposals */}
            <div className="mt-16 border-t border-zinc-100 pt-10">
              {isOwner ? (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Proposals</h2>
                  <div className="space-y-6">
                    {proposals.length === 0 ? (
                      <p className="text-zinc-500">No proposals received yet.</p>
                    ) : (
                      proposals.map((prop) => (
                        <div key={prop._id} className="border rounded-2xl p-6 bg-stone-50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <img src={prop.helper.avatar || "/default-avatar.png"} className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="font-bold">{prop.helper.fullname}</p>
                                <p className="text-xs text-zinc-500">@{prop.helper.username}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{post.currency} {prop.proposedAmount}</p>
                              <p className="text-xs text-zinc-500">{prop.estimatedDeliveryDays} days delivery</p>
                            </div>
                          </div>
                          <p className="text-zinc-600 mb-6">{prop.coverMessage}</p>
                          
                          {prop.status === "accepted" ? (
                            <div className="flex gap-4">
                              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">Accepted</span>
                              <Link to="/chat" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700">Chat with Helper</Link>
                            </div>
                          ) : post.status === "open" ? (
                            <button 
                              onClick={() => handleAcceptProposal(prop._id)}
                              className="bg-black text-white px-8 py-2 rounded-full font-bold text-sm hover:bg-zinc-800"
                            >
                              Accept Proposal
                            </button>
                          ) : (
                            <span className="text-zinc-400 text-sm italic">{prop.status}</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  {showProposalForm ? (
                    <form onSubmit={handleProposalSubmit} className="space-y-6 bg-stone-50 p-8 rounded-[2rem]">
                      <h3 className="text-xl font-bold">Submit Your Proposal</h3>
                      <div>
                        <label className="block text-sm font-bold mb-2">Cover Message</label>
                        <textarea 
                          required
                          className="w-full border rounded-xl p-3 h-32"
                          placeholder="Tell the owner why you are the best fit..."
                          value={proposalData.coverMessage}
                          onChange={(e) => setProposalData({...proposalData, coverMessage: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2">Proposed Amount ({post.currency})</label>
                          <input 
                            type="number"
                            required
                            className="w-full border rounded-xl p-3"
                            value={proposalData.proposedAmount}
                            onChange={(e) => setProposalData({...proposalData, proposedAmount: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2">Estimated Delivery (Days)</label>
                          <input 
                            type="number"
                            required
                            className="w-full border rounded-xl p-3"
                            value={proposalData.estimatedDeliveryDays}
                            onChange={(e) => setProposalData({...proposalData, estimatedDeliveryDays: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-zinc-800 disabled:bg-zinc-400"
                        >
                          {submitting ? "Submitting..." : "Submit Proposal"}
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowProposalForm(false)}
                          className="px-8 py-4 border rounded-full font-bold hover:bg-zinc-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : post.status === "open" ? (
                    <button 
                      onClick={() => setShowProposalForm(true)}
                      className="w-full rounded-full bg-black py-4 text-sm font-bold text-white transition hover:bg-zinc-800 sm:w-auto sm:px-12"
                    >
                      Send a Proposal
                    </button>
                  ) : post.status === "in_progress" && post.acceptedProposal ? (
                    <div className="bg-blue-50 p-6 rounded-2xl flex justify-between items-center">
                      <p className="font-semibold text-blue-800">This task is in progress.</p>
                      <Link to="/chat" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700">Go to Chat</Link>
                    </div>
                  ) : (
                    <p className="text-zinc-500 italic">This post is no longer accepting proposals.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetails;
