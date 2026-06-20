import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import { AuthContext } from "../auth.context";
import { createProposal, getPostProposals, acceptProposal } from "../services/proposal.api";
import { IPost, IProposal, IUser } from "../../../types";
import api from "../services/auth.api";
import { lockEscrow } from "../services/wallet.api";

interface ProposalFormState {
  coverMessage: string;
  proposedAmount: string;
  estimatedDeliveryDays: string;
}

const PostDetails = () => {
  const { postId } = useParams<{ postId: string }>();
  const { fetchPostById, loading, error } = usePost();
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;
  const navigate = useNavigate();

  const [post, setPost] = useState<IPost | null>(null);
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalFormState>({
    coverMessage: "",
    proposedAmount: "",
    estimatedDeliveryDays: "",
  });
  const [submitting, setSubmitting] = useState(false);
  
  const [order, setOrder] = useState<any>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [submittingWork, setSubmittingWork] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  const fetchOrder = async () => {
    if (!postId) return;
    try {
      const res = await api.get(`/api/v1/orders/post/${postId}`);
      if (res.data.success) {
        setOrder(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const handleWorkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setSubmittingWork(true);
    try {
      const res = await api.post(`/api/v1/orders/${order._id}/submit`, {
        deliverables: [{ url: deliverableUrl, filename: "Project Deliverable" }]
      });
      
      if (res.data.success) {
        alert("Work submitted successfully! Client has been notified.");
        setShowSubmitForm(false);
        setOrder(res.data.data);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to submit work");
    } finally {
      setSubmittingWork(false);
    }
  };

  const handlePayWithWallet = async () => {
    if (!order) return;
    setSubmittingPayment(true);
    try {
      const res = await lockEscrow(order._id);
      if (res.success) {
        alert("Payment locked in Escrow successfully!");
        fetchOrder();
      }
    } catch (error: any) {
      alert(error.message || error.response?.data?.message || "Insufficient wallet balance. Please top up your wallet.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleClientPayment = async () => {
    if (!order) return;
    try {
      const initRes = await api.post("/api/v1/payments/initiate", {
        orderId: order._id,
        gateway: "khalti"
      });
      
      if (initRes.data.success) {
        const verifyRes = await api.post("/api/v1/payments/verify", {
          orderId: order._id,
          gateway: "khalti",
          transactionId: `mock_txn_${Date.now()}`
        });

        if (verifyRes.data.success) {
          alert("Payment verified successfully! Funds are now locked in Escrow.");
          fetchOrder();
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Payment failed");
    }
  };

  const handleReleaseFunds = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to approve this work and release payment to the helper?")) return;
    try {
      const res = await api.post(`/api/v1/payments/${order._id}/release`, {});
      if (res.data.success) {
        alert("Payment released successfully to the helper!");
        fetchOrder();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to release funds");
    }
  };

  const fetchProposals = async () => {
    if (!postId) return;
    try {
      const data = await getPostProposals(postId);
      if (data.success) {
        setProposals(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    }
  };

  useEffect(() => {
    const loadPost = async () => {
      if (!postId) return;
      try {
        const response = await fetchPostById(postId);
        if (response.success) {
          setPost(response.data);
          const postedByUser = response.data.postedBy && typeof response.data.postedBy === "object"
            ? (response.data.postedBy as IUser)
            : null;

          if (currentUser && postedByUser && postedByUser._id === currentUser._id) {
            fetchProposals();
          }

          if (response.data.status === "in_progress") {
            fetchOrder();
          }
        }
      } catch (err) {
        console.error("Failed to load post details:", err);
      }
    };
    loadPost();
  }, [postId, currentUser]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;
    setSubmitting(true);
    try {
      const data = await createProposal(postId, {
        coverMessage: proposalData.coverMessage,
        proposedAmount: Number(proposalData.proposedAmount),
        estimatedDeliveryDays: Number(proposalData.estimatedDeliveryDays),
      });
      if (data.success) {
        alert("Proposal submitted successfully!");
        setShowProposalForm(false);
      }
    } catch (error: any) {
      alert(error.message || "Failed to submit proposal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    if (!postId) return;
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
    } catch (error: any) {
      alert(error.message || "Failed to accept proposal");
    }
  };

  const postedByUser = post?.postedBy && typeof post.postedBy === "object"
    ? (post.postedBy as IUser)
    : null;

  const isOwner = currentUser && postedByUser && postedByUser._id === currentUser._id;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
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

  if (!post) return null;

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
                <div className="h-12 w-12 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center">
                  {postedByUser?.avatar ? (
                    <img src={postedByUser.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-300 text-lg font-bold text-white">
                      {postedByUser?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-black">{postedByUser?.fullname || "Unknown User"}</p>
                  <p className="text-xs text-zinc-500">{postedByUser?.university || "No University"}</p>
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
                  {/* Order & Escrow Management Card for Client */}
                  {post.status === "in_progress" && order && (
                    <div className="mb-10 p-8 rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
                      <h3 className="text-xl font-bold mb-4">Order & Escrow Status</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-zinc-50 p-6 rounded-2xl">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Order Status</p>
                          <p className="text-sm font-semibold text-black mt-1 capitalize">{order.status.replace("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Escrow Balance</p>
                          <p className="text-sm font-semibold text-black mt-1">
                            {order.currency} {order.agreedAmount} ({order.escrowStatus === "held" ? "Locked in Escrow" : order.escrowStatus === "released" ? "Released to Helper" : "Unpaid"})
                          </p>
                        </div>
                      </div>

                      {order.escrowStatus === "unpaid" && (
                        <div className="space-y-6 mt-6 border-t border-zinc-150 pt-6">
                          <h4 className="font-bold text-xs text-black uppercase tracking-widest">Order Payment Summary</h4>
                          
                          <div className="border border-zinc-200 rounded-3xl bg-stone-50/50 p-6 space-y-3 text-xs">
                            <div className="flex justify-between text-zinc-500 font-medium">
                              <span>Task Amount</span>
                              <span className="font-mono font-semibold text-black">NPR {order.agreedAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 font-medium">
                              <span>Platform Fee (10% included)</span>
                              <span className="font-mono font-semibold text-black">NPR {(order.agreedAmount * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="border-t border-zinc-200 pt-3 flex justify-between font-bold text-sm">
                              <span className="text-black">Total Deducted</span>
                              <span className="font-mono text-black">NPR {order.agreedAmount.toFixed(2)}</span>
                            </div>
                            <div className="text-[10px] text-zinc-400 italic mt-2">
                              Note: The helper will earn NPR {(order.agreedAmount * 0.9).toFixed(2)} (90%) upon completion.
                            </div>
                          </div>

                          <div className="space-y-4">
                            <p className="text-xs text-zinc-500">
                              {order.status === "submitted" 
                                ? "The helper has submitted the deliverables, but you must lock the funds in escrow before approving and releasing them."
                                : "Lock funds in escrow to authorize the helper to begin working on the assignment."}
                            </p>
                            <button
                              onClick={handlePayWithWallet}
                              disabled={submittingPayment}
                              className="bg-black hover:bg-zinc-800 text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition w-full sm:w-auto shadow-md"
                            >
                              {submittingPayment ? (
                                <>
                                  <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-t-transparent border-white"></span>
                                  Locking Escrow...
                                </>
                              ) : (
                                "Pay & Lock Escrow"
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {order.status === "active" && order.escrowStatus === "held" && (
                        <p className="text-xs text-zinc-500">The helper has been authorized to work. Waiting for work submission.</p>
                      )}

                      {order.status === "submitted" && (
                        <div className="space-y-4">
                          <p className="text-xs text-zinc-500 font-semibold text-amber-700">
                            {order.escrowStatus === "unpaid" 
                              ? "The helper has completed the task and submitted deliverables. Please pay the escrow balance above to unlock the approval button."
                              : "The helper has completed the task and submitted deliverables. Please review and approve to release payment."}
                          </p>
                          {order.deliverables && order.deliverables.length > 0 && (
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-150 mb-4">
                              <p className="text-xs font-bold text-black mb-1">Deliverables Link:</p>
                              <a
                                href={order.deliverables[0].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 underline break-all font-semibold"
                              >
                                {order.deliverables[0].url}
                              </a>
                            </div>
                          )}
                          {order.escrowStatus === "held" && (
                            <button
                              onClick={handleReleaseFunds}
                              className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-green-700 transition"
                            >
                              Approve Work & Release Payment
                            </button>
                          )}
                        </div>
                      )}

                      {order.status === "completed" && (
                        <p className="text-xs text-green-600 font-semibold">Funds have been released to the helper. Order completed successfully!</p>
                      )}
                    </div>
                  )}

                  <h2 className="text-2xl font-semibold mb-6">Proposals</h2>
                  <div className="space-y-6">
                    {proposals.length === 0 ? (
                      <p className="text-zinc-500">No proposals received yet.</p>
                    ) : (
                      proposals.map((prop) => {
                        const helperUser = prop.helper && typeof prop.helper === "object"
                          ? (prop.helper as IUser)
                          : null;
                        return (
                          <div key={prop._id} className="border rounded-2xl p-6 bg-stone-50">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <img src={helperUser?.avatar || "/default-avatar.png"} className="w-10 h-10 rounded-full border border-zinc-200 object-cover" />
                                <div>
                                  <p className="font-bold">{helperUser?.fullname || "Unknown Helper"}</p>
                                  <p className="text-xs text-zinc-500">@{helperUser?.username || "unknown"}</p>
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
                                <Link to="/chat" className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-800">Chat with Helper</Link>
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
                        );
                      })
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
                          onChange={(e) => setProposalData({ ...proposalData, coverMessage: e.target.value })}
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
                            onChange={(e) => setProposalData({ ...proposalData, proposedAmount: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2">Estimated Delivery (Days)</label>
                          <input
                            type="number"
                            required
                            className="w-full border rounded-xl p-3"
                            value={proposalData.estimatedDeliveryDays}
                            onChange={(e) => setProposalData({ ...proposalData, estimatedDeliveryDays: e.target.value })}
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
                    <div className="space-y-4">
                      <div className="bg-zinc-50 border border-zinc-150 p-6 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-zinc-800">This task is in progress.</p>
                          {order && (
                            <p className="text-xs text-zinc-500 mt-1">
                              Payment: {order.escrowStatus === "held" ? "Locked in Escrow" : order.escrowStatus} | Status: {order.status}
                            </p>
                          )}
                        </div>
                        <Link to="/chat" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-zinc-800">Go to Chat</Link>
                      </div>

                      {/* If the current user is the helper, show Submission form/button */}
                      {((typeof post.acceptedProposal === "object" && (post.acceptedProposal as any).helper?._id === currentUser?._id) ||
                        (order && order.helper === currentUser?._id)) && (
                        <>
                          {(order?.status === "active" || order?.status === "pending_payment") && (
                            <div className="border border-zinc-200 p-6 rounded-[2rem] bg-white">
                              <h4 className="font-bold text-lg mb-2">Submit Deliverables</h4>
                              {order?.status === "pending_payment" && (
                                <p className="text-xs text-amber-600 mb-4 bg-amber-50 p-3 rounded-xl border border-amber-200">
                                  <strong>Notice:</strong> The client has not locked escrow payment yet. You can still submit your deliverables to notify the client and prompt payment.
                                </p>
                              )}
                              {showSubmitForm ? (
                                <form onSubmit={handleWorkSubmit} className="space-y-4">
                                  <input
                                    type="url"
                                    required
                                    placeholder="Paste your deliverable link (GitHub, Google Drive, etc.)"
                                    className="w-full border rounded-xl p-3"
                                    value={deliverableUrl}
                                    onChange={(e) => setDeliverableUrl(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      disabled={submittingWork}
                                      className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-800 disabled:bg-zinc-400"
                                    >
                                      {submittingWork ? "Submitting..." : "Submit Work"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setShowSubmitForm(false)}
                                      className="border px-6 py-2 rounded-full font-bold text-sm hover:bg-zinc-50"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <button
                                  onClick={() => setShowSubmitForm(true)}
                                  className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-800"
                                >
                                  Submit Completed Task
                                </button>
                              )}
                            </div>
                          )}

                          {order?.status === "submitted" && (
                            <div className="bg-green-50 p-6 rounded-2xl">
                              <p className="font-semibold text-green-800">You have submitted your deliverables. Waiting for client approval.</p>
                            </div>
                          )}
                        </>
                      )}
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
