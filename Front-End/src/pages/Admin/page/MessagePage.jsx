import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getMessages, deleteMessage, updateMessage } from '../services/messageApi';
import MessageTable from './hooks/MessageTable';

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const hasShownEmptyToastRef = useRef(false);
  const fetchedRef = useRef(false);

  // Fetch messages
  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      const res = await getMessages(page, perPage);
      
      const items = res.data || [];
      
      if (!hasShownEmptyToastRef.current && items.length === 0) {
        hasShownEmptyToastRef.current = true;
        toast('No messages yet. Messages will appear here when someone sends a request.');
      }

      setMessages(items.map((message) => ({
        inquiry_id: message.inquiry_id || message.id,
        name: message.name,
        email: message.email,
        phone: message.phone || '',
        message: message.message,
        source_url: message.source_url,
        ip_address: message.ip_address,
        status: message.status || 'new',
        created_at: message.created_at,
        updated_at: message.updated_at,
      })));

      setCurrentPage(res.current_page || 1);
      setTotalPages(res.last_page || 1);
      setPerPage(res.per_page || 10);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load messages');
      setMessages([]);
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
    fetchMessages(1);
  }, []);

  // Fetch when page changes
  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  // Delete message
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteMessage(id);
      toast.success('Message deleted successfully');
      fetchMessages(currentPage);
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id) => {
    try {
      setLoading(true);
      await updateMessage(id, 'read');
      toast.success('Marked as read');
      fetchMessages(currentPage);
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
        <h1 className="text-3xl font-bold text-gray-800">Request a Quote Messages</h1>
        <p className="text-gray-600 mt-1">View and manage messages from your website visitors</p>
      </div>

      {loading && messages.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 animate-pulse">Loading messages...</p>
        </div>
      ) : (
        <>
          <MessageTable
            messages={messages}
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
              <strong>{Math.min(currentPage * perPage, messages.length * totalPages)}</strong> of{' '}
              <strong>{totalPages * perPage}</strong> messages
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MessagePage;
