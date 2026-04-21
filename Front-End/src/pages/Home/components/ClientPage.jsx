import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuCircleChevronLeft, LuCircleChevronRight } from 'react-icons/lu';
import { getTestimonials } from '../../Admin/services/api';
import CardClient from './CardClient';

const ClientPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const touchAreaRef = useRef(null);

  // 🧩 Ambil data testimonial
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials();

        // Validasi dan bersihkan data
        const validatedData = (data || []).map((item) => ({
          testimonial_id: item.testimonial_id || item.id,
          name: item.name || 'Anonymous',
          role: item.role || 'Client',
          testimonial: item.testimonial || 'No testimonial provided',
          video_url: item.video_url && item.video_url.trim() !== '' ? item.video_url : null,
          avatar: item.avatar || null,
        }));

        setTestimonials(validatedData);
        
      } catch (err) {
        console.error('❌ Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Touch event handlers untuk swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      handleNext();
    } else {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Variants untuk animasi slider
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }
    })
  };

  // Navigation functions
  const handleNext = () => {
    if (!testimonials.length) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    if (!testimonials.length) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Skeleton untuk dot indicators
  const SkeletonDots = () => (
    <div className="flex gap-3 mt-8 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="w-3 h-3 rounded-full bg-white/20"
        />
      ))}
    </div>
  );

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 flex flex-col items-center text-white font-heading overflow-hidden">
      {/* Header - TANPA ANIMASI & TAMPIL SELALU */}
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-0 md:mb-14 lg:mb-0">
        What Our Clients Say
      </h2>

      {/* Wrapper */}
      <div className="relative w-full max-w-6xl flex justify-center items-center px-5 md:px-5">
        {/* Tombol kiri */}
        <button
          onClick={handlePrev}
          className="absolute left-2 md:left-[-2rem] lg:left-[-3rem] xl:left-[3rem] top-1/2 -translate-y-1/2 
                     z-20 text-white hover:scale-95 active:scale-90 transition-transform hidden xl:flex"
          aria-label="Previous testimonial"
          disabled={loading}
        >
          <LuCircleChevronLeft size={40} className="lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
        </button>

        {/* Card Container dengan animasi */}
        <div
          ref={touchAreaRef}
          className="relative w-full h-auto min-h-[500px] md:min-h-[450px] lg:min-h-[400px] flex items-center justify-center md:cursor-default cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full md:px-15 lg:px-2"
            >
              <div
                className="bg-gradient-to-b from-bgclient1 to-bgclient2 rounded-2xl shadow-xl 
                           p-4 sm:p-6 md:p-8 lg:p-10 text-white w-full max-w-4xl mx-auto overflow-hidden select-none"
              >
                {loading ? (
                  // Skeleton loading di dalam card
                  <CardClient loading={true} />
                ) : testimonials.length > 0 ? (
                  // Content asli
                  <CardClient
                    key={testimonials[currentIndex].testimonial_id}
                    name={testimonials[currentIndex].name}
                    comment={testimonials[currentIndex].testimonial}
                    title={testimonials[currentIndex].role}
                    videoSrc={testimonials[currentIndex].video_url}
                    avatar={testimonials[currentIndex].avatar}
                    loading={false}
                  />
                ) : (
                  // Empty state
                  <div className="text-center py-10">
                    <p className="text-white/70">No testimonials available yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tombol kanan */}
        <button
          onClick={handleNext}
          className="absolute right-2 md:right-[-2rem] lg:right-[-3rem] xl:right-[3rem] top-1/2 -translate-y-1/2 
                     z-20 text-white hover:scale-95 active:scale-90 transition-transform hidden xl:flex"
          aria-label="Next testimonial"
          disabled={loading}
        >
          <LuCircleChevronRight size={40} className="lg:w-10 lg:h-10 xl:w-12 xl:h-12" />
        </button>
      </div>

      {/* Dot indicators */}
      {loading ? (
        <SkeletonDots />
      ) : (
        <div className="flex gap-3 mt-0 md:mt-14 lg:mt-0">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile Navigation Buttons */}
      <div className="flex gap-8 mt-8 xl:hidden ">
        <button
          onClick={handlePrev}
          className="p-3 text-white bg-white/20 rounded-full hover:bg-white/30 transition-all"
          aria-label="Previous testimonial"
          disabled={loading}
        >
          <LuCircleChevronLeft size={28} />
        </button>
        <button
          onClick={handleNext}
          className="p-3 text-white bg-white/20 rounded-full hover:bg-white/30 transition-all"
          aria-label="Next testimonial"
          disabled={loading}
        >
          <LuCircleChevronRight size={28} />
        </button>
      </div>
    </section>
  );
};

export default ClientPage;