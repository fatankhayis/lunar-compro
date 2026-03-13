import { useState } from 'react';
import API from '../../services/api';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  return {
    categories,
    fetchCategories
  };
};