import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const BlogModal = ({ form, setForm, onSubmit, onClose, editIndex }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (form.cover_image instanceof File) {
      const objectUrl = URL.createObjectURL(form.cover_image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    if (typeof form.cover_image === 'string') {
      setPreview(form.cover_image);
      return;
    }
    setPreview(null);
  }, [form.cover_image]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setForm({ ...form, cover_image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      toast.error('Title and content are required!');
      return;
    }

    const submitData = { ...form };
    if (submitData.cover_image && typeof submitData.cover_image === 'string') {
      delete submitData.cover_image;
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editIndex ? 'Edit Post' : 'Add Post'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Excerpt (optional)</label>
            <input
              type="text"
              name="excerpt"
              value={form.excerpt}
              onChange={(e) => {
                if (e.target.value.length <= 255) handleChange(e);
              }}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Short summary"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {form.excerpt.length} / 255
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 h-40 resize-none"
              placeholder="Write the post content"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Image (optional)</label>
              <label className="inline-block mt-1 px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-full h-[160px] object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mt-6 md:mt-0">
                <input
                  id="is_published"
                  type="checkbox"
                  name="is_published"
                  checked={!!form.is_published}
                  onChange={handleChange}
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Publish
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Published At (optional)</label>
                <input
                  type="datetime-local"
                  name="published_at"
                  value={form.published_at}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
            >
              {editIndex ? 'Update Post' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogModal;
