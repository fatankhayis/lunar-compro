import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isReload =
      performance.getEntriesByType("navigation")[0]?.type === "reload";

    if (isReload) {
      // 🚫 Kalau refresh, jangan scroll ke atas
      return;
    }

    // ✅ Kalau pindah halaman, scroll ke atas
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
