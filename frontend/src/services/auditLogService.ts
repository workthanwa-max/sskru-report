import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getAuditLogs = (limit: number = 100) => {
  return axios.get(`${API_URL}/audit?limit=${limit}`, getAuthHeaders());
};
