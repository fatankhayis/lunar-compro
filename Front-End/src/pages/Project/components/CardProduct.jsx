import React from "react";
import { BASE_URL } from "../../../url";

const CardProduct = ({ product, loading = false }) => {
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center px-5">
        <div className="relative rounded-xl overflow-hidden shadow-2xl h-[480px] w-full max-w-[1420px] animate-pulse">
          <div className="absolute inset-0 bg-gray-700"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/80 to-gray-500/60"></div>
          <div className="absolute top-6 left-6 z-20 max-w-lg space-y-4">
            <div className="h-10 bg-gray-500 rounded w-3/4"></div>
            <div className="h-4 bg-gray-500 rounded w-full"></div>
            <div className="h-4 bg-gray-500 rounded w-5/6"></div>
          </div>
          <div className="absolute bottom-6 left-6 z-20">
            <div className="h-12 w-32 bg-gray-500 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center px-5">
      <div className="relative rounded-xl overflow-hidden shadow-2xl h-[480px] w-full max-w-[1420px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${BASE_URL}/storage/${product.product_image}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(140deg, rgba(0,41,76,0.95) 40%, rgba(0,41,76,0.6) 65%, transparent 100%)',
          }}
        ></div>

        {/* Content */}
        <div className="absolute top-6 left-6 z-20 max-w-lg text-white">
          <h3 className="font-extrabold text-4xl md:text-5xl mb-3 leading-tight">
            {product.title}
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-gray-200">
            {product.description}
          </p>
        </div>

        {/* Button */}
        <div className="absolute bottom-6 left-6 z-20">
          <a
            href={product.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-3 rounded-full border border-white 
              bg-white/20 backdrop-blur-sm text-white font-semibold
              hover:bg-white/30 hover:shadow-lg active:bg-white/40
              transition-all duration-300 text-lg"
          >
            See More
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;