import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../../i18n/I18nProvider.jsx';

const AboutPage = () => {
  const { t } = useI18n();
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
  };

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
  };

  const textVariants = {
    hidden: {
      y: 40,
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
        delay: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="w-full p-5 md:py-20 lg:py-32 relative z-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto gap-5 flex flex-col text-white text-center font-heading">
        <motion.h1 
          className="font-semibold text-[24px] md:text-[28px] lg:text-[31px] xl:text-[33px] text-center"
          variants={titleVariants}
        >
          {t('about_title')}
        </motion.h1>
        
        <motion.p 
          className="mx-auto text-[18px] md:text-[19px] lg:text-[22px] xl:text-[24px] leading-relaxed px-5 md:px-8 lg:px-10 xl:px-0"
          variants={textVariants}
        >
          {t('about_desc1')} {t('about_desc2')}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AboutPage;