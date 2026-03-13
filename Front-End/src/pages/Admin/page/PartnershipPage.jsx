import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PartnershipTable from "./partnership/PartnershipTable";
import PartnershipModal from "./partnership/PartnershipModal";
import CategoryModal from "./partnership/CategoryModal";
import API from "../services/api";
import {
  getCategories,
  createPartnership,
  updatePartnership,
  deletePartnership,
} from "../services/api";

const PartnershipPage = () => {
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category_id: "", image: null });
  const [editId, setEditId] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageInfo, setPageInfo] = useState({
    current_page: 1,
    next_page_url: null,
    prev_page_url: null,
    per_page: 6, // ✅ Default 6 items per page
  });

  // Fetch partners with optional pagination and category filter
  const fetchPartners = async (pageUrl = null, categoryId = selectedCategory) => {
    try {
      setLoading(true);

      let url = pageUrl
        ? `${pageUrl}${pageUrl.includes("?") ? "&" : "?"}${categoryId ? `category_id=${categoryId}` : ""}`
        : `/api/partners?page=1${categoryId ? `&category_id=${categoryId}` : ""}`;

      const res = await API.get(url);
      const data = res.data?.data;
      const list = data?.data || [];

      setPartners(
        list.map((p) => ({
          id: p.partner_id || p.id,
          name: p.name,
          partner_image: p.partner_image,
          category_id: p.category_id,
          category: p.category,
        }))
      );

      setPageInfo({
        current_page: data?.current_page || 1,
        next_page_url: data?.next_page_url,
        prev_page_url: data?.prev_page_url,
        per_page: data?.per_page || 6, // ✅ Ambil dari API atau default 6
      });
    } catch (err) {
      toast.error("Failed to load partnership data");
      console.error(err);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const items = await getCategories();
      setCategories(items);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchPartners(null, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    fetchCategories();
    fetchPartners();
  }, []);

  // CRUD handlers
  const handleSubmit = async (formData) => {
    if (!formData.name || !formData.category_id)
      return toast.error("Name and category are required!");
    if (!editId && !formData.image) return toast.error("Image is required!");

    try {
      setLoading(true);
      if (editId) {
        await updatePartnership(editId, formData);
        toast.success("Partnership successfully updated");
      } else {
        await createPartnership(formData);
        toast.success("Partnership successfully added");
      }
      setIsModalOpen(false);
      setForm({ name: "", category_id: "", image: null });
      setEditId(null);
      fetchPartners();
    } catch (err) {
      toast.error("Failed to save partnership data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner) => {
    setForm({
      name: partner.name,
      category_id: partner.category?.category_id || partner.category_id || "",
      image: partner.partner_image,
    });
    setEditId(partner.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (partner) => {
    if (!window.confirm(`Are you sure you want to delete ${partner.name}?`)) return;
    try {
      setLoading(true);
      await deletePartnership(partner.id);
      toast.success("Partnership successfully deleted");
      fetchPartners();
    } catch (err) {
      toast.error("Failed to delete partnership");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name) => {
    if (!name.trim()) return toast.error("Category name is required!");
    try {
      await API.post("/api/categories", { name });
      toast.success("Category successfully added!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category!");
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await API.delete(`/api/categories/${categoryId}`);
      toast.success("Category successfully deleted!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category!");
    }
  };

  // ✅ Hitung startIndex untuk nomor urut yang berlanjut
  const calculateStartIndex = () => {
    return (pageInfo.current_page - 1) * pageInfo.per_page;
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-800">Partnership Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-4 py-2 bg-bgone text-white rounded-md hover:bg transition cursor-pointer"
          >
            + Add Category
          </button>
          <button
            onClick={() => {
              setForm({ name: "", category_id: "", image: null });
              setEditId(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
          >
            + Add Partnership
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option
                key={cat.id || cat.category_id}
                value={cat.id || cat.category_id}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : partners.length > 0 ? (
        <>
          <PartnershipTable
            partners={partners}
            onEdit={handleEdit}
            onDelete={handleDelete}
            startIndex={calculateStartIndex()} // ✅ Kirim startIndex yang benar
          />

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={!pageInfo.prev_page_url}
              onClick={() => fetchPartners(pageInfo.prev_page_url)}
              className={`px-4 py-2 rounded-md ${
                pageInfo.prev_page_url
                  ? "bg-bgtre text-white hover:bg-bgfor"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {pageInfo.current_page}
            </span>

            <button
              disabled={!pageInfo.next_page_url}
              onClick={() => fetchPartners(pageInfo.next_page_url)}
              className={`px-4 py-2 rounded-md ${
                pageInfo.next_page_url
                  ? "bg-bgtre text-white hover:bg-bgfor"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center py-10">
          No partnerships available.
        </p>
      )}

      {/* Modals */}
      {isModalOpen && (
        <PartnershipModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          editId={editId}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
    </div>
  );
};

export default PartnershipPage;