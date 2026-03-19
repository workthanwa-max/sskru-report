const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- Buildings ---
export const getBuildings = async () => {
  const res = await fetch(`${API_URL}/infrastructure/buildings`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch buildings');
  return res.json();
};

export const createBuilding = async (data: { name: string, code: string }) => {
  const res = await fetch(`${API_URL}/infrastructure/buildings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create building');
  return res.json();
};

export const deleteBuilding = async (id: string | number) => {
  const res = await fetch(`${API_URL}/infrastructure/buildings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete building');
  return res.json();
};

// --- Floors ---
export const getFloors = async () => {
  const res = await fetch(`${API_URL}/infrastructure/floors`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch floors');
  return res.json();
};

export const createFloor = async (data: { building_id: string | number, floor_number: string | number }) => {
  const res = await fetch(`${API_URL}/infrastructure/floors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create floor');
  return res.json();
};

// --- Rooms ---
export const getRooms = async () => {
  const res = await fetch(`${API_URL}/infrastructure/rooms`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
};

export const createRoom = async (data: { floor_id: string | number, room_number: string, room_name: string }) => {
  const res = await fetch(`${API_URL}/infrastructure/rooms`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create room');
  return res.json();
};

// --- Categories ---
export const getCategories = async () => {
  const res = await fetch(`${API_URL}/infrastructure/categories`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const createCategory = async (data: { category_name: string }) => {
  const res = await fetch(`${API_URL}/infrastructure/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
};
