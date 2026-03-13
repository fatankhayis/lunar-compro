import React, { useEffect, useRef, useState } from 'react';

function getDeviceKey() {
  const w = window.innerWidth;
  if (w < 600) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getDeviceConfig(key) {
  if (key === 'mobile') return { count: 6, sizeMin: 40, sizeMax: 60 };
  if (key === 'tablet') return { count: 8, sizeMin: 60, sizeMax: 90 };
  return { count: 10, sizeMin: 80, sizeMax: 120 };
}

const StarBackground = () => {
  const canvasRef = useRef(null);
  const [deviceType, setDeviceType] = useState(getDeviceKey());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/image4.png';

    let stars = [];

    const isTooClose = (x, y, size, stars, minDistance = 150) => {
      return stars.some((s) => {
        const dx = x - s.x;
        const dy = y - s.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
    };

    const createStar = (config, stars) => {
      const { sizeMin, sizeMax } = config;
      const size = sizeMin + Math.random() * (sizeMax - sizeMin);
      let x,
        y,
        attempts = 0;
      do {
        x = Math.random() * (canvas.width - size);
        y = Math.random() * (canvas.height - size);
        attempts++;
        if (attempts > 200) break;
      } while (isTooClose(x, y, size, stars, size * 1.5));

      return {
        x,
        y,
        size,
        opacity: Math.random() * 0.7 + 0.3,
        blinkSpeed: 0.001 + Math.random() * 0.002,
        blinkDirection: Math.random() < 0.5 ? -1 : 1,
      };
    };

    const generateStars = (config) => {
      const { count } = config;
      const newStars = [];
      for (let i = 0; i < count; i++) {
        newStars.push(createStar(config, newStars));
      }
      return newStars;
    };

    const saveStars = (key, stars) => {
      localStorage.setItem(`stars_${key}`, JSON.stringify(stars));
    };

    const loadStars = (key, config) => {
      const saved = localStorage.getItem(`stars_${key}`);
      if (saved) {
        return JSON.parse(saved);
      } else {
        const newStars = generateStars(config);
        saveStars(key, newStars);
        return newStars;
      }
    };

    const draw = (config) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🔹 Blur halus
      ctx.filter = 'blur(1px)'; // ganti 1px sesuai kebutuhan

      stars.forEach((star, i) => {
        ctx.globalAlpha = star.opacity;
        ctx.drawImage(img, star.x, star.y, star.size, star.size);

        star.opacity += star.blinkSpeed * star.blinkDirection;

        if (star.opacity >= 1) {
          star.opacity = 1;
          star.blinkDirection = -1;
        } else if (star.opacity <= 0.05) {
          const newStar = createStar(config, stars);
          stars[i] = { ...newStar, opacity: 0.1, blinkDirection: 1 };
          saveStars(deviceType, stars);
        }
      });

      ctx.filter = 'none';
    };

    const animate = (config) => {
      draw(config);
      requestAnimationFrame(() => animate(config));
    };

    img.onload = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const config = getDeviceConfig(deviceType);
      stars = loadStars(deviceType, config);
      animate(config);
    };

    return () => ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [deviceType]);

  useEffect(() => {
    const handleResize = () => {
      const newType = getDeviceKey();
      if (newType !== deviceType) setDeviceType(newType);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default StarBackground;
