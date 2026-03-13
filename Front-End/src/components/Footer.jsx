import React from 'react';
import lunar from '../assets/lunar-logo.png';
import ig from '../assets/instagram.png';
import yt from '../assets/Youtube.png';
import link from '../assets/Linkedin.png';

const Footer = () => {
  return (
    <>
      <div className="relative w-full py-8 px-5 md:px-16 lg:px-16 xl:px-16 2xl:px-40 bg-[#062B4C] mt-10 flex flex-col sm:flex-row max-w-full justify-between">
        {/* Kiri: Logo + tagline + garis + sosmed desktop */}
        <div className="flex md:pr-5 lg:pr-16 md:w-62 lg:w-92">
          <div className="flex flex-col sm:gap-0 gap-5 text-white w-[310px] text-right">
            {/* Logo */}
            <div>
              <img
                src={lunar}
                alt="Lunar Logo"
                className="w-62 md:w-38 lg:w-58 md:pb-0 lg:pb-0 pb-14 sm:pl-0 pl-4"
              />
            </div>

            {/* Tagline + garis + sosmed */}
            <div className="hidden sm:flex flex-col gap-3 lg:gap-4">
              <p className="md:text-[11px] lg:text-[14px] text-sm font-heading font-semibold">
                Interactive, Innovative, Intuitive
              </p>
              <div className="border-b border-white w-full"></div>
              <div className="flex gap-5 justify-end sm:justify-start">
                <a
                  href="https://www.instagram.com/lunarinteractive/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={ig}
                    alt="Instagram"
                    className="md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer"
                  />
                </a>
                <a
                  href="https://www.youtube.com/@Lunar-Interactive"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={yt}
                    alt="Youtube"
                    className="md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/lunarinteractive/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={link}
                    alt="LinkedIn"
                    className="md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Tengah: Company / Services / Contact */}
        <div className="text-white text-[15px] md:text-[12px] lg:text-[14px] xl:text-[14px] 2xl:text-[18px] font-sans grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 lg:gap-8 xl:gap-12 px-5 md:px-0 lg:pl-4 xl:px-4">
          <div>
            <h3 className="font-bold text-lg mb-3">Company</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>Home</li>
              <li>About</li>
              <li>Projects</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Contact us</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              <li>Email</li>
              <li>Phone</li>
              <li>Office Location</li>
            </ul>
          </div>
        </div>

        {/* Kanan: Map (ilang di mobile) */}
        {/* Kanan: Map hanya muncul di XL ke atas */}
        <div className="hidden xl:block">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps?q=-6.9704141,107.6303336&hl=es;z=16&output=embed"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        <div className="sm:hidden w-full relative bg-[#062B4C] flex flex-col px-4 md:px-0 sm:items-start gap-4 pt-14 text-white">
          <p className="text-lg sm:text-sm font-heading font-semibold flex w-[350px] sm:w-0 sm:text-center">
            Interactive, Innovative, Intuitive
          </p>
          <div className="border-b border-white w-[300px]"></div>
          <div className="flex justify-start w-[350px] gap-6">
            <div className="flex gap-5 justify-end sm:justify-start">
                <a
                  href="https://www.instagram.com/lunarinteractive/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={ig}
                    alt="Instagram"
                    className="w-9 md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer"
                  />
                </a>
                <a
                  href="https://www.youtube.com/@Lunar-Interactive"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={yt}
                    alt="Youtube"
                    className="w-9 md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer"
                  />
                </a>
                <a
                  href="https://www.linkedin.com/company/lunarinteractive/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={link}
                    alt="LinkedIn"
                    className="w-9 md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer"
                  />
                </a>
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
