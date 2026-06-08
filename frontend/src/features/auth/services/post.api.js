import api from "./auth.api";

export const createPost = async (formData) => {
  try {
    const response = await api.post("/api/v1/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("CREATE POST ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getPosts = async () => {
    try {
      const response = await api.get("/api/v1/posts");
      return response.data;
    } catch (error) {
      console.error("GET POSTS ERROR:", error.response?.data || error.message);
      throw error;
    }
  };

  export const getPostById = async (postId) => {
    try {
      const response = await api.get(`/api/v1/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error("GET POST DETAILS ERROR:", error.response?.data || error.message);
      throw error;
    }
  };
