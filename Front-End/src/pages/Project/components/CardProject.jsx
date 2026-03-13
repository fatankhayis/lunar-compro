import React from 'react';
import { BASE_URL } from '../../../url';

const CardProject = ({ project }) => {
  return (
    <div className="w-full flex justify-center items-center px-5">
      {/* Container Card */}
      <div className="relative rounded-xl overflow-hidden shadow-2xl h-[480px] w-full max-w-[1420px]">
        {/* 🖼️ Gambar Latar Belakang Penuh */}
        <div className="absolute inset-0 z-0">
          <img
            src={`${BASE_URL}/storage/${project.project_image}`}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 🌈 Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              'linear-gradient(140deg, rgba(0,41,76,0.95) 40%, rgba(0,41,76,0.6) 65%, transparent 100%)',
          }}
        ></div>

        {/* 🔹 Konten Teks di Pojok Kiri Atas */}
        <div className="absolute top-6 left-6 z-20 max-w-lg text-white">
          <h3 className="font-extrabold text-4xl md:text-5xl mb-3 leading-tight">
            {project.title}
          </h3>
          <p className="text-lg md:text-xl leading-relaxed text-gray-200">{project.description}</p>
        </div>

        {/* 🔹 Tombol di Pojok Kiri Bawah */}
        <div className="absolute bottom-6 left-6 z-20">
          <a
            href={project.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-7 py-3 rounded-full border border-white 
                bg-white/20 backdrop-blur-sm text-white font-semibold
                hover:bg-white/30 hover:shadow-lg active:bg-white/40
                transition-all duration-300 text-lg"
          >
            See More
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardProject;
