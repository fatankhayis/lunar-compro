import React, { useEffect, useState, useRef } from "react";
import CardProduct from "./CardProduct";
import { getProducts } from "../../Admin/services/api";

const ProductPage = () => {
  const cardRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProduct(data[0]);
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div className="relative py-10 w-full overflow-hidden">

      <div className="relative max-w-[1320px] px-5 mx-auto flex flex-col gap-10">
        <h1 className="font-semibold font-heading text-[24px] md:text-[28px] lg:text-[31px] xl:text-[33px] text-white text-center">
          Our Product
        </h1>

        {/* Card dengan CSS transition */}
        <div ref={cardRef} className="transition-all duration-800 px-5 md:px-8 lg:px-12 xl:px-0">
          <CardProduct product={product} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;