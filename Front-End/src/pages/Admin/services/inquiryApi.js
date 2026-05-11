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

// GET all inquiries (dengan support pagination di backend)
export const getInquiries = async (page = 1, perPage = 10) => {
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
    console.error('Error fetching inquiries:', error);
    throw error;
  }
};

// GET inquiry by ID
export const getInquiryById = async (id) => {
  const response = await API.get(`/api/inquiries/${id}`);
  return response.data.data;
};

// DELETE inquiry
export const deleteInquiry = async (id) => {
  const response = await API.delete(`/api/inquiries/${id}`);
  return response.data;
};

// UPDATE inquiry status (mark as read)
export const updateInquiry = async (id, status) => {
  const response = await API.patch(`/api/inquiries/${id}`, { status });
  return response.data;
};

export default API;
