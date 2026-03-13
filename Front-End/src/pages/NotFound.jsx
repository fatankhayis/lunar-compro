import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-bgone via-bgmid to-bg text-white overflow-hidden relative">
      {/* 💫 Animated Background Glow */}
      <motion.div
        className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: [0, 80, -80, 0],
          y: [0, 50, -50, 0],
          rotate: [0, 45, -45, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ⚠️ Animated Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 10 }}
        className="mb-4 z-10"
      >
        <AlertTriangle className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
      </motion.div>

      {/* 🧩 Animated Text */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-bold mb-2 tracking-tight z-10"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-white/80 mb-8 text-center px-6 z-10"
      >
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </motion.p>

      {/* 🔙 Button back to home */}
      <div className="z-20">
        <Link
          to="/"
          className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold shadow-lg 
                     hover:bg-indigo-50 hover:scale-105 active:scale-95 
                     transition-transform duration-300"
        >
          Back to Home
        </Link>
      </div>

      {/* ✨ Floating 404 shadow effect */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          className="text-white/10 text-[200px] font-black select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          404
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
