import React, { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle2 } from 'lucide-react';

const MessageTable = ({ messages, onDelete, onMarkAsRead, loading, startIndex = 0 }) => {
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => {
    // Check jika ada message yang harus di-highlight dari localStorage
    const storedId = localStorage.getItem('highlightMessageId');
    if (storedId) {
      setHighlightId(parseInt(storedId));
      
      // Hapus dari localStorage setelah digunakan
      localStorage.removeItem('highlightMessageId');
      
      // Hilangkan highlight setelah 2 detik
      setTimeout(() => {
        setHighlightId(null);
      }, 2000);
    }
  }, []);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete message from ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <>
      <style>{`
        @keyframes highlight-blink {
          0% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.3); }
          100% { background-color: transparent; }
        }
        .highlight-message {
          animation: highlight-blink 0.6s ease-in-out 2;
        }
      `}</style>
      
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
            {messages.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400 text-sm">
                  📭 No messages yet.
                </td>
              </tr>
            ) : (
              messages.map((message, index) => {
                const messageId = message.inquiry_id || message.id;
                const isHighlighted = highlightId === messageId;
                
                return (
                  <tr 
                    key={messageId} 
                    className={`border-t hover:bg-gray-50 transition ${isHighlighted ? 'highlight-message' : ''}`}
                  >
                    <td className="py-3 px-5 text-gray-500 text-sm">{startIndex + index + 1}</td>

                    <td className="py-3 px-5 text-gray-800 font-medium text-sm">
                      {message.name}
                    </td>

                    <td className="py-3 px-5 text-gray-600 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${message.email}`} className="text-blue-600 hover:underline break-all">
                          {message.email}
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-5 text-gray-700 text-sm max-w-xs">
                      <div className="line-clamp-2 hover:line-clamp-none cursor-pointer" title={message.message}>
                        {message.message}
                      </div>
                    </td>

                    <td className="py-3 px-5 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(message.created_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        message.status === 'read'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {message.status === 'read' ? '✓ Read' : 'New'}
                      </span>
                    </td>

                    <td className="py-3 px-5 space-x-2 text-center">
                      {message.status !== 'read' && (
                        <button
                          onClick={() => onMarkAsRead(messageId)}
                          disabled={loading}
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(messageId, message.name)}
                        disabled={loading}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MessageTable;
