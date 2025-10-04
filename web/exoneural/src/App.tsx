import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Home, Map, Globe, BookOpen, Rocket, Loader2 } from "lucide-react";

import SpaceBackground from "./components/SpaceBackground";
import Header from "./components/Header";
import PredictionForm from "./components/PredictionForm";
import ResultsCard from "./components/ResultsCard";
import LightCurveChart from "./components/LightCurveChart";
import Footer from "./components/Footer";
import MissionBriefing from "./components/MissionBriefing";
import CaptainMessage from "./components/CaptainMessage";
import IntroSequence from "./components/IntroSequence";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load heavy components
const TeamPage = lazy(() => import("./components/TeamPage"));
const GalaxyMap = lazy(() => import("./components/GalaxyMap"));
const PlanetAnalysis = lazy(() => import("./components/PlanetAnalysis"));
const MissionLogbook = lazy(() => import("./components/MissionLogbook"));

// API Configuration
const API_BASE_URL = "https://exoneural-backend-repo-b2x7.onrender.com";


interface PredictionResult {
  prediction: string;
  confidence: number;
  status?: string;
  error?: string;
}

interface Planet {
  id: string;
  name: string;
  mass: number;
  radius: number;
  orbitalPeriod: number;
  distance: number;
  equilibriumTemp: number;
  stellarTemp: number;
  stellarRadius: number;
  detectionConfidence: number; // AI model confidence score
  // UPDATED: Now uses the model's direct prediction
  classification: 'confirmed' | 'candidate' | 'false-positive'; 
  discoveryDate: string;
  notes?: string;
  inputData?: any; // Store original input for reference
  rawPrediction?: string; // NEW: Store raw string from API
  probabilities?: any; // NEW: Store raw probabilities object/array from API
}

