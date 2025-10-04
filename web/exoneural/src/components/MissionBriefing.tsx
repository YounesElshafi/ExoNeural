import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Target, Telescope, Users, ChevronRight, Play } from 'lucide-react';

interface MissionBriefingProps {
  onComplete: () => void;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const briefingSlides = [
    {
      icon: <Rocket className="w-16 h-16 text-cyan-400" />,
      title: "Mission Briefing",
      subtitle: "Captain, Welcome to ExoNeural Command",
      content: "You are the captain of an advanced interstellar exploration vessel. Your mission: discover and catalog potentially habitable exoplanets using our state-of-the-art AI detection system.",
      color: "from-cyan-600/20 to-blue-600/20 border-cyan-500/30"
    },
    {
      icon: <Target className="w-16 h-16 text-purple-400" />,
      title: "Mission Objectives",
      subtitle: "Primary Directives",
      content: "Utilize the ExoNeural AI system to analyze stellar light curves and identify exoplanet candidates. Each successful detection brings us closer to finding humanity's next home among the stars.",
      color: "from-purple-600/20 to-pink-600/20 border-purple-500/30"
    },
    {
      icon: <Telescope className="w-16 h-16 text-green-400" />,
      title: "Equipment Status",
      subtitle: "AI Detection Array Online",
      content: "Your ship is equipped with the most advanced exoplanet detection AI ever created. Input orbital parameters, and the system will determine habitability potential with unprecedented accuracy.",
      color: "from-green-600/20 to-emerald-600/20 border-green-500/30"
    },
    {
      icon: <Users className="w-16 h-16 text-orange-400" />,
      title: "Crew Manifest",
      subtitle: "ExoNeural Team Ready",
      content: "Your expert crew of 5 specialists stands ready: ML engineers, data scientists, and researchers working together to advance humanity's reach into the cosmos.",
      color: "from-orange-600/20 to-red-600/20 border-orange-500/30"
    }
  ];

  useEffect(() => {
    if (isAutoPlaying && currentSlide < briefingSlides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide, isAutoPlaying, briefingSlides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    if (currentSlide < briefingSlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Stars */}
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Holographic Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              ExoNeural Command
            </h1>
            <p className="text-xl text-gray-300">
              Interstellar Exploration Mission Briefing
            </p>
          </motion.div>

          {/* Briefing Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -15 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`bg-gradient-to-br ${briefingSlides[currentSlide].color} backdrop-blur-lg rounded-2xl p-12 border shadow-2xl`}
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-6"
                >
                  {briefingSlides[currentSlide].icon}
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-2">
                  {briefingSlides[currentSlide].title}
                </h2>
                
                <h3 className="text-xl text-gray-300 mb-6">
                  {briefingSlides[currentSlide].subtitle}
                </h3>
                
                <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
                  {briefingSlides[currentSlide].content}
                </p>
              </div>

              {/* Progress Indicators */}
              <div className="flex justify-center space-x-3 mb-8">
                {briefingSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSlide(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-cyan-400 scale-125'
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="flex items-center px-6 py-3 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {currentSlide === briefingSlides.length - 1 ? (
                  <motion.button
                    onClick={onComplete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Begin Mission
                  </motion.button>
                ) : (
                  <button
                    onClick={nextSlide}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                  >
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Auto-play indicator */}
          {isAutoPlaying && currentSlide < briefingSlides.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6"
            >
              <p className="text-gray-400 text-sm">
                Auto-advancing in {4 - (Date.now() % 4000) / 1000 | 0} seconds...
              </p>
              <button
                onClick={() => setIsAutoPlaying(false)}
                className="text-cyan-400 hover:text-cyan-300 text-sm underline mt-1"
              >
                Stop auto-play
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionBriefing;