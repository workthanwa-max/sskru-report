import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/dispatch` : 'http://localhost:3000/api/dispatch';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const getPendingTickets = () => {
  return axios.get(`${API_URL}/tickets/pending`, getAuthHeaders());
};

export const getAvailableTechnicians = () => {
  return axios.get(`${API_URL}/technicians`, getAuthHeaders());
};

export const assignTicket = (ticketId: number, technicianId: number) => {
  return axios.patch(`${API_URL}/tickets/${ticketId}/assign`, { technician_id: technicianId }, getAuthHeaders());
};

export const getReviewTickets = () => {
  return axios.get(`${API_URL}/tickets/review`, getAuthHeaders());
};

export const approveTicket = (ticketId: number) => {
  return axios.patch(`${API_URL}/tickets/${ticketId}/approve`, {}, getAuthHeaders());
};

export const rejectTicket = (ticketId: number, reason: string) => {
  return axios.patch(`${API_URL}/tickets/${ticketId}/reject`, { reason }, getAuthHeaders());
};

export const getHistoryTickets = () => {
  return axios.get(`${API_URL}/tickets/history`, getAuthHeaders());
};

export const getTechnicianDetails = (id: number) => {
  return axios.get(`${API_URL}/technicians/${id}/details`, getAuthHeaders());
};

export const getTechnicianWorkHistory = (id: number) => {
  return axios.get(`${API_URL}/technicians/${id}/history`, getAuthHeaders());
};
