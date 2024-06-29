import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/posts`;

export const getHomePosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/all-post`);
    return response.data.data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}`);
    return response.data.data.post;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

export const getPostsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user-posts/${userId}`);
    return response.data.data.posts;
  } catch (error) {
    console.error(`Error fetching posts for user ID ${userId}:`, error);
    throw error;
  }
};

export const deletePostById = async (postId) => {
  try {
    await axios.delete(`${API_URL}/${postId}`);
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    throw error;
  }
};
