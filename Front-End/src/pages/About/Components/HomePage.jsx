import React from "react";
import { motion } from "framer-motion";

const HomePage = () => {
  // Variants untuk animasi
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textVariants = {
    hidden: {
      y: 80,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const secondLineVariants = {
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
        damping: 25,
        duration: 1,
        ease: "easeOut",
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="relative h-screen flex justify-center items-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg to-90% to-bgone/80"></div>

      {/* Konten teks */}
      <div className="relative text-center text-4xl md:text-5xl lg:text-6xl text-white font-semibold font-heading tracking-wide min-w-[210px] md:min-w-[280px] lg:min-w-[1220px]">
        <motion.h1 
          variants={textVariants}
        >
          Get to know
        </motion.h1>
        <motion.p 
          variants={secondLineVariants}
        >
          us more
        </motion.p>
      </div>
    </motion.div>
  );
};

export default HomePage;