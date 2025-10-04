import React from 'react';
import { motion } from 'framer-motion';

const SpaceBackground: React.FC = () => {
  // Generate random stars
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.8 + 0.2,
    animationDelay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/232205_medium.mp4"   // 🔑 put `space.mp4` in your `public/` folder
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/70 via-purple-950/60 to-black/90" />

      {/* Earth image */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30">
        <img 
          src="/earth.png"   // 🔑 also move this to `public/earth.png`
          alt="Earth from space"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      
      {/* Animated stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.animationDelay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Floating planets */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full opacity-60"
        animate={{ y: [0, -20, 0], rotate: [0, 360] }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      />
      
      <motion.div
        className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full opacity-50"
        animate={{ y: [0, 15, 0], rotate: [0, -360] }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-1/4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-40"
        animate={{ y: [0, -10, 0], x: [0, 10, 0], rotate: [0, 360] }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
        }}
      />
      
      {/* Nebula effect */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-500 rounded-full opacity-10 blur-2xl" />
      </div>
    </div>
  );
};

export default SpaceBackground;
