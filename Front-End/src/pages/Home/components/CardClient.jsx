import React, { useState } from "react";

const CardClient = ({ comment, name, title, videoSrc, avatar, loading = false }) => {
  const [videoError, setVideoError] = useState(false);

  // Fungsi untuk extract YouTube ID dari URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Fungsi untuk menentukan apakah URL adalah YouTube
  const isYouTubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  // Fungsi untuk generate embed URL YouTube
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1` : null;
  };

  const isYouTube = isYouTubeUrl(videoSrc);
  const embedUrl = getYouTubeEmbedUrl(videoSrc);

  // Skeleton Component
  const SkeletonCard = () => (
    <div className="flex flex-col lg:flex-row w-full transition-all duration-500 relative z-10 gap-6 md:gap-8 animate-pulse">
      
      {/* MOBILE & TABLET: Video di atas, content di bawah */}
      <div className="lg:hidden flex flex-col w-full">
        {/* Video Section Skeleton */}
        <div className="w-full mb-6">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-700/50"></div>
        </div>

        {/* Content Section Skeleton */}
        <div className="w-full text-center">
          {/* Text Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6 mx-auto"></div>
            <div className="h-4 bg-gray-700/50 rounded w-4/6 mx-auto"></div>
          </div>
          
          {/* Avatar & Name Skeleton */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700/50 rounded w-24"></div>
              <div className="h-3 bg-gray-700/50 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP: Content di kiri, video di kanan */}
      <div className="hidden lg:flex flex-row w-full gap-8">
        {/* Content Section Skeleton - Kiri untuk desktop */}
        <div className="flex-1 flex flex-col justify-center text-left">
          {/* Text Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-gray-700/50 rounded w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700/50 rounded w-4/6"></div>
          </div>
          
          {/* Avatar & Name Skeleton */}
          <div className="flex items-center gap-4 justify-center text-center">
            <div className="w-12 h-12 bg-gray-700/50 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700/50 rounded w-24"></div>
              <div className="h-3 bg-gray-700/50 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Video Section Skeleton - Kanan untuk desktop */}
        <div className="flex-1 w-full max-w-md">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-700/50"></div>
        </div>
      </div>
    </div>
  );

  // Jika loading, tampilkan skeleton
  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div className="flex flex-col lg:flex-row w-full transition-all duration-500 relative z-10 gap-6 md:gap-8">
      
      {/* MOBILE & TABLET: Video di atas, content di bawah */}
      <div className="lg:hidden flex flex-col w-full">
        {/* Video Section - Atas untuk mobile & tablet */}
        <div className="w-full mb-6">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
            {videoSrc ? (
              isYouTube ? (
                // YouTube Embed
                <div className="w-full h-full">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`YouTube video - ${name}`}
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <p className="text-white/60 text-center p-4">
                        Invalid YouTube URL
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Regular Video File
                <video
                  src={videoSrc}
                  controls
                  className="w-full h-full object-cover"
                  onError={() => setVideoError(true)}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              // No Video Available
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 p-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-white/60 text-sm">No video available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - Bawah untuk mobile & tablet */}
        <div className="w-full text-center">
          <p className="italic text-base md:text-lg leading-relaxed mb-6 text-gray-100">
            "{comment}"
          </p>
          <div className="flex items-center justify-center gap-4">
            {avatar && (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div>
              <h3 className="font-semibold text-white text-lg">{name}</h3>
              <p className="text-gray-300 text-sm">{title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP: Content di kiri, video di kanan */}
      <div className="hidden lg:flex flex-row w-full gap-8">
        {/* Content Section - Kiri untuk desktop */}
        <div className="flex-1 flex flex-col justify-center text-left">
          <p className="italic text-lg leading-relaxed mb-6 text-gray-100 text-center">
            "{comment}"
          </p>
          <div className="flex items-center gap-4 justify-center text-center">
            {avatar && (
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div>
              <h3 className="font-semibold text-white text-lg">{name}</h3>
              <p className="text-gray-300 text-sm">{title}</p>
            </div>
          </div>
        </div>

        {/* Video Section - Kanan untuk desktop */}
        <div className="flex-1 w-full max-w-md">
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-gray-900">
            {videoSrc ? (
              isYouTube ? (
                // YouTube Embed
                <div className="w-full h-full">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={`YouTube video - ${name}`}
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <p className="text-white/60 text-center p-4">
                        Invalid YouTube URL
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Regular Video File
                <video
                  src={videoSrc}
                  controls
                  className="w-full h-full object-cover"
                  onError={() => setVideoError(true)}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              // No Video Available
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 p-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-white/60 text-sm">No video available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardClient;