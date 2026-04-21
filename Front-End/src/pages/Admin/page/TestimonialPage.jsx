import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import TestimonialTable from './Testimonial/TestimonialTable';
import TestimonialModal from './Testimonial/TestimonialModal';
import {
  getTestimonialsList,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../services/api';

const TestimonialPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', testimonial: '', video_url: '' });
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const hasShownEmptyToastRef = useRef(false);

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getTestimonialsList(page);
      const items = res.data?.data || res.data || [];

      if (!hasShownEmptyToastRef.current && items.length === 0) {
        hasShownEmptyToastRef.current = true;
        toast('No testimonials yet. Add a testimonial to see this feature in action.');
      }

      setTestimonials(items.map((t) => ({
        id: t.testimonial_id || t.id,
        name: t.name,
        role: t.role,
        testimonial: t.testimonial,
        video_url: t.video_url || '',
      })));

      setCurrentPage(res.data?.current_page || 1);
      setTotalPages(res.data?.last_page || 1);
      setPerPage(res.data?.per_page || 6);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load testimonials');
      setTestimonials([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage]);

  const handleSubmit = async (formData, id) => {
    if (!formData.name || !formData.role || !formData.testimonial) {
      return toast.error('All fields are required!');
    }

    try {
      setLoading(true);
      if (id) await updateTestimonial(id, formData);
      else await createTestimonial(formData);

      toast.success(id ? 'Testimonial updated successfully' : 'Testimonial added successfully');
      setIsModalOpen(false);
      setForm({ name: '', role: '', testimonial: '', video_url: '' });
      setEditId(null);
      fetchTestimonials(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const t = testimonials.find((item) => item.id === id);
    if (!t) return;
    setForm({ name: t.name, role: t.role, testimonial: t.testimonial, video_url: t.video_url || '' });
    setEditId(t.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const t = testimonials.find((item) => item.id === id);
    if (!t) return;
    if (!window.confirm(`Are you sure you want to delete testimonial from ${t.name}?`)) return;

    try {
      setLoading(true);
      await deleteTestimonial(id);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Testimonial Management</h1>
        <button
          onClick={() => { setForm({ name: '', role: '', testimonial: '', video_url: '' }); setEditId(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-bgtre text-white rounded-md hover:bg-bgfor transition cursor-pointer"
        >
          + Add Testimonial
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}

      {!loading && (
        <>
          {testimonials.length > 0 ? (
            <>
              <TestimonialTable
                testimonials={testimonials}
                onEdit={handleEdit}
                onDelete={handleDelete}
                startIndex={(currentPage - 1) * perPage}
              />

              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-2 rounded ${currentPage === i + 1 ? 'bg-bgtre text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-10">No testimonials yet.</p>
          )}
        </>
      )}

      {isModalOpen && (
        <TestimonialModal
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          editId={editId}
        />
      )}
    </div>
  );
};

export default TestimonialPage;
