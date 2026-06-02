import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export const register = async ({fullname, username, email, password }) => {
  try {
    const response = await api.post("/api/v1/users/register", {
      fullname,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/api/v1/users/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/api/v1/users/logout");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default api;