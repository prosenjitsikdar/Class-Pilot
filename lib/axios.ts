import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your actual API base URL
const BASE_URL = 'https://class-pilot-server.vercel.app/api/v1';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Don't send token for login request
      if (config.url !== '/auth/login') {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.log('Error reading token', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response?.status === 401 && error.config?.url !== '/auth/login') {
      // Handle global 401 Unauthorized errors here (e.g., logout user or refresh token)
      console.warn('Unauthorized! Please log in again.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
