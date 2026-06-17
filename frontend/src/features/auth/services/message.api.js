import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const sendMessage = async (receiverId, content) => {
  try {
    const response = await api.post(`/api/v1/messages/send/${receiverId}`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (receiverId) => {
  try {
    const response = await api.get(`/api/v1/messages/${receiverId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getConversationUsers = async () => {
  try {
    const response = await api.get("/api/v1/messages/conversations/users");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
