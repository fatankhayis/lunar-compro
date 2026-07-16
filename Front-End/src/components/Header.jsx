import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Lunar from '../assets/Lunar-logo.png';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Menu, X, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import flagEN from '../assets/flags/en.svg';
import flagID from '../assets/flags/id.svg';

const Header = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { lang, setLang, t } = useI18n();

  const langDropdownRef = useRef(null);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!langDropdownRef.current) return;
      if (langDropdownRef.current.contains(e.target)) return;
      setIsLangOpen(false);
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const currentFlag = lang === 'id' ? flagID : flagEN;

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
            {['/', '/about', '/project', '/blog'].map((route) => (
              <li key={route}>
                <Link to={route} className={linkClass(route)} onClick={scrollToTop}>
                  {route === '/'
                    ? t('nav_home')
                    : route === '/about'
                      ? t('nav_about')
                      : route === '/project'
                        ? t('nav_project')
                        : route === '/blog'
                          ? t('nav_blog')
                          : 'Contact'}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Contact & Lang - DI SEBELAH KANAN */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              aria-label="Language"
              title="Language"
              aria-expanded={isLangOpen}
              onClick={() => setIsLangOpen((v) => !v)}
              className="h-9 w-[64px] rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/15 transition flex items-center justify-between px-2"
            >
              <span className="h-5 w-7 rounded-sm overflow-hidden block">
                <img src={currentFlag} alt="Current language" className="h-full w-full object-cover" />
              </span>
              <ChevronDown
                size={14}
                className={`text-white/80 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 mt-2 w-[64px] rounded-md border border-white/20 bg-white/10 backdrop-blur-md overflow-hidden shadow-lg z-50"
                >
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLang('en');
                      setIsLangOpen(false);
                    }}
                    className="block w-full hover:bg-white/20 transition p-1.5"
                    title="English"
                  >
                    <img src={flagEN} alt="English" className="h-5 w-full object-cover rounded-sm" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLang('id');
                      setIsLangOpen(false);
                    }}
                    className="block w-full hover:bg-white/20 transition p-1.5"
                    title="Indonesia"
                  >
                    <img src={flagID} alt="Indonesia" className="h-5 w-full object-cover rounded-sm" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                <span>{t('header_collaborate')}</span>
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
            {['/', '/about', '/project', '/blog'].map((route, index) => (
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
                  {route === '/'
                    ? t('nav_home')
                    : route === '/about'
                      ? t('nav_about')
                      : route === '/project'
                        ? t('nav_project')
                        : route === '/blog'
                          ? t('nav_blog')
                          : 'Contact'}
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
              className="flex flex-col items-center gap-4"
            >
              {/* Language Toggle Mobile */}
              <div className="flex gap-4 mb-2">
                <button
                  onClick={() => {
                    setLang('en');
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${lang === 'en' ? 'border-white bg-white/20' : 'border-white/30 bg-white/5'}`}
                >
                  <img src={flagEN} alt="English" className="w-5 rounded-sm" /> EN
                </button>
                <button
                  onClick={() => {
                    setLang('id');
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition ${lang === 'id' ? 'border-white bg-white/20' : 'border-white/30 bg-white/5'}`}
                >
                  <img src={flagID} alt="Indonesia" className="w-5 rounded-sm" /> ID
                </button>
              </div>

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
                  {t('header_collaborate')}
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
