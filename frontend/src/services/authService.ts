import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:3000/api/auth';

export const authService = {
  login: async (credentials: any) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },
  
  getMe: async () => {
    // Note: The global AuthContext is responsible for injecting the Bearer Token into headers
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },
  
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },
  
  updateUser: async (id: number, data: any) => {
    const response = await axios.put(`${API_URL}/users/${id}`, data);
    return response.data;
  },
  
  deleteUser: async (id: number) => {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  }
};
