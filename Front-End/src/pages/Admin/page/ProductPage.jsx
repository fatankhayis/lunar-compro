import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";

import { BASE_URL } from "../../../url";
import ProductTable from "./product/ProductTabel";
import ProductModal from "./product/ProductModal";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    link: "",
    image: null,
    order_by: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasShownEmptyToastRef = useRef(false);

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        const mapped = (data || []).map((p) => ({
            id: p.product_id,
            name: p.title,
            description: p.description,
            link: p.link,
            order_by: p.order_by,
            image: p.product_image
              ? `${BASE_URL}/storage/${p.product_image}`
              : null,
          }));
        setProducts(mapped);

        if (!hasShownEmptyToastRef.current && mapped.length === 0) {
          hasShownEmptyToastRef.current = true;
          toast("No products yet. Add a product to see this feature in action.");
        }
      } catch (err) {
        toast.error("Failed to load products!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add / Update product
  const handleSubmit = async (data) => {
    try {
      const submitData = { ...data, order_by: Number(data.order_by) || 0 };

      if (editingId) {
        const updated = await updateProduct(editingId, submitData);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? {
                  id: updated.product_id,
                  name: updated.title,
                  description: updated.description,
                  link: updated.link,
                  order_by: updated.order_by,
                  image: updated.product_image
                    ? `${BASE_URL}/storage/${updated.product_image}`
                    : p.image,
                }
              : p
          )
        );
        toast.success("Product successfully updated!");
      } else {
        const created = await createProduct(submitData);
        setProducts((prev) => [
          ...prev,
          {
            id: created.product_id,
            name: created.title,
            description: created.description,
            link: created.link,
            order_by: created.order_by,
            image: created.product_image
              ? `${BASE_URL}/storage/${created.product_image}`
              : null,
          },
        ]);
        toast.success("Product successfully added!");
      }

      setForm({ name: "", description: "", link: "", image: null, order_by: 0 });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save product!", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const data = await getProductById(id);
      setForm({
        name: data.title,
        description: data.description,
        link: data.link || "",
        image: data.product_image
          ? `${BASE_URL}/storage/${data.product_image}`
          : null,
        order_by: data.order_by,
      });
      setEditingId(id);
      setIsModalOpen(true);
    } catch {
      toast.error("Failed to load product data!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product successfully deleted!");
    } catch {
      toast.error("Failed to delete product!");
    }
  };

  const handleAddNew = () => {
    const nextOrder =
      products.length > 0
        ? Math.max(...products.map((p) => Number(p.order_by) || 0)) + 1
        : 1;

    setForm({ name: "", description: "", link: "", image: null, order_by: nextOrder });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {!loading && products.length === 0 && (
        <p className="text-gray-500 italic">No products yet.</p>
      )}
      {!loading && products.length > 0 && (
        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
          setProducts={setProducts}
        />
      )}

      {isModalOpen && (
        <ProductModal
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

export default ProductPage;
