import API from './api';
// Get all users (Super admin only)
export const getAllUsers = async () => {
  try {
    const response = await API.get('/api/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new user (Super admin only)
export const createUser = async (data) => {
  try {
    const response = await API.post('/api/users', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update user
export const updateUser = async (userId, data) => {
  try {
    const response = await API.patch(`/api/users/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete user (Super admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await API.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
