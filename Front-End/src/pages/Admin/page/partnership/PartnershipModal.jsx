import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../../../url';
import { getCategories } from '../../services/api';

const PartnershipModal = ({ form, setForm, onSubmit, onClose, editId }) => {
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories dynamically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Generate image preview
  useEffect(() => {
    if (!form.image) return setPreview(null);

    if (form.image instanceof File) {
      const objectUrl = URL.createObjectURL(form.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof form.image === 'string') {
      setPreview(
        form.image.startsWith('http')
          ? form.image
          : `${BASE_URL}/storage/${form.image}`
      );
    }
  }, [form.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Maximum file size is 3MB');
      return;
    }
    setForm({ ...form, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return alert('Name is required!');
    if (!form.category_id) return alert('Category is required!');
    if (!editId && !form.image) return alert('Image is required!');
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editId ? 'Edit Partnership' : 'Add Partnership'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Tech Company Inc."
              className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 cursor-pointer"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Image / Logo</label>
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
                className="mt-3 w-24 h-24 object-contain rounded border border-gray-200"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
            >
              {editId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnershipModal;
