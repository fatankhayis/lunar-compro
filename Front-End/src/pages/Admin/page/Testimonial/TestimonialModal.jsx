import React from 'react';

const TestimonialModal = ({ form, setForm, onSubmit, onClose, editId }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role || !form.testimonial) {
      alert('All fields are required!');
      return;
    }
    onSubmit(form, editId);
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
          {editId ? 'Edit Testimonial' : 'Add Testimonial'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="CEO, Example Company"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Testimonial</label>
            <textarea
              name="testimonial"
              value={form.testimonial}
              onChange={handleChange}
              placeholder="Write testimonial..."
              rows={4}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Video URL</label>
            <input
              type="text"
              name="video_url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://example.com/video.mp4"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>

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

export default TestimonialModal;
