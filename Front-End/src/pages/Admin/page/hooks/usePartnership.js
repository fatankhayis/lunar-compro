import { useState } from 'react';
import toast from 'react-hot-toast';
import API from '../../services/api';

export const usePartnership = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchPartners = async (page = 1, categoryFilter = '') => {
    try {
      setLoading(true);
      let url = `/api/partners?page=${page}`;
      if (categoryFilter) {
        url += `&category_id=${categoryFilter}`;
      }

      const res = await API.get(url);
      const items = res.data?.data || res.data || [];

      setPartners(
        items.map((p) => ({
          id: p.partner_id || p.id,
          name: p.name,
          partner_image: p.partner_image,
          category_id: p.category_id,
          category: p.category,
        }))
      );

      setCurrentPage(res.data?.current_page || res.current_page || page);
      setTotalPages(res.data?.last_page || res.last_page || 1);
      setPerPage(res.data?.per_page || res.per_page || 6);
    } catch (err) {
      toast.error('Failed to load partnership data');
      console.error(err);
      setPartners([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchPartners(page, selectedCategory);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    fetchPartners(1, categoryId);
  };

  const handleClearFilter = () => {
    setSelectedCategory('');
    setCurrentPage(1);
    fetchPartners(1);
  };

  return {
    partners,
    loading,
    currentPage,
    totalPages,
    perPage,
    selectedCategory,
    fetchPartners,
    handlePageChange,
    handleCategoryFilter,
    handleClearFilter
  };
};