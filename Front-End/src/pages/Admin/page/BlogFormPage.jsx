import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../../url';
import { getPost, createPost, updatePost } from '../services/blogApi';
import { ArrowLeft } from 'lucide-react';

export default function BlogFormPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: null, // File | string | null
  });
  const [currentPost, setCurrentPost] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Fetch post if editing
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await getPost(postId);
      const post = response.data;
      setCurrentPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_image: post.cover_image,
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load blog');
      navigate('/admin/blogs');
    }
  };

  useEffect(() => {
    if (formData.cover_image instanceof File) {
      const objectUrl = URL.createObjectURL(formData.cover_image);
      setCoverPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof formData.cover_image === 'string' && formData.cover_image) {
      setCoverPreview(`${BASE_URL}/storage/${formData.cover_image}`);
      return;
    }

    setCoverPreview(null);
  }, [formData.cover_image]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFormData({ ...formData, cover_image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image,
      };

      if (currentPost) {
        await updatePost(currentPost.post_id, payload);
        toast.success('Blog updated successfully (pending approval)');
      } else {
        await createPost(payload);
        toast.success('Blog created successfully (pending approval)');
      }

      setTimeout(() => {
        navigate(-1); // Go back to where they came from
      }, 1000);
    } catch (error) {
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentPost ? 'Edit Blog' : 'Create New Blog'}
            </h1>
            {currentPost && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentPost.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {currentPost.status === 'pending_approval' ? 'Pending Approval' : currentPost.status}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="Brief description (optional)"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
                placeholder="Blog content"
                required
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image</label>
              {coverPreview && (
                <div className="mb-4">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="max-w-xs h-auto rounded-md border border-gray-200 shadow-sm"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-md file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-bgtre file:text-white 
                  hover:file:bg-bgfor cursor-pointer border border-gray-300 rounded-md p-1"
              />
            </div>

            {!currentPost && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <span className="text-lg">ℹ️</span>
                  Your blog will be submitted for super admin approval before publishing.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm text-white rounded-md transition cursor-pointer flex items-center justify-center min-w-[100px] ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-bgtre hover:bg-bgfor'
                }`}
              >
                {loading ? 'Saving...' : currentPost ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
