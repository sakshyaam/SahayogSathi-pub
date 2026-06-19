import { Document, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  bio?: string;
  university?: string;
  faculty?: string;
  semester?: number;
  skills: string[];
  isVerified: boolean;
  verificationStatus: "unsubmitted" | "pending" | "approved" | "rejected";
  studentIdCardUrl?: string;
  verifiedAt?: Date;
  verifiedBy?: Types.ObjectId;
  rejectionReason?: string;
  walletBalance: number;
  averageRating: number;
  totalRatings: number;
  refreshToken?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: "assignment" | "project" | "notes" | "presentation" | "research" | "other";
  subject: string;
  budgetMin: number;
  budgetMax: number;
  currency: "NPR" | "INR";
  deadline: Date;
  attachments: {
    url: string;
    publicId: string;
    filename: string;
  }[];
  postedBy: Types.ObjectId | IUser;
  status: "open" | "in_progress" | "completed" | "cancelled" | "closed";
  acceptedProposal?: Types.ObjectId | IProposal;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProposal {
  _id: Types.ObjectId;
  post: Types.ObjectId | IPost;
  helper: Types.ObjectId | IUser;
  coverMessage: string;
  proposedAmount: number;
  estimatedDeliveryDays: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: Types.ObjectId;
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;
  content: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation {
  _id: Types.ObjectId;
  participants: (Types.ObjectId | IUser)[];
  messages: (Types.ObjectId | IMessage)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: Types.ObjectId;
  post: Types.ObjectId | IPost;
  proposal: Types.ObjectId | IProposal;
  client: Types.ObjectId | IUser;
  helper: Types.ObjectId | IUser;
  agreedAmount: number;
  finalAmount?: number;
  currency: "NPR" | "USD";
  status: "pending_payment" | "active" | "submitted" | "completed" | "cancelled" | "disputed" | "refunded";
  workDeadline: Date;
  submittedAt?: Date;
  completedAt?: Date;
  escrowStatus: "unpaid" | "held" | "released" | "refunded";
  deliverables: {
    url: string;
    publicId: string;
    filename: string;
    submittedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
