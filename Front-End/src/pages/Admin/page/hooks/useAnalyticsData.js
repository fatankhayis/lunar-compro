import { useEffect, useState } from "react";
import { getAnalytics } from "../../../../analytics";

export const useAnalyticsData = (range) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await getAnalytics(range);
        if (mounted && !controller.signal.aborted) {
          setData(res);
        }
      } catch (err) {
        if (mounted && !controller.signal.aborted && err.name !== 'AbortError') {
          console.error("Failed to fetch analytics data:", err);
          setError(err.message);
          setData(null);
        }
      } finally {
        if (mounted && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    // Debounce fetch to avoid multiple calls
    const timeoutId = setTimeout(fetchData, 300);
    
    return () => {
      mounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [range]);

  return { data, loading, error };
};