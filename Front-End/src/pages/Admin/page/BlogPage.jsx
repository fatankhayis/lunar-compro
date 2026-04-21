import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../../url';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/api';
import BlogTable from './blog/BlogTable';
import BlogModal from './blog/BlogModal';

const BlogAdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: null,
    is_published: true,
    published_at: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasShownEmptyToastRef = useRef(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        const mapped = (data || []).map((p) => ({
            id: p.post_id,
            title: p.title,
            slug: p.slug,
            excerpt: p.excerpt,
            content: p.content,
            is_published: !!p.is_published,
            published_at: p.published_at,
            cover_image: p.cover_image ? `${BASE_URL}/storage/${p.cover_image}` : null,
            updated_at: p.updated_at,
          }));

        setPosts(mapped);

        if (!hasShownEmptyToastRef.current && mapped.length === 0) {
          hasShownEmptyToastRef.current = true;
          toast('No posts yet. Add a post to see this feature in action.');
        }
      } catch (e) {
        toast.error('Failed to load posts!');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleAddNew = () => {
    setForm({
      title: '',
      excerpt: '',
      content: '',
      cover_image: null,
      is_published: true,
      published_at: '',
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = async (id) => {
    try {
      const p = await getPostById(id);
      setForm({
        title: p.title,
        excerpt: p.excerpt || '',
        content: p.content || '',
        cover_image: p.cover_image ? `${BASE_URL}/storage/${p.cover_image}` : null,
        is_published: !!p.is_published,
        published_at: p.published_at ? String(p.published_at).slice(0, 16) : '',
      });
      setEditingId(id);
      setIsModalOpen(true);
    } catch (e) {
      toast.error('Failed to load post data!');
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Post deleted successfully!');
    } catch (e) {
      toast.error('Failed to delete post!');
      console.error(e);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        published_at: data.published_at || '',
      };

      if (editingId) {
        const updated = await updatePost(editingId, submitData);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  id: updated.post_id,
                  title: updated.title,
                  slug: updated.slug,
                  excerpt: updated.excerpt,
                  content: updated.content,
                  is_published: !!updated.is_published,
                  published_at: updated.published_at,
                  cover_image: updated.cover_image
                    ? `${BASE_URL}/storage/${updated.cover_image}`
                    : p.cover_image,
                  updated_at: updated.updated_at,
                }
              : p
          )
        );
        toast.success('Post updated successfully!');
      } else {
        const created = await createPost(submitData);
        setPosts((prev) => [
          {
            id: created.post_id,
            title: created.title,
            slug: created.slug,
            excerpt: created.excerpt,
            content: created.content,
            is_published: !!created.is_published,
            published_at: created.published_at,
            cover_image: created.cover_image ? `${BASE_URL}/storage/${created.cover_image}` : null,
            updated_at: created.updated_at,
          },
          ...prev,
        ]);
        toast.success('Post created successfully!');
      }

      setIsModalOpen(false);
      setEditingId(null);
      setForm({
        title: '',
        excerpt: '',
        content: '',
        cover_image: null,
        is_published: true,
        published_at: '',
      });
    } catch (e) {
      toast.error('Failed to save post!');
      console.error(e);
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Add Post
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-gray-500 italic">No posts yet.</p>
      )}
      {!loading && posts.length > 0 && (
        <BlogTable posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <BlogModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          editIndex={editingId}
        />
      )}
    </div>
  );
};

export default BlogAdminPage;
