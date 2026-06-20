import { useState } from "react";
import { createPost, getPosts, getPostById } from "../services/post.api";

export const usePost = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = async (formData: FormData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createPost(formData);
      return data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "An error occurred";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      return data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "An error occurred";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (postId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPostById(postId);
      return data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "An error occurred";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreatePost,
    fetchPosts,
    fetchPostById,
    loading,
    error,
  };
};
