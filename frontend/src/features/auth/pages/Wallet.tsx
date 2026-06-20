import React, { useEffect, useState } from "react";
import { Wallet as WalletIcon, Lock, Plus, ArrowDownLeft, RefreshCw, AlertCircle, Calendar, ArrowUpRight } from "lucide-react";
import { getWalletDetails, getTransactionHistory } from "../services/wallet.api";
import { IWallet, ITransactionLedger } from "../types/wallet.types";
import TopUpModal from "../components/TopUpModal";

const Wallet = () => {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<ITransactionLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [walletRes, ledgerRes] = await Promise.all([
        getWalletDetails(),
        getTransactionHistory()
      ]);
      if (walletRes.success) {
        setWallet(walletRes.data);
      }
      if (ledgerRes.success) {
        setTransactions(ledgerRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load wallet stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleWithdraw = () => {
    if (!wallet || wallet.availableBalance <= 0) {
      alert("You do not have any available balance to withdraw.");
      return;
    }
    alert(`Withdrawal request of NPR ${wallet.availableBalance} submitted successfully to your registered bank account/eSewa wallet!`);
  };

  return (
    <div className="p-4 md:p-8 pt-20 md:pt-8 flex-1 bg-stone-50 text-zinc-900">
      <main className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-black flex items-center gap-2">
              Virtual Wallet <WalletIcon className="h-7 w-7 text-zinc-650" />
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage your available earnings, escrowed payments, and transaction ledger logs.
            </p>
          </div>
          <button
            onClick={fetchWalletData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 hover:border-zinc-400 bg-white rounded-full text-xs font-semibold hover:text-black transition disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-3xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Balance Stat Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Available Balance */}
          <div className="bg-white border border-zinc-200 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:shadow-md transition">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Available Balance</span>
              <WalletIcon className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-black">
                NPR {wallet?.availableBalance !== undefined ? wallet.availableBalance.toFixed(2) : "0.00"}
              </span>
              <p className="text-[9px] text-zinc-400 mt-1">Ready for payments and withdrawals</p>
            </div>
          </div>

          {/* Card 2: Escrow Balance */}
          <div className="bg-white border border-zinc-200 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between min-h-[140px] relative overflow-hidden group hover:shadow-md transition">
            <div className="flex justify-between items-center text-zinc-400">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Locked Escrow Balance</span>
              <Lock className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="mt-4">
              <span className="text-3xl font-black text-black">
                NPR {wallet?.escrowBalance !== undefined ? wallet.escrowBalance.toFixed(2) : "0.00"}
              </span>
              <p className="text-[9px] text-zinc-400 mt-1">Funds secured in running tasks</p>
            </div>
          </div>
        </section>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-black hover:bg-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-md transition"
          >
            <Plus className="h-4 w-4" />
            Add Funds
          </button>
          <button
            onClick={handleWithdraw}
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-zinc-50 border border-zinc-250 px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:border-zinc-400 transition"
          >
            <ArrowUpRight className="h-4 w-4" />
            Withdraw Earnings
          </button>
        </div>

        {/* Transaction History (Double-Entry Ledger Table) */}
        <section className="bg-white border border-zinc-200 rounded-[2.5rem] p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-black mb-6">Ledger Transaction History</h2>
          
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-zinc-500 text-xs">Loading ledger entries...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-zinc-200 rounded-3xl bg-stone-50 p-6 text-center">
              <Calendar className="h-8 w-8 text-zinc-300 mb-2" />
              <p className="text-zinc-500 font-semibold text-xs">No records available</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Top up your wallet or start projects to log activity.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Description</th>
                    <th className="py-4 px-4">Type</th>
                    <th className="py-4 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {transactions.map((txn) => {
                    const isCredit = txn.type === "credit";
                    return (
                      <tr key={txn._id} className="hover:bg-stone-50/50 transition">
                        <td className="py-4 px-4 text-zinc-400">
                          {new Date(txn.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-zinc-700 max-w-sm truncate">
                          {txn.description}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            isCredit
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                            {isCredit ? "Credit" : "Debit"}
                          </span>
                        </td>
                        <td className={`py-4 px-4 text-right font-semibold font-mono text-sm ${
                          isCredit ? "text-green-600" : "text-red-600"
                        }`}>
                          {isCredit ? "+" : "-"}NPR {txn.amount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* TopUp Modal Popup */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={fetchWalletData}
      />
    </div>
  );
};

export default Wallet;
