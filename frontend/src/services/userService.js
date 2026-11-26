import api from './api';

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, data) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

export const uploadAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post(`/users/${userId}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
};

export const getFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};
