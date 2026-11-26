import api from './api';

export const getStoriesFeed = async () => {
  const response = await api.get('/stories/feed');
  return response.data;
};

export const createStory = async (formData) => {
  const response = await api.post('/stories', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const markStoryViewed = async (storyId) => {
  const response = await api.post(`/stories/${storyId}/view`);
  return response.data;
};

export const deleteStory = async (storyId) => {
  const response = await api.delete(`/stories/${storyId}`);
  return response.data;
};
