import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lunar from '../assets/Lunar-logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Menu, X } from 'lucide-react';

const Header = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const path = location.pathname;

  // Fungsi untuk scroll ke atas
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // Scroll ke atas setiap kali location/pathname berubah

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: -20,
    },
    open: {
      opacity: 1,
      y: 0,
    },
  };

  const linkClass = (to) =>
    `relative pb-1 after:absolute after:left-0 after:bottom-0 after:content-[''] 
     after:h-[2px] after:bg-white after:transition-all after:duration-300
     ${path === to ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`;

  return (
    <header
      className={`fixed top-0 left-0 w-full font-sans text-white z-50 transition-all duration-300
        ${isScroll || isOpen ? 'bg-white/5 backdrop-blur-md' : 'bg-transparent'}`}
    >
      {/* Wrapper */}
      <div className="py-5 px-6 md:px-7 lg:px-10 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/" onClick={scrollToTop}>
            <img
              src={Lunar}
              alt="Lunar interactive"
              className="w-32 md:w-38 lg:w-44 cursor-pointer transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Desktop nav - MENU DI TENGAH */}
        <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
          <ul className="flex gap-12 text-lg font-medium">
            {['/', '/About', '/Project'].map((route) => (
              <li key={route}>
                <Link to={route} className={linkClass(route)} onClick={scrollToTop}>
                  {route === '/' ? 'Home' : route === '/About' ? 'About Us' : 'Project'}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Contact - DI SEBELAH KANAN */}
        <div className="hidden lg:flex">
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=dev.lunarinteractive@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 h-11 
              rounded-full border border-white/30 
              bg-white/15 backdrop-blur-md text-white
              hover:bg-white/25 hover:shadow-md active:bg-white/30
              transition-all duration-300 group"
          >
            <div className="group flex items-center gap-2 cursor-pointer">
              <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
                <Mail size={18} />
                <span>Collaborate with us</span>
              </div>
            </div>
          </a>
        </div>

        {/* Mobile/Tablet Hamburger */}
        <button
          className="lg:hidden z-50 transition-transform duration-200 hover:scale-110 active:scale-95"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile/Tablet Dropdown dengan AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="flex flex-col items-center py-6 gap-6 lg:hidden border-t border-white/20 overflow-hidden"
          >
            {['/', '/About', '/Project'].map((route, index) => (
              <motion.div
                key={route}
                variants={menuItemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                }}
              >
                <Link
                  to={route}
                  onClick={() => {
                    setIsOpen(false);
                    scrollToTop();
                  }}
                  className={`${
                    path === route ? 'underline' : ''
                  } text-lg hover:text-gray-300 block py-2`}
                >
                  {route === '/' ? 'Home' : route === '/About' ? 'About Us' : 'Project'}
                </Link>
              </motion.div>
            ))}

            {/* Contact Us Mobile */}
            <motion.div
              variants={menuItemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dev.lunarinteractive@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 
                  rounded-full border border-white/30 
                  bg-white/15 backdrop-blur-md text-white
                  hover:bg-white/25 hover:shadow-lg active:bg-white/30
                  transition-all duration-300 group mt-2"
                onClick={() => {
                  setIsOpen(false);
                  scrollToTop();
                }}
              >
                <Mail size={18} />
                <span className="group-hover:scale-105 transition-transform duration-300">
                  Collaborate with us
                </span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
