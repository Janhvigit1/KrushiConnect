import api from './api';

export const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

export const getOrCreateConversation = async (recipientId) => {
  const response = await api.post('/conversations', { recipientId });
  return response.data;
};

export const getMessages = async (conversationId, page = 1) => {
  const response = await api.get(`/conversations/${conversationId}/messages?page=${page}`);
  return response.data;
};
