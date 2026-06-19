export interface IUser {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string | null;
  bio?: string;
  university?: string;
  faculty?: string;
  semester?: number;
  skills: string[];
  isVerified: boolean;
  verificationStatus: "unsubmitted" | "pending" | "approved" | "rejected";
  studentIdCardUrl?: string | null;
  verifiedAt?: string | Date | null;
  verifiedBy?: string | null;
  rejectionReason?: string | null;
  walletBalance: number;
  averageRating: number;
  totalRatings: number;
  refreshToken?: string;
  isEmailVerified: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IPost {
  _id: string;
  title: string;
  description: string;
  category: "assignment" | "project" | "notes" | "presentation" | "research" | "other";
  subject: string;
  budgetMin: number;
  budgetMax: number;
  currency: "NPR" | "INR";
  deadline: string | Date;
  attachments: {
    url: string;
    publicId: string;
    filename: string;
  }[];
  postedBy: string | IUser;
  status: "open" | "in_progress" | "completed" | "cancelled" | "closed";
  acceptedProposal?: string | IProposal | null;
  isUrgent: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IProposal {
  _id: string;
  post: string | IPost;
  helper: string | IUser;
  coverMessage: string;
  proposedAmount: number;
  estimatedDeliveryDays: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IMessage {
  _id: string;
  senderId: string | IUser;
  receiverId: string | IUser;
  content: string;
  seen: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IConversation {
  _id: string;
  participants: (string | IUser)[];
  messages: (string | IMessage)[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IOrder {
  _id: string;
  post: string | IPost;
  proposal: string | IProposal;
  client: string | IUser;
  helper: string | IUser;
  agreedAmount: number;
  finalAmount?: number;
  currency: "NPR" | "USD";
  status: "pending_payment" | "active" | "submitted" | "completed" | "cancelled" | "disputed" | "refunded";
  workDeadline: string | Date;
  submittedAt?: string | Date;
  completedAt?: string | Date;
  escrowStatus: "unpaid" | "held" | "released" | "refunded";
  deliverables: {
    url: string;
    publicId: string;
    filename: string;
    submittedAt: string | Date;
  }[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
