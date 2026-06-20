import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import { initiateTopUp, verifyTopUp } from "../services/wallet.api";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TopUpModal = ({ isOpen, onClose, onSuccess }: TopUpModalProps) => {
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState("khalti");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "simulating" | "success">("input");
  const [error, setError] = useState<string | null>(null);

  const handlePresetClick = (val: number) => {
    setAmount(val.toString());
  };

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await initiateTopUp(numAmount, gateway);
      if (res.success) {
        setStep("simulating");
        // Simulate a small loading wait for the redirect callback
        setTimeout(async () => {
          try {
            const verifyRes = await verifyTopUp(numAmount, `txn_mock_${Date.now()}`, gateway);
            if (verifyRes.success) {
              setStep("success");
              onSuccess();
            }
          } catch (err: any) {
            setError(err.message || "Payment verification failed.");
            setStep("input");
          } finally {
            setLoading(false);
          }
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate top-up.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.35 }}
        className="relative bg-white border border-zinc-200 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl z-10 text-zinc-900"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-zinc-100 transition text-zinc-400 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        {step === "input" && (
          <form onSubmit={handleInitiate} className="space-y-6">
            <div>
              <div className="flex h-10 w-10 items-center justify-center bg-black text-white rounded-2xl mb-4 shadow-md">
                <Wallet className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-black">Top Up Wallet</h2>
              <p className="text-xs text-zinc-500 mt-1">Load available funds into SathiSahayog's virtual wallet via payment gateway.</p>
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Amount (NPR)</label>
              <input
                type="number"
                required
                min="10"
                placeholder="Enter deposit amount"
                className="w-full bg-stone-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-400 text-black font-semibold"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className="border border-zinc-200 hover:border-zinc-400 py-1.5 text-xs font-semibold rounded-lg text-zinc-600 hover:text-black bg-white transition"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway("khalti")}
                  className={`border p-3 rounded-xl flex items-center justify-center text-xs font-bold uppercase transition ${
                    gateway === "khalti"
                      ? "border-black bg-zinc-50 text-black shadow-sm"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                  }`}
                >
                  Khalti
                </button>
                <button
                  type="button"
                  onClick={() => setGateway("esewa")}
                  className={`border p-3 rounded-xl flex items-center justify-center text-xs font-bold uppercase transition ${
                    gateway === "esewa"
                      ? "border-black bg-zinc-50 text-black shadow-sm"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-400"
                  }`}
                >
                  eSewa
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-zinc-800 text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>{loading ? "Initializing..." : "Proceed to Payment"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {step === "simulating" && (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
            <div>
              <h3 className="font-bold text-black text-sm">Simulating Gateway Auth...</h3>
              <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px] leading-relaxed">Please do not refresh. We are verifying the transaction record from the mock {gateway} portal.</p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-5">
            <div className="h-12 w-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-sm animate-bounce">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-black text-base">Top Up Complete!</h3>
              <p className="text-xs text-zinc-500 mt-1">Available balance credited with NPR {amount}.</p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-black text-white hover:bg-zinc-800 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TopUpModal;
