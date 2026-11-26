import api from './api';

export const registerFarmer = async (formData) => {
  const response = await api.post('/auth/register', formData);
  return response.data;
};

export const loginFarmer = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateLanguagePreference = async (language) => {
  const response = await api.put('/auth/language', { language });
  return response.data;
};
