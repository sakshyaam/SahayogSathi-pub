import api, { ApiResponseData } from "./auth.api";

export const sendMessage = async (receiverId: string, content: string): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>(`/api/v1/messages/send/${receiverId}`, { content });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (receiverId: string): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>(`/api/v1/messages/${receiverId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getConversationUsers = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>("/api/v1/messages/conversations/users");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
