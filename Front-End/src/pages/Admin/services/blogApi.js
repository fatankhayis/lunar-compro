import API from './api';
// Get all posts (Super admin: all blogs, Blog author: their own blogs)
export const getAllPosts = async () => {
  try {
    const response = await API.get('/api/posts');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get single post
export const getPost = async (postId) => {
  try {
    const response = await API.get(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new post (multipart)
export const createPost = async (data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt || '');
    formData.append('content', data.content);

    if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image);
    }

    const response = await API.post('/api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update post (multipart)
export const updatePost = async (postId, data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt || '');
    formData.append('content', data.content);

    if (data.cover_image instanceof File) {
      formData.append('cover_image', data.cover_image);
    }

    const response = await API.post(`/api/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Approve post (Super admin only)
export const approvePost = async (postId) => {
  try {
    const response = await API.patch(`/api/posts/${postId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Archive post (Super admin only)
export const archivePost = async (postId) => {
  try {
    const response = await API.patch(`/api/posts/${postId}/archive`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Unarchive post (Super admin only)
export const unarchivePost = async (postId) => {
  try {
    const response = await API.patch(`/api/posts/${postId}/unarchive`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete post
export const deletePost = async (postId) => {
  try {
    const response = await API.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
