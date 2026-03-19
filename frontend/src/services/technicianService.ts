import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getAssignedTickets = () => {
  return axios.get(`${API_URL}/technician/tickets/assigned`, getAuthHeaders());
};

export const getTicketHistory = () => {
  return axios.get(`${API_URL}/technician/tickets/history`, getAuthHeaders());
};

export const startTicket = (ticketId: number) => {
  return axios.patch(`${API_URL}/technician/tickets/${ticketId}/start`, {}, getAuthHeaders());
};

export const submitTicket = (ticketId: number, payload: { notes: string; image_after?: string }) => {
  return axios.post(`${API_URL}/technician/tickets/${ticketId}/submit`, payload, getAuthHeaders());
};
