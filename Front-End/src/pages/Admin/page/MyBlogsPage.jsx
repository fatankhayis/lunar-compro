import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MyBlogTable from './blog/MyBlogTable';
import API from '../services/api';
import { deletePost } from '../services/blogApi';

const MyBlogsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [pageInfo, setPageInfo] = useState({
    current_page: 1,
    next_page_url: null,
    prev_page_url: null,
    per_page: 10,
  });

  const hasShownEmptyToastRef = useRef(false);

  const fetchPosts = async (pageUrl = null, statusFilter = filter) => {
    try {
      setLoading(true);

      let url = pageUrl
        ? `${pageUrl}${pageUrl.includes('?') ? '&' : '?'}per_page=10${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`
        : `/api/posts?page=1&per_page=10${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`;

      const res = await API.get(url);
      const data = res.data?.data;
      const list = data?.data || [];

      if (!hasShownEmptyToastRef.current && list.length === 0) {
        hasShownEmptyToastRef.current = true;
        toast('No blogs yet. Click "+ Create Blog" to write your first post.');
      }

      setPosts(
        list.map((p) => ({
          post_id: p.post_id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          author: p.author,
          created_at: p.created_at,
          cover_image: p.cover_image,
        }))
      );

      setPageInfo({
        current_page: data?.current_page || 1,
        next_page_url: data?.next_page_url,
        prev_page_url: data?.prev_page_url,
        per_page: data?.per_page || 10,
      });
    } catch (err) {
      toast.error('Failed to load blog data');
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      await deletePost(postId);
      toast.success('Blog deleted successfully');
      fetchPosts(null, filter);
    } catch (err) {
      const errorMsg = err?.message || err?.error || 'Failed to delete blog';
      toast.error(errorMsg);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    hasShownEmptyToastRef.current = false;
    fetchPosts(null, newFilter);
  };

  const calculateStartIndex = () => {
    return (pageInfo.current_page - 1) * pageInfo.per_page;
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Blogs</h1>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'Archived', value: 'archived' },
              { label: 'Pending Approval', value: 'pending_approval' },
              { label: 'Published', value: 'published' },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => handleFilterChange(btn.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === btn.value
                    ? 'bg-bgtre text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/blogs/create')}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer shrink-0"
        >
          + Create Blog
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : posts.length > 0 ? (
        <>
          <MyBlogTable
            blogs={posts}
            onDelete={handleDelete}
            startIndex={calculateStartIndex()}
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={!pageInfo.prev_page_url}
              onClick={() => fetchPosts(pageInfo.prev_page_url, filter)}
              className={`px-4 py-2 rounded-md ${
                pageInfo.prev_page_url
                  ? 'bg-bgtre text-white hover:bg-bgfor'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {pageInfo.current_page}
            </span>

            <button
              disabled={!pageInfo.next_page_url}
              onClick={() => fetchPosts(pageInfo.next_page_url, filter)}
              className={`px-4 py-2 rounded-md ${
                pageInfo.next_page_url
                  ? 'bg-bgtre text-white hover:bg-bgfor'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <p>No blogs available.</p>
        </div>
      )}
    </div>
  );
};

export default MyBlogsPage;
