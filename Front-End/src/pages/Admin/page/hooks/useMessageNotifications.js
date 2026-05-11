import { useEffect, useRef, useCallback } from 'react';
import { getMessages } from '../../services/messageApi';

const useMessageNotifications = (onNewMessage, isAdminPage = false) => {
  const pollingIntervalRef = useRef(null);
  const lastFetchRef = useRef(null);
  const lastNotifiedIdRef = useRef(null);

  // Get last notified message ID dari localStorage
  const getLastNotifiedId = useCallback(() => {
    return localStorage.getItem('lastNotifiedMessageId');
  }, []);

  // Save last notified message ID ke localStorage
  const saveLastNotifiedId = useCallback((id) => {
    localStorage.setItem('lastNotifiedMessageId', String(id));
    lastNotifiedIdRef.current = id;
  }, []);

  // Fetch messages dan check untuk new ones
  const checkForNewMessages = useCallback(async () => {
    try {
      if (!isAdminPage) return; // Don't poll jika admin page tidak open

      const res = await getMessages(1, 1); // Get latest message
      const latestMessage = res.data?.[0];

      if (latestMessage) {
        const currentId = latestMessage.inquiry_id || latestMessage.id;
        const lastNotifiedId = getLastNotifiedId();
        
        // Hanya notify jika message ID berbeda dari yang sudah di-notify sebelumnya
        if (lastNotifiedId !== String(currentId)) {
          saveLastNotifiedId(currentId);
          onNewMessage(latestMessage);
        }
      }
    } catch (err) {
      console.error('Error checking for new messages:', err);
    }
  }, [isAdminPage, onNewMessage, getLastNotifiedId, saveLastNotifiedId]);

  // Start/stop polling berdasarkan apakah admin page dibuka
  useEffect(() => {
    if (isAdminPage) {
      // Poll setiap 5 detik ketika admin page dibuka
      pollingIntervalRef.current = setInterval(() => {
        checkForNewMessages();
      }, 5000);

      // Check immediately ketika page dibuka
      checkForNewMessages();
    } else {
      // Stop polling ketika meninggalkan admin page
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isAdminPage, checkForNewMessages]);

  return {
    stopPolling: () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    },
  };
};

export default useMessageNotifications;
