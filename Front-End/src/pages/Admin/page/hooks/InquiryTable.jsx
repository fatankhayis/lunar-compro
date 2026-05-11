import React from 'react';
import { Mail, Trash2, BookmarkedIcon } from 'lucide-react';

const InquiryTable = ({ inquiries, onDelete, onMarkAsRead, loading, startIndex = 0 }) => {
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete inquiry from ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md border border-gray-200 p-3">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {['No', 'Name', 'Email', 'Message', 'Date', 'Status', 'Actions'].map((head) => (
              <th
                key={head}
                className="py-3 px-5 text-left text-sm font-semibold text-gray-600 tracking-wide border-b"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {inquiries.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-400 text-sm">
                📭 No inquiries yet.
              </td>
            </tr>
          ) : (
            inquiries.map((inquiry, index) => (
              <tr key={inquiry.inquiry_id || inquiry.id} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-5 text-gray-500 text-sm">{startIndex + index + 1}</td>

                <td className="py-3 px-5 text-gray-800 font-medium text-sm">
                  {inquiry.name}
                </td>

                <td className="py-3 px-5 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline break-all">
                      {inquiry.email}
                    </a>
                  </div>
                </td>

                <td className="py-3 px-5 text-gray-700 text-sm max-w-xs">
                  <div className="line-clamp-2 hover:line-clamp-none cursor-pointer" title={inquiry.message}>
                    {inquiry.message}
                  </div>
                </td>

                <td className="py-3 px-5 text-gray-500 text-sm whitespace-nowrap">
                  {new Date(inquiry.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>

                <td className="py-3 px-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    inquiry.status === 'read'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {inquiry.status === 'read' ? '✓ Read' : 'New'}
                  </span>
                </td>

                <td className="py-3 px-5 space-x-2 text-center">
                  {inquiry.status !== 'read' && (
                    <button
                      onClick={() => onMarkAsRead(inquiry.inquiry_id || inquiry.id)}
                      disabled={loading}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <BookmarkedIcon className="w-3 h-3" />
                      Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(inquiry.inquiry_id || inquiry.id, inquiry.name)}
                    disabled={loading}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;
