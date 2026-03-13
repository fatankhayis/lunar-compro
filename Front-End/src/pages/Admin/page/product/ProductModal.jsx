import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ProductModal = ({ form, setForm, onSubmit, onClose, editIndex }) => {
  const [preview, setPreview] = useState(null);

  // 🔍 Image preview: can be a new file or a URL
  useEffect(() => {
    if (form.image instanceof File) {
      const objectUrl = URL.createObjectURL(form.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof form.image === "string") {
      setPreview(form.image);
    } else {
      setPreview(null);
    }
  }, [form.image]);

  // 🔧 Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 📸 Handle image upload + file size validation (max 10MB)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      setForm({ ...form, image: file });
      setPreview(objectUrl);
    };
    img.onerror = () => {
      toast.error("Failed to read the image!");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  // 💾 Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.description) {
      toast.error("Name and description are required!");
      return;
    }

    const submitData = { ...form };

    // Do not send string URLs to backend
    if (submitData.image && typeof submitData.image === "string") {
      delete submitData.image;
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {editIndex !== null ? "Edit Product" : "Add Product"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="Example: Smart Lamp"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => {
                if (e.target.value.length <= 500) handleChange(e);
              }}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 h-24 resize-none"
              placeholder="Short description about the product"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {form.description.length} / 500
            </div>
          </div>

          {/* Product Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Link
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              placeholder="https://example-product.com"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
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
                className="mt-2 w-[345px] h-[192px] object-cover rounded-lg border border-gray-300 shadow-sm"
              />
            )}
          </div>

          {/* Action Buttons */}
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
              {editIndex !== null ? "Update Product" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
