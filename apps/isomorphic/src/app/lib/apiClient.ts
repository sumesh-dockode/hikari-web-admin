import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Request Interceptor: Attach Token Automatically
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

// 🔹 Response Interceptor: Handle Token Expiry & Errors
apiClient.interceptors.response.use(
  (response) => response, // ✅ Return response if successful
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized, signing out...');
      await signOut(); // Logout user if token is invalid
    }
    return Promise.reject(error);
  }
);

export default apiClient;
