import React from 'react';
import { motion } from 'framer-motion';

const CardTeam = ({ name, role, title, image }) => {
  // Variants untuk animasi
  const cardVariants = {
    hidden: {
      y: 60,
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.8
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const textVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: 0.6,
        ease: "easeOut",
        delay: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="relative flex justify-center h-[340px] md:h-[330px] lg:h-[330px] xl:h-[370px]"
      variants={cardVariants}
      whileHover={{
        y: -10,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      {/* 🟣 1. Card background (Base) */}
      <motion.div 
        className="absolute bottom-0 w-78 md:w-76 lg:w-[285px] xl:w-84 h-[80%] rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-t from-bgone to-bgtre z-10"
        variants={cardVariants}
      ></motion.div>

      {/* 🧑 2. Foto anggota tim (Di atas background, dipotong di bawah agar tidak tembus) */}
      <div 
        className="absolute bottom-0 w-78 md:w-76 lg:w-[285px] xl:w-84 h-full pointer-events-none z-20"
        style={{ clipPath: 'inset(-50% 0 0 0 round 0 0 2rem 2rem)', WebkitClipPath: 'inset(-50% 0 0 0 round 0 0 2rem 2rem)' }}
      >
        <motion.img
          src={image}
          alt={name}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 md:w-66 lg:w-60 xl:w-74 h-[260px] md:h-[260px] lg:h-[250px] xl:h-[300px] object-contain object-bottom pointer-events-auto"
          variants={imageVariants}
          whileHover={{
            scale: 1.05,
            y: -5,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        />
      </div>

      {/* 🟣 3. Gradient overlay & Text (Di atas foto agar foto terlihat memudar di bawah) */}
      <motion.div
        className="absolute bottom-0 w-78 md:w-76 lg:w-[285px] xl:w-84 h-[80%] rounded-[2rem] overflow-hidden z-30 pointer-events-none"
        variants={cardVariants}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(160,120,185,1) 25%, rgba(160,120,185,0.85) 30%, rgba(160,120,185,0.4) 55%, transparent 100%)',
          }}
        ></div>

        <motion.div 
          className="absolute bottom-4 left-5 right-5 text-white text-left z-40 pointer-events-auto"
          variants={textVariants}
        >
          <h3 className="text-14 md:text-[14px] lg:text-[15px] xl:text-[16px] font-bold leading-tight tracking-wider">
            {name} <span className='text-[14px] font-normal italic opacity-70'>{title}</span>
          </h3>
          <p className="text-[14px] md:text-[13px] lg:text-[13px] xl:text-[14px] opacity-90 leading-tight">- {role}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CardTeam;