import api from './api';

export const discoverFarmers = async (query = '', crop = '') => {
  let url = '/discover?';
  if (query) url += `query=${encodeURIComponent(query)}&`;
  if (crop) url += `crop=${encodeURIComponent(crop)}&`;
  const response = await api.get(url);
  return response.data;
};

export const discoverNearby = async (lat, lon, radius = 25) => {
  let url = `/discover/nearby?radius=${radius}&`;
  if (lat !== undefined && lon !== undefined) {
    url += `lat=${lat}&lon=${lon}`;
  }
  const response = await api.get(url);
  return response.data;
};
