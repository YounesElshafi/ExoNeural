import { useState } from 'react';
import { Activity, Droplet, Wind, Zap, ChevronLeft, ChevronRight, Globe, TrendingUp, AlertTriangle, CheckCircle, Menu } from 'lucide-react';

export default function PlanetAnalysis({ planets = [], onSelectPlanet }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (planets.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔭</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Exoplanets Detected</h2>
          <p className="text-slate-400">Use the Detection interface to analyze stellar data and discover new worlds</p>
        </div>
      </div>
    );
  }

  const planet = planets[currentIndex];

  const nextPlanet = () => {
    setCurrentIndex((currentIndex + 1) % planets.length);
  };

  const prevPlanet = () => {
    setCurrentIndex((currentIndex - 1 + planets.length) % planets.length);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'science', label: 'Scientific Data', icon: Zap },
    { id: 'analysis', label: 'AI Analysis', icon: Wind }
  ];

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'confirmed': return 'from-green-400 to-cyan-400';
      case 'candidate': return 'from-yellow-400 to-orange-400';
      case 'false-positive': return 'from-red-400 to-pink-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  const getClassificationBadge = (classification) => {
    switch (classification) {
      case 'confirmed':
        return { icon: CheckCircle, label: 'Confirmed Exoplanet', color: 'green' };
      case 'candidate':
        return { icon: Activity, label: 'Candidate Exoplanet', color: 'yellow' };
      case 'false-positive':
        return { icon: AlertTriangle, label: 'False Positive', color: 'red' };
      default:
        return { icon: Globe, label: 'Unknown', color: 'gray' };
    }
  };

  const getPlanetType = () => {
    if (planet.mass > 100) return 'Gas Giant';
    if (planet.mass > 10) return 'Ice Giant';
    if (planet.mass > 2) return 'Super-Earth';
    return 'Terrestrial';
  };

  const badge = getClassificationBadge(planet.classification);
  const BadgeIcon = badge.icon;

  return (
    <div className="h-screen flex bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden">
      
      <div className="flex-1 relative flex items-center justify-center overflow-hidden w-full">
        
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 right-4 z-40 p-3 bg-cyan-500/20 backdrop-blur-xl rounded-full border border-cyan-500/30 text-cyan-400 sm:hidden hover:bg-cyan-500/30 transition-colors shadow-lg"
          aria-label="Open data panel"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: 0.3 + Math.random() * 0.5,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="absolute top-10 w-full text-center z-20 px-4">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            {planet.name}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-cyan-400 text-sm">{getPlanetType()}</span>
            <span className="text-slate-500">•</span>
            <span className={`text-sm font-semibold text-${badge.color}-400`}>
              {badge.label}
            </span>
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            <div 
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${getClassificationColor(planet.classification)} shadow-2xl animate-spin-slow`}
              style={{
                boxShadow: `0 0 80px 20px ${
                  planet.classification === 'confirmed' ? '#10b98140' :
                  planet.classification === 'candidate' ? '#eab30840' : '#ef444440'
                }`
              }}
            >
              <div className="absolute inset-0 rounded-full opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
              }} />
            </div>

            {planet.classification === 'confirmed' && (
              <div className="absolute -inset-4 rounded-full bg-green-400 opacity-20 blur-2xl animate-pulse" />
            )}

            {planet.mass > 50 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-12">
                <div className="w-full h-full rounded-full border-8 border-purple-500 opacity-60 animate-spin-slow" style={{
                  transform: 'perspective(500px) rotateX(75deg)',
                  borderStyle: 'solid',
                  borderTopColor: 'transparent',
                  borderBottomColor: 'transparent'
                }} />
              </div>
            )}
          </div>

          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className={`bg-gradient-to-r ${getClassificationColor(planet.classification)} p-4 rounded-xl shadow-2xl`}>
              <div className="bg-slate-900 rounded-lg px-6 py-3">
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">AI Detection Confidence</div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {(planet.detectionConfidence * 100).toFixed(1)}%
                  </div>
                  <div className={`text-xs text-${badge.color}-400 font-semibold`}>
                    {badge.label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={prevPlanet}
          disabled={planets.length <= 1}
          className="absolute left-4 sm:left-8 p-4 bg-slate-900/80 backdrop-blur-xl rounded-full border border-cyan-500/30 hover:bg-cyan-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-30"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </button>
        <button
          onClick={nextPlanet}
          disabled={planets.length <= 1}
          className="absolute right-4 sm:right-8 p-4 bg-slate-900/80 backdrop-blur-xl rounded-full border border-cyan-500/30 hover:bg-cyan-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-30"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl rounded-full px-6 py-2 border border-cyan-500/30">
          <span className="text-white font-semibold">
            {currentIndex + 1} / {planets.length}
          </span>
        </div>
      </div>

      <div
        className={`
          w-[500px] bg-slate-900/95 backdrop-blur-xl border-l border-cyan-500/30 flex flex-col
          fixed top-0 right-0 h-screen w-full z-50 transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          sm:relative sm:translate-x-0 sm:w-[500px] sm:max-w-[500px] sm:h-auto
        `}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 left-4 p-2 bg-slate-800/80 rounded-full text-white sm:hidden z-50 hover:bg-slate-700/80 transition-colors shadow-lg"
          aria-label="Close data panel"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex border-b border-slate-700 mt-16 sm:mt-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 border-b-2 border-cyan-400 text-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Mission Recommendation Block (Part 1 - Initial Code) */}
              <div className={`bg-gradient-to-br p-1 rounded-lg`}
                style={{
                  background: `linear-gradient(135deg, ${
                    planet.classification === 'confirmed' ? '#10b98140' :
                    planet.classification === 'candidate' ? '#eab30840' : '#ef444440'
                  }, transparent)`
                }}>
                <div className="bg-slate-900 rounded-lg p-5">
                  <h4 className="text-lg font-semibold mb-2"
                    style={{
                      color: planet.classification === 'confirmed' ? '#10b981' :
                             planet.classification === 'candidate' ? '#eab308' : '#ef4444'
                    }}>
                    Mission Recommendation
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {planet.classification === 'confirmed' ? (
                      `Priority Target: With ${(planet.detectionConfidence * 100).toFixed(1)}% confidence, ${planet.name} is confirmed as an exoplanet. This detection is suitable for follow-up spectroscopic analysis to characterize atmospheric composition and refine physical parameters.`
                    ) : planet.classification === 'candidate' ? (
                      `Further Investigation: Candidate status with ${(planet.detectionConfidence * 100).toFixed(1)}% confidence warrants additional observational campaigns. Schedule follow-up measurements to confirm planetary nature and rule out false positive scenarios.`
                    ) : (
                      `Scientific Archive: Classification as false positive (${(planet.detectionConfidence * 100).toFixed(1)}% confidence) suggests this signal does not represent a planetary transit. Useful for training machine learning models and understanding instrumental systematics.`
                    )}
                  </p>
                </div>
              </div>
                
              {/* Classification Summary (Part 2 - Incomplete/Misplaced Code) */}
              <div className={`bg-gradient-to-br ${getClassificationColor(planet.classification)} p-1 rounded-xl`}>
                <div className="bg-slate-900 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BadgeIcon className={`w-8 h-8 text-${badge.color}-400`} />
                    <div>
                      <h3 className="text-lg font-bold text-white">{badge.label}</h3>
                      <p className="text-xs text-slate-400">Classification from ExoNeural AI</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Detection Score</span>
                      <span className={`text-${badge.color}-400 font-bold`}>
                        {(planet.detectionConfidence * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getClassificationColor(planet.classification)}`}
                        style={{ width: `${planet.detectionConfidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {planet.classification === 'confirmed' && 
                      'AI model has confirmed this as a genuine exoplanet with high confidence. This detection warrants immediate follow-up observation.'}
                    {planet.classification === 'candidate' &&
                      'Classified as a candidate exoplanet. Additional observations needed to confirm planetary status.'}
                    {planet.classification === 'false-positive' &&
                      'Signal classified as a false positive. Likely caused by stellar activity or instrumental artifacts rather than a planetary transit.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Mass</div>
                  <div className="text-xl font-bold text-white">{planet.mass.toFixed(2)}</div>
                  <div className="text-xs text-cyan-400">Earth Masses (M⊕)</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Radius</div>
                  <div className="text-xl font-bold text-white">{planet.radius.toFixed(2)}</div>
                  <div className="text-xs text-cyan-400">Earth Radii (R⊕)</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Orbital Period</div>
                  <div className="text-xl font-bold text-white">{planet.orbitalPeriod.toFixed(1)}</div>
                  <div className="text-xs text-cyan-400">Days</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Temperature</div>
                  <div className="text-xl font-bold text-white">{planet.equilibriumTemp.toFixed(0)}</div>
                  <div className="text-xs text-cyan-400">Kelvin</div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-sm font-semibold text-white mb-3">Classification Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Model Confidence:</span>
                    <span className="font-bold" style={{
                      color: planet.classification === 'confirmed' ? '#10b981' :
                             planet.classification === 'candidate' ? '#eab308' : '#ef4444'
                    }}>
                      {(planet.detectionConfidence * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Classification:</span>
                    <span className="font-bold" style={{
                      color: planet.classification === 'confirmed' ? '#10b981' :
                             planet.classification === 'candidate' ? '#eab308' : '#ef4444'
                    }}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white font-semibold">{getPlanetType()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance from Star:</span>
                    <span className="text-white font-semibold">{planet.distance.toFixed(3)} AU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Discovery Date:</span>
                    <span className="text-white font-semibold">
                      {new Date(planet.discoveryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-lg font-bold text-purple-400 mb-3">Host Star Parameters</h4>
                <div className="space-y-3">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Stellar Temperature</span>
                      <span className="text-white font-semibold">{planet.stellarTemp} K</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Stellar Radius</span>
                      <span className="text-white font-semibold">{planet.stellarRadius.toFixed(2)} R☉</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Stellar Type</span>
                      <span className="text-white font-semibold">
                        {planet.stellarTemp > 10000 ? 'O/B (Blue)' :
                         planet.stellarTemp > 7500 ? 'A (White)' :
                         planet.stellarTemp > 6000 ? 'F (Yellow-White)' :
                         planet.stellarTemp > 5200 ? 'G (Yellow)' :
                         planet.stellarTemp > 3700 ? 'K (Orange)' : 'M (Red)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'science' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Scientific Parameters</h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Planetary Mass', value: `${planet.mass.toFixed(4)} M⊕`, icon: Activity },
                  { label: 'Planetary Radius', value: `${planet.radius.toFixed(4)} R⊕`, icon: Globe },
                  { label: 'Bulk Density', value: `${(planet.mass / Math.pow(planet.radius, 3)).toFixed(2)} g/cm³`, icon: Zap },
                  { label: 'Surface Gravity', value: `${(planet.mass / Math.pow(planet.radius, 2)).toFixed(2)} g`, icon: Activity },
                  { label: 'Orbital Period', value: `${planet.orbitalPeriod.toFixed(2)} days`, icon: Wind },
                  { label: 'Semi-Major Axis', value: `${planet.distance.toFixed(4)} AU`, icon: Globe },
                  { label: 'Equilibrium Temperature', value: `${planet.equilibriumTemp.toFixed(1)} K (${(planet.equilibriumTemp - 273.15).toFixed(1)} °C)`, icon: Zap }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-slate-400 text-sm">{item.label}</span>
                        </div>
                        <span className="text-white font-semibold text-sm">{item.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 rounded-lg border bg-gradient-to-br"
                style={{
                  background: `linear-gradient(135deg, ${
                    planet.classification === 'confirmed' ? '#10b98120' :
                    planet.classification === 'candidate' ? '#eab30820' : '#ef444420'
                  }, transparent)`,
                  borderColor: planet.classification === 'confirmed' ? '#10b981' :
                               planet.classification === 'candidate' ? '#eab308' : '#ef4444'
                }}>
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  AI Detection Metrics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Model Version:</span>
                    <span className="text-white font-semibold">ExoNeural v2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Algorithm:</span>
                    <span className="text-white font-semibold">LightGBM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Classification:</span>
                    <span className="text-white font-semibold">{badge.label}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">ExoNeural AI Analysis</h3>
              
              <div className={`bg-gradient-to-br p-1 rounded-lg`}
                style={{
                  background: `linear-gradient(135deg, ${
                    planet.classification === 'confirmed' ? '#10b98140' :
                    planet.classification === 'candidate' ? '#eab30840' : '#ef444440'
                  }, transparent)`
                }}>
                <div className="bg-slate-900 rounded-lg p-5">
                  <h4 className="text-lg font-semibold mb-3 flex items-center gap-2"
                    style={{
                      color: planet.classification === 'confirmed' ? '#10b981' :
                             planet.classification === 'candidate' ? '#eab308' : '#ef4444'
                    }}>
                    <TrendingUp className="w-5 h-5" />
                    Detection Confidence Analysis
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {planet.classification === 'confirmed' ? (
                      `The ExoNeural AI model has classified ${planet.name} as a CONFIRMED EXOPLANET with ${(planet.detectionConfidence * 100).toFixed(1)}% confidence. This high confidence score indicates strong evidence that the observed signal is caused by a genuine planetary transit. The combination of orbital parameters, transit depth, and stellar characteristics all support the planetary hypothesis.`
                    ) : planet.classification === 'candidate' ? (
                      `${planet.name} has been classified as a CANDIDATE EXOPLANET with ${(planet.detectionConfidence * 100).toFixed(1)}% confidence. While the signal shows promising characteristics consistent with a planetary transit, additional observations are recommended to rule out false positive scenarios such as eclipsing binaries or background objects.`
                    ) : (
                      `The AI model has classified this signal as a FALSE POSITIVE with ${(planet.detectionConfidence * 100).toFixed(1)}% confidence. The observed characteristics suggest this is likely not a genuine planetary transit. Possible explanations include stellar variability, instrumental artifacts, or contamination from nearby stars. This classification helps filter out non-planetary signals in large survey datasets.`
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Classification System
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: planet.classification === 'confirmed' ? '#10b98120' : '#1f293720',
                          borderLeft: `4px solid ${planet.classification === 'confirmed' ? '#10b981' : '#475569'}`
                        }}>
                    <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${planet.classification === 'confirmed' ? 'text-green-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="font-semibold text-white">Confirmed Exoplanet</div>
                      <div className="text-slate-400 text-xs mt-1">High confidence detection of genuine planetary transit</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: planet.classification === 'candidate' ? '#eab30820' : '#1f293720',
                          borderLeft: `4px solid ${planet.classification === 'candidate' ? '#eab308' : '#475569'}`
                        }}>
                    <Activity className={`w-5 h-5 mt-0.5 flex-shrink-0 ${planet.classification === 'candidate' ? 'text-yellow-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="font-semibold text-white">Candidate Exoplanet</div>
                      <div className="text-slate-400 text-xs mt-1">Requires additional observation for confirmation</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg"
                        style={{
                          backgroundColor: planet.classification === 'false-positive' ? '#ef444420' : '#1f293720',
                          borderLeft: `4px solid ${planet.classification === 'false-positive' ? '#ef4444' : '#475569'}`
                        }}>
                    <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${planet.classification === 'false-positive' ? 'text-red-400' : 'text-slate-600'}`} />
                    <div>
                      <div className="font-semibold text-white">False Positive</div>
                      <div className="text-slate-400 text-xs mt-1">Signal likely caused by non-planetary phenomena</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Key Findings</h4>
                {[
                  { 
                    icon: Activity, 
                    title: 'Signal Characteristics', 
                    text: planet.classification === 'confirmed' 
                      ? 'Transit depth, duration, and periodicity consistent with planetary hypothesis'
                      : planet.classification === 'candidate'
                      ? 'Some characteristics support planetary origin, but require verification'
                      : 'Signal characteristics inconsistent with planetary transit expectations'
                  },
                  { 
                    icon: Wind, 
                    title: 'Stellar Context', 
                    text: `Host star temperature of ${planet.stellarTemp}K and radius ${planet.stellarRadius.toFixed(2)}R☉ provide context for transit interpretation`
                  },
                  { 
                    icon: Droplet, 
                    title: 'Physical Plausibility', 
                    text: `Derived mass (${planet.mass.toFixed(2)}M⊕) and radius (${planet.radius.toFixed(2)}R⊕) ${planet.classification === 'confirmed' ? 'fall within expected ranges for exoplanets' : 'should be verified with additional data'}`
                  }
                ].map((finding) => {
                  const Icon = finding.icon;
                  return (
                    <div key={finding.title} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-white text-sm mb-1">{finding.title}</div>
                          <div className="text-xs text-slate-400 leading-relaxed">{finding.text}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mission Control Directive (Completed Missing Block) */}
              <div className={`bg-gradient-to-br p-1 rounded-lg ${
                 planet.classification === 'confirmed' ? 'from-green-500/20 to-green-900/10' :
                 planet.classification === 'candidate' ? 'from-yellow-500/20 to-yellow-900/10' :
                 'from-red-500/20 to-red-900/10'
              }`}>
                <div className="bg-slate-900 rounded-lg p-5">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-400" />
                    Mission Control Directive
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {planet.classification === 'confirmed'
                      ? 'Proceed with full characterization. Prioritize spectroscopic transit analysis for atmospheric composition.'
                      : planet.classification === 'candidate'
                      ? 'Assign resources for immediate follow-up via radial velocity or secondary transit observation to achieve CONFIRMED status.'
                      : 'Close this file and re-route observation resources to a higher-priority CANDIDATE or CONFIRMED target. Archive data for model retraining.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}