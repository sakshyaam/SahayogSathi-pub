import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const createProposal = async (postId, proposalData) => {
  try {
    const response = await api.post(`/api/v1/proposals/post/${postId}`, proposalData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPostProposals = async (postId) => {
  try {
    const response = await api.get(`/api/v1/proposals/post/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const acceptProposal = async (proposalId) => {
  try {
    const response = await api.patch(`/api/v1/proposals/accept/${proposalId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMyProposals = async () => {
  try {
    const response = await api.get("/api/v1/proposals/my");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
