import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data;
};

export const toggleUserVerification = async (id) => {
  const response = await api.patch(`/admin/users/${id}/verify`);
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUserByAdmin = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminPosts = async (params = {}) => {
  const response = await api.get('/admin/posts', { params });
  return response.data;
};

export const deletePostByAdmin = async (id) => {
  const response = await api.delete(`/admin/posts/${id}`);
  return response.data;
};

export const getAdminStories = async () => {
  const response = await api.get('/admin/stories');
  return response.data;
};

export const deleteStoryByAdmin = async (id) => {
  const response = await api.delete(`/admin/stories/${id}`);
  return response.data;
};
