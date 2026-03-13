import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";

const CategoryModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/categories");
      const cats = Array.isArray(res.data) ? res.data : res.data.data;
      setCategories(cats || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchCategories();
  }, [isOpen]);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return toast.error("Category name is required!");

    try {
      await API.post("/api/categories", { name: categoryName });
      toast.success("Category added successfully!");
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category!");
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await API.delete(`/api/categories/${id}`);
      toast.success("Category deleted successfully!");
      setCategories((prev) => prev.filter((cat) => cat.category_id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Categories</h2>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="New category name"
            className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
          >
            Add
          </button>
        </form>

        {/* Category List */}
        <div className="mt-6">
          <h3 className="text-gray-800 font-semibold mb-2">Category List</h3>

          {loading ? (
            <div className="flex flex-col gap-2">
              {Array(5).fill().map((_, idx) => (
                <div
                  key={idx}
                  className="h-8 bg-gray-200 rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <li
                  key={cat.category_id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                >
                  <span>{cat.name}</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.category_id)}
                    className="px-2 py-1 text-red-600 font-bold hover:text-red-800 rounded-md"
                  >
                    -
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No categories yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
