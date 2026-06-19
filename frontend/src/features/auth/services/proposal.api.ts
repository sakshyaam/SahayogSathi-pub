import api, { ApiResponseData } from "./auth.api";

export interface ProposalData {
  coverMessage: string;
  proposedAmount: number;
  estimatedDeliveryDays: number;
}

export const createProposal = async (postId: string, proposalData: ProposalData): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>(`/api/v1/proposals/post/${postId}`, proposalData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getPostProposals = async (postId: string): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>(`/api/v1/proposals/post/${postId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const acceptProposal = async (proposalId: string): Promise<ApiResponseData> => {
  try {
    const response = await api.patch<ApiResponseData>(`/api/v1/proposals/accept/${proposalId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getMyProposals = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>("/api/v1/proposals/my");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
