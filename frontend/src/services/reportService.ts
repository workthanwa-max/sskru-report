const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getDashboardSummary = async () => {
  const res = await fetch(`${API_URL}/reports/dashboard-summary`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_URL}/reports/stats`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch reports stats');
  return res.json();
};
