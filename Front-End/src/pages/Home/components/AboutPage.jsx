import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
  // Variants untuk animasi
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const titleVariants = {
    hidden: {
      y: 50,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const textVariants = {
    hidden: {
      y: 30,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2
      }
    }
  }

  return (
    <motion.div 
      className="w-full p-5 md:py-20 lg:py-42 relative z-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto gap-5 flex flex-col text-white text-justify font-heading">
        <motion.h1 
          className="font-semibold text-[24px] md:text-[28px] lg:text-[31px] xl:text-[33px] text-center"
          variants={titleVariants}
        >
          Interactive Learning through Technology
        </motion.h1>
        
        <motion.p 
          className="mx-auto text-[18px] md:text-[19px] lg:text-[22px] xl:text-[24px] leading-relaxed px-5 md:px-8 lg:px-10 xl:px-0"
          variants={textVariants}
        >
          Lunar Interactive is transforming education with innovative technology. We focus on
          Digital Game-Based Learning (DGBL) to make learning engaging through game mechanics, and
          Computer-Assisted Language Learning (CALL) to enhance language acquisition. Our mission is
          to create intuitive, interactive platforms{' '}
          <span className="inline xl:block xl:text-center">
            that make learning both effective and enjoyable.
          </span>
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AboutPage;