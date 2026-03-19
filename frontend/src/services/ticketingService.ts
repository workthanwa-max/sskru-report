import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/tickets` : 'http://localhost:3000/api/tickets';

export const ticketingService = {
  createTicket: async (ticketData: any) => {
    const response = await axios.post(`${API_URL}`, ticketData);
    return response.data;
  },
  getMyTickets: async () => {
    const response = await axios.get(`${API_URL}/my`);
    return response.data;
  }
};
