import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // Get session from next-auth

    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiry & Errors
apiClient.interceptors.response.use(
  (response) => response, // ✅ Return response if successful
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized, signing out...');
      toast.error('Unauthorized, signing out...');
      await signOut(); // Logout user if token is invalid
    } else if (error.response?.status === 404) {
      toast.error('Page Not Found');
    } else if (error.response?.status === 400){
      toast.error(error.response.data?.message || 'Bad Request');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
