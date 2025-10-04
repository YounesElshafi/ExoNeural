import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

export default function CinematicIntro({ onComplete }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true); // Audio ON by default
  const [skipIntro, setSkipIntro] = useState(false);

  // Ref for the single background audio element
  const backgroundAudioRef = useRef(null);

  // Path to your single background audio file (should contain all voice-overs and music)
  // NOTE: For this to work in your environment, you must ensure this path is valid.
  const backgroundAudioPath = '/sounds/space-ambient.mp3';


  const scenes = [
    {
      id: 0,
      duration: 6000, // Duration for this visual scene
      text: "This is ExoNeural...",
      subtext: "a mission born from curiosity and powered by NASA's open data",
      visual: 'galaxy-zoom'
    },
    {
      id: 1,
      duration: 7000, // Duration for this visual scene
      text: "For decades, telescopes like Kepler, K2, and TESS have scanned the skies...",
      subtext: "collecting light curves — the tiny dips of starlight that reveal hidden worlds",
      visual: 'constellations'
    },
    {
      id: 2,
      duration: 6000, // Duration for this visual scene
      text: "But inside this data, thousands of planets remain undiscovered.",
      subtext: "Worlds orbiting distant suns, waiting for explorers to find them",
      visual: 'light-curve'
    },
    {
      id: 3,
      duration: 7000, // Duration for this visual scene
      text: "What if YOU could be the next planet discoverer?",
      subtext: "Not a scientist in a lab... not an astronaut in space... but right here, through our app",
      visual: 'mission-patch'
    },
    {
      id: 4,
      duration: 6000, // Duration for this visual scene
     
      visual: 'app-reveal'
    }
  ];

  // Effect for scene progression
  useEffect(() => {
    if (skipIntro) {
      if (backgroundAudioRef.current) backgroundAudioRef.current.pause(); // Stop audio on skip
      onComplete();
      return;
    }

    let timer: NodeJS.Timeout;
    if (currentScene < scenes.length - 1) {
      timer = setTimeout(() => {
        setCurrentScene(currentScene + 1);
      }, scenes[currentScene].duration);
    } else {
      // Last scene, wait for its duration, then complete.
      timer = setTimeout(() => {
        onComplete();
      }, scenes[currentScene].duration);
    }

    return () => clearTimeout(timer);
  }, [currentScene, skipIntro, onComplete, scenes]);


  // Effect for managing the single background audio (initial load and toggling)
  useEffect(() => {
    const audio = backgroundAudioRef.current;

    if (!audio) return;

    // 1. Setup Source and Volume
    audio.src = backgroundAudioPath;
    audio.loop = false;
    audio.volume = 1.0;

    // 2. Setup End Listener
    // Ensure cleanup of the old listener before setting a new one
    audio.onended = () => {
      console.log("Full intro audio ended. Completing intro.");
      onComplete();
    };

    // 3. Playback Logic
    if (audioEnabled) {
      // Since audioEnabled is true by default, this attempts to play on mount.
      // If blocked by Autoplay Policy, the console warning will appear,
      // and the user must click the VolumeX icon to start playback.
      audio.play().catch(e => {
        console.warn("Background audio failed to play automatically (Autoplay policy blocked it). User interaction required to enable sound.", e);
      });
    } else {
      // Pause if the user toggles the audio off.
      audio.pause();
    }

    // Cleanup: pause audio and remove the onended listener when the component unmounts
    return () => {
      if (audio) {
        audio.pause();
        audio.onended = null;
      }
    };
  }, [audioEnabled, backgroundAudioPath, onComplete]); // Dependencies for the background audio effect


  const handleSkip = () => {
    setSkipIntro(true);
    // The main useEffect will handle calling onComplete and stopping audio
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => !prev);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* Hidden audio element for the full background track */}
      <audio ref={backgroundAudioRef} preload="auto" />

      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Deep Space Starfield */}
        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
              }}
            />
          ))}
        </div>

        {/* Scene-Specific Visuals */}
        <AnimatePresence mode="wait">
          {currentScene === 0 && (
            <motion.div
              key="galaxy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.3 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-[800px] h-[800px] rounded-full bg-gradient-radial from-purple-500/30 via-blue-500/20 to-transparent blur-3xl animate-pulse" />
            </motion.div>
          )}

          {currentScene === 1 && (
            <motion.div
              key="constellations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Constellation Lines */}
              {[...Array(8)].map((_, i) => (
                <svg key={i} className="absolute inset-0 w-full h-full">
                  <motion.line
                    x1={`${20 + i * 12}%`}
                    y1={`${30 + i * 8}%`}
                    x2={`${25 + i * 12}%`}
                    y2={`${40 + i * 7}%`}
                    stroke="rgba(139, 92, 246, 0.5)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.3 }}
                  />
                </svg>
              ))}
            </motion.div>
          )}

          {currentScene === 2 && (
            <motion.div
              key="light-curve"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative w-[600px] h-[300px]">
               
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-cyan-400 text-sm"
                >
                  Transit Detection
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentScene === 3 && (
            <motion.div
              key="mission-patch"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                
                {/* Orbital Rings */}
                <motion.div
                  className="absolute inset-0 border-2 border-purple-500/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ scale: 1.2 }}
                />
                <motion.div
                  className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  style={{ scale: 1.4 }}
                />
              </div>
            </motion.div>
          )}

          {currentScene === 4 && (
            <motion.div
              key="app-reveal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                    ExoNeural
                  </h2>
                  <p className="text-xl text-cyan-300 mb-2">Transforming NASA's Data Into Discoveries</p>
                  <p className="text-lg text-slate-400">One star at a time</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                  className="flex gap-4 justify-center"
                >
                  <div className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400">
                    <div className="text-2xl font-bold">Kepler</div>
                    <div className="text-xs">Mission Data</div>
                  </div>
                  <div className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400">
                    <div className="text-2xl font-bold">K2</div>
                    <div className="text-xs">Extended Mission</div>
                  </div>
                  <div className="px-6 py-3 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400">
                    <div className="text-2xl font-bold">TESS</div>
                    <div className="text-xs">All-Sky Survey</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Text Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="max-w-4xl px-8 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-relaxed">
                {scenes[currentScene].text}
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 font-light italic leading-relaxed">
                {scenes[currentScene].subtext}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3">
        {scenes.map((scene, index) => (
          <div
            key={scene.id}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentScene
                ? 'w-16 bg-cyan-400'
                : index < currentScene
                ? 'w-8 bg-cyan-600'
                : 'w-8 bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="absolute top-8 right-8 flex gap-4">
        {/* Audio Toggle */}
        <button
          onClick={toggleAudio}
          className="p-3 bg-slate-900/50 backdrop-blur-xl rounded-lg border border-slate-700 hover:border-cyan-500 transition-all"
        >
          {audioEnabled ? (
            <Volume2 className="w-5 h-5 text-cyan-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="px-6 py-3 bg-slate-900/50 backdrop-blur-xl rounded-lg border border-slate-700 hover:border-cyan-500 text-cyan-400 hover:text-cyan-300 transition-all font-semibold"
        >
          Skip Intro →
        </button>
      </div>

      {/* Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radio Static Effect */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-white to-transparent animate-pulse"
            style={{
              backgroundSize: '100% 20px',
              animation: 'scan 3s linear infinite'
            }} />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-60" />
      </div>

      {/* NASA Attribution */}
      <div className="absolute bottom-8 left-8 text-slate-500 text-sm">
        <p>Powered by NASA Open Data</p>
        <p className="text-xs mt-1">Kepler • K2 • TESS Missions</p>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