function App() {
  // AUDIO SETUP
  const audioRef = useRef<HTMLAudioElement>(null); // Ref for the audio element
  const [audioPlaying, setAudioPlaying] = useState(false); // State to track playback

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);

  // Navigation state
  const [currentPage, setCurrentPage] = useState<
    "intro" | "briefing" | "home" | "map" | "analysis" | "logbook" | "team"
  >("intro");

  // Planet discovery state
  const [discoveredPlanets, setDiscoveredPlanets] = useState<Planet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  // Function to handle user interaction for audio playback
  const handleUserInteraction = () => {
    if (audioRef.current && !audioPlaying) {
      audioRef.current.play().then(() => {
        setAudioPlaying(true);
      }).catch(e => {
        console.log("Autoplay blocked. User interaction required:", e);
        // Optionally, you could show a visible "Play Music" button here
      });
    }
    // Remove the event listener after the first interaction
    document.removeEventListener('click', handleUserInteraction);
  };
  
  // Add listener to attempt playback on first interaction (e.g., click)
  useEffect(() => {
    document.addEventListener('click', handleUserInteraction);
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);
  
  // Handle showing the Captain's message (remains the same)
  useEffect(() => {
    if (result && !result.error && result.confidence > 0) {
      setShowMessage(true);
    }
  }, [result]);

  // Generate a planet name (remains the same)
  const generatePlanetName = (index: number) => {
    const prefixes = ['Kepler', 'TRAPPIST', 'Proxima', 'TOI', 'HD', 'WASP', 'HAT-P', 'K2', 'EPIC'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = 1000 + index + Math.floor(Math.random() * 9000);
    const suffix = String.fromCharCode(98 + Math.floor(Math.random() * 8)); // b-i
    return `${prefix}-${number}${suffix}`;
  };

  // Map model prediction directly to classification
  const classifyPlanet = (prediction: string): 'confirmed' | 'candidate' | 'false-positive' => {
    const pred = prediction.toLowerCase();
    if (pred.includes('confirmed')) return 'confirmed';
    if (pred.includes('candidate')) return 'candidate';
    return 'false-positive';
  };

  // Get classification label (UPDATED to match new classifications)
  const getClassificationLabel = (classification: string): string => {
    switch (classification) {
      case 'confirmed': return 'Confirmed Exoplanet';
      case 'candidate': return 'Candidate World';
      case 'false-positive': return 'False Positive Signal';
      default: return 'Unknown';
    }
  };

  const handlePredict = async (data: any) => {
    setLoading(true);
    setError(null);
    setShowMessage(false);

    try {
      // Logic simplified to only handle single /predict request
      const response = await axios.post(`${API_BASE_URL}/predict`, data);
      const predictionData = response.data;

      setResult(predictionData);
      if (predictionData && predictionData.confidence !== undefined && !predictionData.error) {
        const classification = classifyPlanet(predictionData.prediction);

        // Planet data fields are updated to use Kepler/Exoplanet Archive keys
        const newPlanet: Planet = {
          id: `planet-${Date.now()}`,
          name: generatePlanetName(discoveredPlanets.length),
          mass: parseFloat(data.koi_prad) || 1.0, 
          radius: parseFloat(data.koi_prad) || 1.0, 
          orbitalPeriod: parseFloat(data.koi_period) || 365,
          distance: parseFloat(data.koi_sma) || 1.0,
          equilibriumTemp: parseFloat(data.koi_teq) || 288,
          stellarTemp: parseFloat(data.koi_steff) || 5778,
          stellarRadius: parseFloat(data.koi_srad) || 1.0,
          detectionConfidence: predictionData.confidence,
          classification: classification,
          discoveryDate: new Date().toISOString(),
          notes: "",
          inputData: data,
          rawPrediction: predictionData.prediction,
          probabilities: predictionData.probabilities
        };

        setDiscoveredPlanets(prev => [...prev, newPlanet]);
        setSelectedPlanet(newPlanet);
      }
    } catch (err: any) {
      console.error("Prediction error:", err);

      let errorMessage = "Unexpected error occurred";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.code === "ECONNREFUSED" || err.message.includes("Network Error")) {
        errorMessage = "Cannot connect to backend. Ensure Flask server is running on port 5000.";
      }
      setError(errorMessage);
      setResult({
        prediction: "Error",
        confidence: 0,
        error: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Page transition handlers (remain the same)
  const handleCompleteIntro = () => {
    setCurrentPage("briefing");
  };
  
  const handleCompleteBriefing = () => {
    setCurrentPage("home");
  };

  const handleViewInMap = () => {
    setCurrentPage("map");
    setShowMessage(false);
  };
  
  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  const handleSelectPlanet = (planet: Planet) => {
    setSelectedPlanet(planet);
    setCurrentPage("analysis");
  };

  // Keeping original function name for component compatibility
  const handleUpdatePlanetNotes = (planetId: string, notes: string) => {
    setDiscoveredPlanets(prev =>
      prev.map(p => p.id === planetId ? { ...p, notes } : p)
    );
  };

  // Calculate statistics (UPDATED to use new classifications)
  const stats = {
    total: discoveredPlanets.length,
    confirmed: discoveredPlanets.filter(p => p.classification === 'confirmed').length,
    candidate: discoveredPlanets.filter(p => p.classification === 'candidate').length,
    falsePositive: discoveredPlanets.filter(p => p.classification === 'false-positive').length,
    avgConfidence: discoveredPlanets.length > 0
      ? (discoveredPlanets.reduce((s, p) => s + p.detectionConfidence, 0) / discoveredPlanets.length * 100).toFixed(1)
      : '0.0'
  };


  return (
    <div className="min-h-screen relative overflow-hidden">
        {/* BACKGROUND AUDIO ELEMENT */}
        <audio 
          ref={audioRef} 
          src="/ambient-loop.mp3" // <--- CHANGE THIS PATH TO YOUR AUDIO FILE NAME
          loop 
          volume={0.4} // Set volume lower so it doesn't distract
          preload="auto"
        />
        
      <SpaceBackground />

      {/* Navigation - Only show after briefing and intro */}
      {currentPage !== "briefing" && currentPage !== "intro" && (
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 p-4"
        >
          <div className="max-w-7xl mx-auto flex justify-center">
            <div className="bg-gray-900/50 backdrop-blur-lg rounded-full border border-purple-500/30 p-2">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === "home"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Detection
                </button>

                <button
                  onClick={() => setCurrentPage("map")}
                  disabled={discoveredPlanets.length === 0}
                  className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === "map"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50"
                      : discoveredPlanets.length === 0
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Galaxy Map
                  {discoveredPlanets.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full">
                      {discoveredPlanets.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCurrentPage("analysis")}
                  disabled={discoveredPlanets.length === 0}
                  className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === "analysis"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50"
                      : discoveredPlanets.length === 0
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Analysis
                </button>

                <button
                  onClick={() => setCurrentPage("logbook")}
                  disabled={discoveredPlanets.length === 0}
                  className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === "logbook"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50"
                      : discoveredPlanets.length === 0
                      ? "text-gray-600 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Logbook
                </button>

                <button
                  onClick={() => setCurrentPage("team")}
                  className={`flex items-center px-6 py-2 rounded-full transition-all duration-300 ${
                    currentPage === "team"
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Team
                </button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Main Pages */}
      <div className="relative z-10 min-h-screen">
        {currentPage === "intro" && (
          <IntroSequence onComplete={handleCompleteIntro} />
        )}

        {currentPage === "briefing" && (
          <MissionBriefing onComplete={handleCompleteBriefing} />
        )}

        {currentPage === "home" && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Header />

            {/* Discovery Stats Banner - UPDATED JSX */}
            {discoveredPlanets.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 backdrop-blur-lg border border-cyan-500/30 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                      ExoNeural Detection Progress
                    </h3>
                    <p className="text-slate-300 text-sm mt-1">
                      {stats.total} exoplanet{stats.total !== 1 ? 's' : ''} detected • Avg Confidence: {stats.avgConfidence}%
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {/* Confirmed */}
                    <div className="text-center px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                      <div className="text-2xl font-bold text-green-400">
                        {stats.confirmed}
                      </div>
                      <div className="text-xs text-slate-400">Confirmed</div>
                      <div className="text-xs text-green-400">Target</div>
                    </div>
                    {/* Candidate */}
                    <div className="text-center px-4 py-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <div className="text-2xl font-bold text-yellow-400">
                        {stats.candidate}
                      </div>
                      <div className="text-xs text-slate-400">Candidates</div>
                      <div className="text-xs text-yellow-400">Priority</div>
                    </div>
                    {/* False Positive */}
                    <div className="text-center px-4 py-2 bg-red-500/20 rounded-lg border border-red-500/30">
                      <div className="text-2xl font-bold text-red-400">
                        {stats.falsePositive}
                      </div>
                      <div className="text-xs text-slate-400">False Positive</div>
                      <div className="text-xs text-red-400">Discarded</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-center"
              >
                <p className="font-medium">Connection Error</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-xs mt-2 text-red-300">
                  Make sure to start the Flask backend:{" "}
                  <code>cd backend && python app.py</code>
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <PredictionForm onPredict={handlePredict} loading={loading} />
              <ResultsCard 
                result={result} 
                loading={loading} 
                onViewInMap={handleViewInMap}
              />
            </div>

            <LightCurveChart />

            <Footer />
          </div>
        )}

        {currentPage === "map" && (
          <Suspense fallback={<LoadingSpinner message="Loading Galaxy Map..." size="lg" />}>
            <GalaxyMap 
              planets={discoveredPlanets} 
              onSelectPlanet={handleSelectPlanet}
            />
          </Suspense>
        )}

        {currentPage === "analysis" && (
          <Suspense fallback={<LoadingSpinner message="Loading Analysis Dashboard..." size="lg" />}>
            <PlanetAnalysis 
              planets={discoveredPlanets}
              onSelectPlanet={handleSelectPlanet}
            />
          </Suspense>
        )}

        {currentPage === "logbook" && (
          <Suspense fallback={<LoadingSpinner message="Loading Mission Logbook..." size="lg" />}>
            <MissionLogbook
              planets={discoveredPlanets}
              onSelectPlanet={handleSelectPlanet}
              onUpdateNotes={handleUpdatePlanetNotes}
            />
          </Suspense>
        )}

        {currentPage === "team" && (
          <Suspense fallback={<LoadingSpinner message="Loading Team Page..." size="lg" />}>
            <TeamPage />
          </Suspense>
        )}
      </div>
      
      {/* CAPTAIN MESSAGE POP-UP */}
      <AnimatePresence>
        {showMessage && result && (
          <CaptainMessage
            prediction={result.prediction}
            confidence={result.confidence}
            onClose={handleCloseMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;