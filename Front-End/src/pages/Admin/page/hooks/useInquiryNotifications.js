import { useEffect, useRef, useCallback } from 'react';
import { getInquiries } from '../../services/inquiryApi';

const useInquiryNotifications = (onNewInquiry, isAdminPage = false) => {
  const pollingIntervalRef = useRef(null);
  const lastFetchRef = useRef(null);
  const lastNotifiedIdRef = useRef(null);

  // Get last notified inquiry ID dari localStorage
  const getLastNotifiedId = useCallback(() => {
    return localStorage.getItem('lastNotifiedInquiryId');
  }, []);

  // Save last notified inquiry ID ke localStorage
  const saveLastNotifiedId = useCallback((id) => {
    localStorage.setItem('lastNotifiedInquiryId', String(id));
    lastNotifiedIdRef.current = id;
  }, []);

  // Fetch inquiries dan check untuk new ones
  const checkForNewInquiries = useCallback(async () => {
    try {
      if (!isAdminPage) return; // Don't poll jika admin page tidak open

      const res = await getInquiries(1, 1); // Get latest inquiry
      const latestInquiry = res.data?.[0];

      if (latestInquiry) {
        const currentId = latestInquiry.inquiry_id || latestInquiry.id;
        const lastNotifiedId = getLastNotifiedId();
        
        // Hanya notify jika inquiry ID berbeda dari yang sudah di-notify sebelumnya
        if (lastNotifiedId !== String(currentId)) {
          saveLastNotifiedId(currentId);
          onNewInquiry(latestInquiry);
        }
      }
    } catch (err) {
      console.error('Error checking for new inquiries:', err);
    }
  }, [isAdminPage, onNewInquiry, getLastNotifiedId, saveLastNotifiedId]);

  // Start/stop polling berdasarkan apakah admin page dibuka
  useEffect(() => {
    if (isAdminPage) {
      // Poll setiap 5 detik ketika admin page dibuka
      pollingIntervalRef.current = setInterval(() => {
        checkForNewInquiries();
      }, 5000);

      // Check immediately ketika page dibuka
      checkForNewInquiries();
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
  }, [isAdminPage, checkForNewInquiries]);

  return {
    stopPolling: () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    },
  };
};

export default useInquiryNotifications;
