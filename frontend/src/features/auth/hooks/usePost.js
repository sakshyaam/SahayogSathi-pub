import { useState } from "react";
import { createPost, getPosts, getPostById } from "../services/post.api.js";

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreatePost = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await createPost(formData);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (postId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPostById(postId);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
