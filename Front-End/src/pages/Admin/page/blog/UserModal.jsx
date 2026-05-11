import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [form, setForm] = useState(initialData);

  useEffect(() => {
    setForm(initialData);
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {isEditing ? 'Edit User' : 'Create New User'}
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Enter user name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Enter email address"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password {isEditing && '(Leave empty to keep current)'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Min 8 chars, uppercase, numbers"
            />
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200 focus:outline-none"
            >
              <option value="blog_author">Blog Author</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-bgtre rounded-md hover:bg-bgfor transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
