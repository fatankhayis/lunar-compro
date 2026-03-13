import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardProject = ({ title, description, image, link, loading = false }) => {
  // Variants untuk animasi
  const cardVariants = {
    hidden: {
      y: 50,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    // Skeleton saat loading - TANPA ANIMASI
    return (
      <div className="w-full flex justify-center">
        <div className="relative flex flex-col rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md h-full bg-[#004179]/30 animate-pulse">
          {/* Skeleton Image */}
          <div className="w-full h-48 sm:h-56">
            <Skeleton height="100%" />
          </div>

          {/* Skeleton Text */}
          <div className="flex flex-col justify-between flex-grow p-4 sm:p-5">
            <Skeleton width="60%" height={24} className="mb-2" />
            <Skeleton count={3} />
            <div className="mt-6 self-start">
              <Skeleton width={80} height={32} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Konten asli DENGAN ANIMASI
  return (
    <motion.div 
      className="w-full flex justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={cardVariants}
    >
      <motion.div 
        className="relative flex flex-col rounded-2xl overflow-hidden shadow-xl max-w-sm sm:max-w-md h-full bg-[#004179] text-white "
        variants={contentVariants}
      >
        {/* Image */}
        <motion.div 
          className="w-full relative h-48 sm:h-56 overflow-hidden"
          variants={itemVariants}
        >
          <motion.img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#004179] via-[#004179]/60 to-transparent"></div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="flex flex-col justify-between flex-grow p-4 sm:p-5"
          variants={contentVariants}
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-bold text-lg sm:text-xl mb-2">{title}</h3>
            <p className="text-gray-100 text-sm sm:text-[15px] leading-relaxed text-justify break-words whitespace-normal font-heading">
              {description}
            </p>
          </motion.div>

          {/* Tombol See More */}
          {link && link.trim() !== "" && (
            <motion.div 
              className="mt-6 self-start"
              variants={itemVariants}
            >
              <motion.a
                href={link}
                className="inline-block px-4 py-2 rounded-full border border-white/30 bg-white/15 text-white hover:bg-white/25 hover:shadow-md transition-all duration-300 text-sm"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                See More
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CardProject;