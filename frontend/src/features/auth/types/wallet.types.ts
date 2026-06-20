export interface IWallet {
  _id: string;
  userId: string | null;
  isSystem: boolean;
  availableBalance: number;
  escrowBalance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionLedger {
  _id: string;
  walletId: string;
  userId: string | null;
  amount: number;
  type: "credit" | "debit";
  balanceType: "available" | "escrow";
  description: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  referenceModel: "Order" | "TopUp" | "Withdrawal";
  referenceId: string;
  createdAt: string;
}
