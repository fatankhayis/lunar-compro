import axios from 'axios';
import { BASE_URL } from '../../../url';

// Buat instance Axios global
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Tambahkan token otomatis di setiap request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======================
// API CRUD CREW
// ======================

// GET semua crew
export const getCrew = async () => {
  const response = await API.get('/api/crews');
  return response.data.data || [];
};

export const getCrewById = async (id) => {
  const response = await API.get(`/api/crews/${id}`);
  return response.data.data;
};

// POST tambah crew
export const createCrew = async (crewData) => {
  const formData = new FormData();
  formData.append('name', crewData.name);
  formData.append('title', crewData.title || '');
  formData.append('role', crewData.role || '');
  formData.append('order_by', Number(crewData.order_by) || 0);

  if (crewData.image instanceof File) {
    formData.append('crew_image', crewData.image);
  }

  const response = await API.post('/api/crews', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};

// PUT update crew
export const updateCrew = async (id, crewData) => {
  // kalau cuma update order_by (drag & drop)
  if (Object.keys(crewData).length === 1 && crewData.order_by !== undefined) {
    const response = await API.post(`/api/crews/${id}`, crewData);
    return response.data.data;
  }

  // kalau update dari modal (nama, role, gambar, dll)
  const formData = new FormData();
  formData.append('name', crewData.name);
  formData.append('title', crewData.title || '');
  formData.append('role', crewData.role || '');
  formData.append('order_by', Number(crewData.order_by) || 0);

  if (crewData.image instanceof File) {
    formData.append('crew_image', crewData.image);
  }

  const response = await API.post(`/api/crews/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};

// DELETE crew
export const deleteCrew = async (id) => {
  const response = await API.delete(`/api/crews/${id}`);
  return response.data;
};

// ======================
// API CRUD PRODUCT
// ======================

// ✅ GET semua product
export const getProducts = async () => {
  const response = await API.get("/api/products");
  return response.data.data || [];
};

// ✅ GET product by ID
export const getProductById = async (id) => {
  const response = await API.get(`/api/products/${id}`);
  return response.data.data;
};

// ✅ CREATE product baru
export const createProduct = async (productData) => {
  const formData = new FormData();
  formData.append("title", productData.name);
  formData.append("description", productData.description || "");
  formData.append("order_by", Number(productData.order_by) || 0);
  formData.append("link", productData.link || "");

  if (productData.image instanceof File) {
    formData.append("product_image", productData.image);
  }

  const response = await API.post("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data;
};

// ✅ UPDATE product
export const updateProduct = async (id, productData) => {
  // Kalau hanya update urutan
  if (Object.keys(productData).length === 1 && productData.order_by !== undefined) {
    const response = await API.post(`/api/products/${id}`, productData);
    return response.data.data;
  }

  const formData = new FormData();
  formData.append("title", productData.name);
  formData.append("description", productData.description || "");
  formData.append("order_by", Number(productData.order_by) || 0);
  formData.append("link", productData.link || "");

  if (productData.image instanceof File) {
    formData.append("product_image", productData.image);
  }

  // Laravel biasanya pakai method spoofing untuk PUT/PATCH
  formData.append("_method", "POST");

  const response = await API.post(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.data;
};

// ✅ DELETE product
export const deleteProduct = async (id) => {
  const response = await API.delete(`/api/products/${id}`);
  return response.data;
};


  // ======================
  // API CRUD PROJECT
  // ======================

  // GET semua project
  export const getProjects = async () => {
    const response = await API.get('/api/projects');
    return response.data.data || [];
  };
  export const getProjectsOrder = async () => {
    const response = await API.get('/api/projects/order');
    return response.data.data || [];
  };

  // GET project by ID (untuk edit)
  export const getProjectById = async (id) => {
    const response = await API.get(`/api/projects/${id}`);
    return response.data.data;
  };

  // POST tambah project
  export const createProject = async (projectData) => {
    const formData = new FormData();
    formData.append('title', projectData.name);
    formData.append('description', projectData.description || '');
    formData.append('link', projectData.link || '');
    formData.append('order_by', Number(projectData.order_by) || 0);

    if (projectData.image instanceof File) {
      formData.append('project_image', projectData.image);
    }

    const response = await API.post('/api/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data;
  };

  // PUT update project
  export const updateProject = async (id, projectData) => {
    if (Object.keys(projectData).length === 1 && projectData.order_by !== undefined) {
      const response = await API.post(`/api/projects/${id}`, projectData);
      return response.data.data;
    }

    const formData = new FormData();
    formData.append('title', projectData.name);
    formData.append('description', projectData.description || '');
    formData.append('link', projectData.link || '');
    formData.append('order_by', Number(projectData.order_by) || 0);

    if (projectData.image instanceof File) {
      formData.append('project_image', projectData.image);
    }

    formData.append('_method', 'POST');

    const response = await API.post(`/api/projects/${id}`, formData);
    return response.data.data;
  };

  // DELETE project
  export const deleteProject = async (id) => {
    const response = await API.delete(`/api/projects/${id}`);
    return response.data;
  };

// ======================
// API CRUD PARTNERSHIP
// ======================
// ✅ Ambil kategori
export const getCategories = async () => {
  const response = await API.get('/api/categories');
  return response.data.data;
};

// ✅ Ambil semua partnership (dengan filter kategori opsional)
export const getPartnerships = async (categoryId = null) => {
  let url = '/api/partners';
  if (categoryId) url += `?category_id=${categoryId}`; // 🔹 filter kategori jika ada

  const response = await API.get(url);
  return response.data.data;
};

// ✅ Tambah partnership
export const createPartnership = async (partnerData) => {
  const formData = new FormData();
  formData.append('name', partnerData.name);
  formData.append('category_id', partnerData.category_id);

  if (partnerData.image instanceof File) {
    formData.append('partner_image', partnerData.image);
  }

  const response = await API.post('/api/partners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};

// ✅ Update partnership
export const updatePartnership = async (id, partnerData) => {
  const formData = new FormData();
  formData.append('name', partnerData.name);
  formData.append('category_id', partnerData.category_id);

  if (partnerData.image instanceof File) {
    formData.append('partner_image', partnerData.image);
  }

  formData.append('_method', 'POST');

  const response = await API.post(`/api/partners/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.data;
};

// ✅ Hapus partnership
export const deletePartnership = async (id) => {
  const response = await API.delete(`/api/partners/${id}`);
  return response.data;
};
// ======================
// API CRUD TESTIMONIAL - FIXED VERSION
// ======================

// GET semua testimonial untuk frontend
export const getTestimonials = async () => {
  try {
    const response = await API.get('/api/testimonials');
    console.log('📦 Raw API Response:', response.data); // Debug
    
    // Cek berbagai kemungkinan struktur response
    const data = 
      response.data?.data || 
      response.data?.testimonials || 
      response.data || 
      [];
    
    console.log('📋 Processed Testimonials:', data); // Debug
    
    // Validasi dan transform data
    return Array.isArray(data) ? data.map(item => ({
      testimonial_id: item.testimonial_id || item.id,
      name: item.name || 'Anonymous',
      role: item.role || 'Client',
      testimonial: item.testimonial || '',
      video_url: item.video_url || null,
      avatar: item.avatar || null,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) : [];
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    return [];
  }
};

// GET semua testimonial (list versi admin) dengan pagination
export const getTestimonialsList = async (page = 1, perPage = 10) => {
  try {
    const response = await API.get(`/api/testimonials?page=${page}&per_page=${perPage}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching testimonials list:', error);
    return {
      data: [],
      meta: { current_page: 1, total: 0 }
    };
  }
};

// GET testimonial by ID
export const getTestimonialById = async (id) => {
  try {
    const response = await API.get(`/api/testimonials/${id}`);
    
    const data = 
      response.data?.data || 
      response.data?.testimonial || 
      response.data || 
      null;
    
    if (data) {
      return {
        testimonial_id: data.testimonial_id || data.id,
        name: data.name,
        role: data.role,
        testimonial: data.testimonial,
        video_url: data.video_url,
        avatar: data.avatar,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    }
    return null;
  } catch (error) {
    console.error(`❌ Error fetching testimonial ${id}:`, error);
    return null;
  }
};

// CREATE testimonial
export const createTestimonial = async (testimonialData) => {
  try {
    // Format data untuk upload
    const formData = new FormData();
    formData.append('name', testimonialData.name);
    formData.append('role', testimonialData.role);
    formData.append('testimonial', testimonialData.testimonial);
    
    if (testimonialData.video_url) {
      formData.append('video_url', testimonialData.video_url);
    }
    
    // Jika ada file avatar
    if (testimonialData.avatar && testimonialData.avatar instanceof File) {
      formData.append('avatar', testimonialData.avatar);
    }

    const response = await API.post('/api/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    throw error;
  }
};

// UPDATE testimonial - FIXED METHOD
export const updateTestimonial = async (id, testimonialData) => {
  try {
    // Gunakan PUT method yang benar
    const formData = new FormData();
    formData.append('name', testimonialData.name);
    formData.append('role', testimonialData.role);
    formData.append('testimonial', testimonialData.testimonial);
    
    if (testimonialData.video_url) {
      formData.append('video_url', testimonialData.video_url);
    }
    
    // Jika ada file avatar baru
    if (testimonialData.avatar && testimonialData.avatar instanceof File) {
      formData.append('avatar', testimonialData.avatar);
    }
    
    formData.append('_method', 'PUT'); // ✅ Correct method

    const response = await API.post(`/api/testimonials/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data || response.data;
  } catch (error) {
    console.error(`❌ Error updating testimonial ${id}:`, error);
    throw error;
  }
};

// DELETE testimonial
export const deleteTestimonial = async (id) => {
  try {
    const response = await API.delete(`/api/testimonials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error deleting testimonial ${id}:`, error);
    throw error;
  }
};

// Upload video testimonial (jika terpisah)
export const uploadTestimonialVideo = async (id, videoFile) => {
  try {
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('_method', 'PUT');

    const response = await API.post(`/api/testimonials/${id}/video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`❌ Error uploading video for testimonial ${id}:`, error);
    throw error;
  }
};

// ======================
// API BLOG POSTS
// ======================

// Public: list published posts
export const getPublicPosts = async () => {
  const response = await API.get('/api/posts/public');
  return response.data.data || [];
};

// Public: list published posts (paginated)
export const getPublicPostsPage = async (page = 1, perPage = 9) => {
  const response = await API.get('/api/posts/public', {
    params: {
      page,
      per_page: perPage,
    },
  });

  return {
    data: response.data.data || [],
    meta: response.data.meta || {
      current_page: page,
      last_page: 1,
      per_page: perPage,
      total: (response.data.data || []).length,
    },
  };
};

// Public: post detail by slug
export const getPostBySlug = async (slug) => {
  const response = await API.get(`/api/posts/slug/${slug}`);
  return response.data.data;
};

// Admin: list all posts
export const getPosts = async () => {
  const response = await API.get('/api/posts');
  return response.data.data || [];
};

export const getPostById = async (id) => {
  const response = await API.get(`/api/posts/${id}`);
  return response.data.data;
};

export const createPost = async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('excerpt', postData.excerpt || '');
  formData.append('content', postData.content);
  formData.append('is_published', postData.is_published ? '1' : '0');

  if (postData.published_at) {
    formData.append('published_at', postData.published_at);
  }

  if (postData.cover_image instanceof File) {
    formData.append('cover_image', postData.cover_image);
  }

  const response = await API.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const updatePost = async (id, postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('excerpt', postData.excerpt || '');
  formData.append('content', postData.content);
  formData.append('is_published', postData.is_published ? '1' : '0');

  if (postData.published_at) {
    formData.append('published_at', postData.published_at);
  }

  if (postData.cover_image instanceof File) {
    formData.append('cover_image', postData.cover_image);
  }

  const response = await API.post(`/api/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deletePost = async (id) => {
  const response = await API.delete(`/api/posts/${id}`);
  return response.data;
};

// ======================
// API INQUIRIES (LEAD CAPTURE)
// ======================

export const createInquiry = async (payload) => {
  const response = await API.post('/api/inquiries', payload);
  return response.data;
};

export const getInquiries = async () => {
  const response = await API.get('/api/inquiries');
  return response.data.data || [];
};


export default API;
