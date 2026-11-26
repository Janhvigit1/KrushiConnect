import api from './api';

export const askAiAssistant = async (question, language = 'hi') => {
  const response = await api.post('/ai/chat', { question, language });
  return response.data;
};

export const getAiSuggestions = async () => {
  const response = await api.get('/ai/suggestions');
  return response.data;
};
