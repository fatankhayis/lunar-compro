import { useEffect } from "react";

const ScrollMemory = () => {
  useEffect(() => {
    // 🔹 Saat halaman di-refresh atau ditutup, simpan posisi scroll
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 🔹 Saat halaman dimuat ulang, kembalikan posisi scroll
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo({
        top: parseInt(savedPosition, 10),
        behavior: "auto", // atau "smooth" jika mau animasi
      });
    }

    // 🧹 Bersihkan event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default ScrollMemory;
