import api from './api';

export const getFeed = async (page = 1, limit = 10) => {
  const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
  return response.data;
};

export const createPost = async (formData) => {
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}/like`);
  return response.data;
};

export const getComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

export const addComment = async (postId, text) => {
  const response = await api.post(`/posts/${postId}/comments`, { text });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};
