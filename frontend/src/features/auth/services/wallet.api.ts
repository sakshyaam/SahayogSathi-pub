import api, { ApiResponseData } from "./auth.api";

export const getWalletDetails = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>("/api/v1/payments/wallet");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getTransactionHistory = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>("/api/v1/payments/transactions");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const initiateTopUp = async (amount: number, gateway: string): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>("/api/v1/payments/topup/initiate", { amount, gateway });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const verifyTopUp = async (amount: number, transactionId: string, gateway: string): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>("/api/v1/payments/topup/verify", { amount, transactionId, gateway });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const lockEscrow = async (orderId: string): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>(`/api/v1/payments/${orderId}/lock`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
