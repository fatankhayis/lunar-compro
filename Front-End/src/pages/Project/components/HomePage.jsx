import React from 'react'
import { motion } from 'framer-motion'
import lunarlogo from '../../../assets/Lunar-logo.png'

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
  }

  const logoVariants = {
    hidden: {
      y: 100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 20,
        duration: 1.2,
        ease: "easeOut"
      }
    }
  }

  const textVariants = {
    hidden: {
      y: 60,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 25,
        duration: 0.9,
        ease: "easeOut",
        delay: 0.4
      }
    }
  }

  return (
    <motion.div 
      className="relative h-screen w-full overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-bg to-90% to-bgone/80" ></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center z-30 text-white">
        <motion.img
          src={lunarlogo}
          alt="Lunar Interactive"
          className="w-72 sm:w-78 md:w-82 lg:w-[360px] xl:w-[460px] mb-5 drop-shadow-2xl"
          variants={logoVariants}
        />

        <motion.p 
          className="text-[18px] sm:text-[19px] md:text-xl lg:text-[23px] xl:text-[28px] font-semibold tracking-wide text-center lg:mt-2"
          variants={textVariants}
        >
          Interactive • Innovative • Intuitive
        </motion.p>
      </div>
    </motion.div>
  )
}

export default HomePage