import React from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import lunar from '../assets/lunar-logo.png';
import ig from '../assets/instagram.png';
import yt from '../assets/Youtube.png';
import link from '../assets/Linkedin.png';
import { createInquiry } from '../pages/Admin/services/api';

const Footer = () => {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || 'dev.lunarinteractive@gmail.com';
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const [quoteForm, setQuoteForm] = React.useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = React.useState(false);

  const onChange = (key) => (e) => {
    setQuoteForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmitQuote = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await createInquiry({
        ...quoteForm,
        phone: '',
        source_url: typeof window !== 'undefined' ? window.location.href : '',
      });
      toast.success('Request sent. Thank you!');
      setQuoteForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Failed to send request. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative w-full bg-[#062B4C] mt-10">
        <div className="max-w-[1600px] mx-auto py-10 px-5 md:px-16 2xl:px-40 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left: brand */}
          <div className="md:col-span-4 text-white">
            <img src={lunar} alt="Lunar Logo" className="w-56 md:w-52 lg:w-60" />
            <p className="mt-4 text-sm md:text-[12px] lg:text-[14px] font-heading font-semibold">
              Interactive, Innovative, Intuitive
            </p>
            <div className="mt-4 border-b border-white/60 w-full max-w-sm" />
            <div className="mt-4 flex gap-5">
              <a href="https://www.instagram.com/lunarinteractive/" target="_blank" rel="noopener noreferrer">
                <img src={ig} alt="Instagram" className="w-9 h-9 cursor-pointer" />
              </a>
              <a href="https://www.youtube.com/@Lunar-Interactive" target="_blank" rel="noopener noreferrer">
                <img src={yt} alt="Youtube" className="w-9 h-9 cursor-pointer" />
              </a>
              <a href="https://www.linkedin.com/company/lunarinteractive/" target="_blank" rel="noopener noreferrer">
                <img src={link} alt="LinkedIn" className="w-9 h-9 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-4 xl:col-span-2 text-white font-sans">
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-gray-200">
              <li>
                <Link to="/" className="hover:text-white" onClick={scrollToTop}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white" onClick={scrollToTop}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/project" className="hover:text-white" onClick={scrollToTop}>
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white" onClick={scrollToTop}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Quote form */}
          <div className="md:col-span-4 xl:col-span-4 text-white font-sans">
            <h3 className="font-bold text-lg mb-4">Request a Quote</h3>
            <form onSubmit={onSubmitQuote} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={quoteForm.name}
                  onChange={onChange('name')}
                  required
                  className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none"
                  placeholder="Name"
                />
                <input
                  value={quoteForm.email}
                  onChange={onChange('email')}
                  type="email"
                  required
                  className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none"
                  placeholder="Email"
                />
                <textarea
                  value={quoteForm.message}
                  onChange={onChange('message')}
                  required
                  rows={3}
                  className="sm:col-span-2 w-full rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none resize-none"
                  placeholder="Message"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-2 text-sm bg-white/15 border border-white/30 rounded-md text-white hover:bg-white/25 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending…' : 'Send'}
              </button>

              <div className="text-xs text-white/60">
                Or email us:{' '}
                <a className="hover:text-white" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
              </div>
            </form>
          </div>

          {/* Map (XL+) */}
          <div className="hidden xl:block xl:col-span-2">
            <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
              <iframe
                src="https://www.google.com/maps?q=-6.9704141,107.6303336&hl=es;z=16&output=embed"
                width="100%"
                height="240"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline + garis + sosmed khusus mobile */}

      {/* Copyright */}
      <div className="bg-[#042038] relative text-white text-center py-4 text-sm sm:text-md">
        © Lunar Interactive 2025. All rights reserved
      </div>
    </>
  );
};

export default Footer;
