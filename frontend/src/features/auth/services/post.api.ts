import api, { ApiResponseData } from "./auth.api";

export const createPost = async (formData: FormData): Promise<ApiResponseData> => {
  try {
    const response = await api.post<ApiResponseData>("/api/v1/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("CREATE POST ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getPosts = async (): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>("/api/v1/posts");
    return response.data;
  } catch (error: any) {
    console.error("GET POSTS ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getPostById = async (postId: string): Promise<ApiResponseData> => {
  try {
    const response = await api.get<ApiResponseData>(`/api/v1/posts/${postId}`);
    return response.data;
  } catch (error: any) {
    console.error("GET POST DETAILS ERROR:", error.response?.data || error.message);
    throw error;
  }
};
