import React from 'react';
import toast from 'react-hot-toast';

export default function CrewModal({ form, setForm, onSubmit, onClose, editIndex }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role) return toast.error('Name and Role are required');
    onSubmit(form);
  };

  const previewImage = form.image instanceof File ? URL.createObjectURL(form.image) : form.image;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editIndex !== null && editIndex !== undefined ? 'Edit Crew Member' : 'Add Crew Member'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'title', 'role'].map((field) => (
            <Input
              key={field}
              label={capitalize(field)}
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              placeholder={`${capitalize(field)}`}
            />
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <label className="mt-1 inline-block px-4 py-2 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300">
              Upload Image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
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
              {editIndex !== null && editIndex !== undefined ? 'Update Crew' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input {...props} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
    </div>
  );
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
