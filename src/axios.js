import config from '@/config/gameConfig';
import axios from 'axios';

const instance = axios.create({
  baseURL: config.axios.baseUrl,
  timeout: 3 * 60 * 1000,
  headers: {
    'Content-Type': 'application/json'
  },
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default instance;