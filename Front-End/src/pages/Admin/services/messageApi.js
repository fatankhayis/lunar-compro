import axios from 'axios';
import { BASE_URL } from '../../../url';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET all messages (dari inquiries API endpoint)
export const getMessages = async (page = 1, perPage = 10) => {
  try {
    const response = await API.get('/api/inquiries', {
      params: { page, per_page: perPage },
    });
    
    // Handle response yang tidak ada pagination
    const data = response.data.data || response.data;
    
    return {
      data: Array.isArray(data) ? data : [],
      current_page: page,
      last_page: 1,
      per_page: perPage,
    };
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// GET message by ID
export const getMessageById = async (id) => {
  const response = await API.get(`/api/inquiries/${id}`);
  return response.data.data;
};

// DELETE message
export const deleteMessage = async (id) => {
  const response = await API.delete(`/api/inquiries/${id}`);
  return response.data;
};

// UPDATE message status (mark as read)
export const updateMessage = async (id, status) => {
  const response = await API.patch(`/api/inquiries/${id}`, { status });
  return response.data;
};

export default API;
