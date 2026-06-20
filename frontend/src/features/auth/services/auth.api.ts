import axios, { AxiosInstance } from "axios";

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterCredentials {
  fullname?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data: T;
}

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const register = async ({ fullname, username, email, password }: RegisterCredentials): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>("/api/v1/users/register", {
      fullname,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const login = async ({ email, password }: LoginCredentials): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>("/api/v1/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>("/api/v1/users/logout");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getMe = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>("/api/v1/users/me");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default api;
