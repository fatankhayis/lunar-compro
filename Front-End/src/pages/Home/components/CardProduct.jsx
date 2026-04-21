import React from 'react';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../../url';

const CardProduct = ({ product, loading = false }) => {
  // Variants untuk animasi
  const cardVariants = {
    hidden: {
      y: 60,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // 🦴 Show skeleton loader when `loading` is true or data is empty
  if (loading || !product) {
    return (
      <motion.div 
        className="w-full flex justify-center items-center px-5 py-8"
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <div className="relative rounded-xl overflow-hidden shadow-2xl h-[450px] w-full max-w-[1420px] animate-pulse bg-gray-200">
          {/* Placeholder Gambar */}
          <div className="absolute inset-0 bg-gray-300"></div>

          {/* Placeholder Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/80 to-gray-300/60"></div>

          {/* Placeholder Teks */}
          <div className="absolute top-6 left-6 z-20 max-w-lg text-white space-y-4">
            <div className="h-8 bg-gray-400 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-400 w-full rounded"></div>
            <div className="h-4 bg-gray-400 w-5/6 rounded"></div>
            <div className="h-5 bg-gray-400 w-1/3 rounded mt-4"></div>
          </div>

          {/* Placeholder Tombol */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="h-10 w-32 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 🖼️ Normal Render (jika data sudah ada)
  return (
    <motion.div 
      className="w-full flex justify-center items-center"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <div className="relative rounded-xl overflow-hidden shadow-xl h-[450px] w-full max-w-[1420px]">
        {/* Gambar Latar Belakang */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${BASE_URL}/storage/${product.product_image}`}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay Gradient */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(140deg, rgba(0,41,76,0.95) 40%, rgba(0,41,76,0.6) 65%, transparent 100%)',
          }}
        ></div>

        {/* Konten */}
        <div className="absolute top-6 left-6 z-20 max-w-lg text-white">
          <h3 className="font-extrabold text-4xl md:text-5xl mb-3 leading-tight">{product.title}</h3>
          <p className="text-lg md:text-xl leading-relaxed text-gray-200">{product.description}</p>

          {product.price && (
            <p className="mt-3 text-xl font-semibold text-yellow-400">${product.price}</p>
          )}
        </div>

        {/* Tombol */}
        <div className="absolute bottom-6 left-6 z-20">
          <motion.a
            href={product.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-3 rounded-full border border-white 
              bg-white/20 backdrop-blur-sm text-white font-semibold
              hover:bg-white/30 hover:shadow-lg active:bg-white/40
              transition-all duration-300 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            See More
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default CardProduct;