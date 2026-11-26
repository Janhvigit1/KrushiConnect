import api from './api';

export const getIceServers = async () => {
  const response = await api.get('/calls/ice-servers');
  return response.data;
};

export const getCallHistory = async () => {
  const response = await api.get('/calls/history');
  return response.data;
};

export const logCall = async (data) => {
  const response = await api.post('/calls/log', data);
  return response.data;
};
