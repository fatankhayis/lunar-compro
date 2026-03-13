import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CardProduct from "./CardProduct";
import { getProducts } from "../../Admin/services/api";

gsap.registerPlugin(ScrollTrigger);

const ProductPage = () => {
  const cardsRef = useRef([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading && products.length > 0) {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "bottom 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, [products, loading]);

  // Skeleton component
  const ProductSkeleton = () => (
    <div className="w-full flex justify-center items-center px-5">
      <div className="relative rounded-xl overflow-hidden shadow-2xl h-[480px] w-full max-w-[1420px] animate-pulse">
        {/* Background skeleton */}
        <div className="absolute inset-0 bg-gray-700"></div>
        
        {/* Gradient overlay skeleton */}
           <div className="absolute inset-0 bg-gradient-to-br from-gray-300/80 to-gray-200/60"></div>
        
        {/* Content skeleton */}
        <div className="absolute top-6 left-6 z-20 max-w-lg space-y-4">
          <div className="h-10 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
        
        {/* Button skeleton */}
        <div className="absolute bottom-6 left-6 z-20">
          <div className="h-12 w-32 bg-gray-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative py-28 w-full overflow-hidden">
      <div className="relative max-w-[2000px] px-10 mx-auto flex flex-col gap-10">
        {/* Header - Static */}
        <h1 className="font-semibold font-heading text-[24px] md:text-[28px] lg:text-[32px] text-white text-center">
          Our Product
        </h1>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-16">
          {loading ? (
            // Show 2 skeleton cards while loading
            Array.from({ length: 2 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : products.length > 0 ? (
            products.map((product, i) => (
              <div
                key={product.product_id || i}
                ref={(el) => (cardsRef.current[i] = el)}
              >
                <CardProduct product={product} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-300">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;