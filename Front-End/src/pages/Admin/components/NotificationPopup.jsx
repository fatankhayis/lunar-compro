import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';

const NotificationPopup = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto dismiss setelah 5 detik (5000 ms)
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait untuk animation selesai sebelum unmount
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleNotificationClick = () => {
    // Save message ID to highlight di halaman message
    const messageId = notification.inquiry_id || notification.id;
    localStorage.setItem('highlightMessageId', String(messageId));
    
    // Navigate ke halaman messages
    navigate('/admin/inquiries');
    
    // Close notification
    handleClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 transition-all duration-300 cursor-pointer ${
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
      style={{
        animation: !isClosing ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-in',
      }}
      onClick={handleNotificationClick}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>

      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-96 max-w-[calc(100vw-2rem)] hover:shadow-2xl transition-shadow">
        {/* Header with bell icon and name */}
        <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{notification.name}</p>
              <p className="text-sm text-gray-600">{notification.email}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message preview */}
        <div className="p-4">
          {notification.phone && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Phone:</span> {notification.phone}
            </p>
          )}
          <p className="text-sm text-gray-700 line-clamp-3">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-3">
            {new Date(notification.created_at).toLocaleString()}
          </p>
          <p className="text-xs text-blue-600 mt-2 font-medium">Click to view message →</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
