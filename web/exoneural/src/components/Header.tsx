import React from 'react';
import { motion } from 'framer-motion';
import { Telescope, Sparkles, Rocket } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center py-16 relative z-10"
    >
      {/* Logo + Title */}
      <motion.div
        className="flex items-center justify-center mb-8"
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Telescope className="w-12 h-12 text-cyan-400 drop-shadow-glow mr-4" />
        <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
          ExoNeural
        </h1>
        <Sparkles className="w-8 h-8 text-purple-400 drop-shadow-glow ml-4" />
      </motion.div>

      {/* Subtitle / Intro */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1.2 }}
        className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        Advanced AI-powered exoplanet detection system using machine learning to analyze 
        light curves and identify potential worlds beyond our solar system.
      </motion.p>

      {/* Challenge Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="mt-8 inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full border border-purple-400/40 shadow-lg backdrop-blur-md"
      >
        <Rocket className="w-5 h-5 text-cyan-300 mr-2" />
        <span className="text-sm md:text-base text-purple-200 font-medium tracking-wide">
          NASA Space Apps Challenge 2025
        </span>
      </motion.div>
    </motion.header>
  );
};

export default Header;
