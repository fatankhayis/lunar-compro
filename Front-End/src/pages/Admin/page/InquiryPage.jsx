import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getInquiries, deleteInquiry, updateInquiry } from '../services/inquiryApi';
import InquiryTable from './hooks/InquiryTable';

const InquiryPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const hasShownEmptyToastRef = useRef(false);
  const fetchedRef = useRef(false);

  // Fetch inquiries
  const fetchInquiries = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getInquiries(page, perPage);
      
      const items = res.data || [];
      
      if (!hasShownEmptyToastRef.current && items.length === 0) {
        hasShownEmptyToastRef.current = true;
        toast('No inquiries yet. Inquiries will appear here when someone sends a message.');
      }

      setInquiries(items.map((inquiry) => ({
        inquiry_id: inquiry.inquiry_id || inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || '',
        message: inquiry.message,
        source_url: inquiry.source_url,
        ip_address: inquiry.ip_address,
        status: inquiry.status || 'new',
        created_at: inquiry.created_at,
        updated_at: inquiry.updated_at,
      })));

      setCurrentPage(res.current_page || 1);
      setTotalPages(res.last_page || 1);
      setPerPage(res.per_page || 10);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load inquiries');
      setInquiries([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchInquiries(1);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage]);

  // Delete inquiry
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteInquiry(id);
      toast.success('Inquiry deleted successfully');
      fetchInquiries(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete inquiry');
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      setLoading(true);
      await updateInquiry(id, 'read');
      toast.success('Marked as read');
      fetchInquiries(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark as read');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
        <p className="text-gray-600 mt-1">View and manage inquiries from your website visitors</p>
      </div>

      {loading && inquiries.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 animate-pulse">Loading inquiries...</p>
        </div>
      ) : (
        <>
          <InquiryTable
            inquiries={inquiries}
            onDelete={handleDelete}
            onMarkAsRead={handleMarkAsRead}
            loading={loading}
            startIndex={(currentPage - 1) * perPage}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded transition ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              Showing <strong>{(currentPage - 1) * perPage + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * perPage, inquiries.length * totalPages)}</strong> of{' '}
              <strong>{totalPages * perPage}</strong> inquiries
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default InquiryPage;
