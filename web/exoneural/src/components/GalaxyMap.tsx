import { useState, useCallback, useRef } from 'react';
import { Search, Filter, Globe, Layers, ZoomIn, ZoomOut, TrendingUp, Menu, X } from 'lucide-react';

export default function GalaxyMap({ planets = [], onSelectPlanet }) {
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('all');
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const hasDragged = useRef(false);

  const filteredPlanets = planets.filter(planet => {
    const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterClassification === 'all' ||
      planet.classification === filterClassification;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: planets.length,
    confirmed: planets.filter(p => p.classification === 'confirmed').length,
    candidate: planets.filter(p => p.classification === 'candidate').length,
    falsePositive: planets.filter(p => p.classification === 'false-positive').length,
    avgConfidence: planets.length > 0
      ? (planets.reduce((sum, p) => sum + p.detectionConfidence, 0) / planets.length * 100).toFixed(1)
      : '0.0'
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'confirmed': return { main: '#10b981', glow: 'rgba(16, 185, 129, 0.5)' };
      case 'candidate': return { main: '#eab308', glow: 'rgba(234, 179, 8, 0.5)' };
      case 'false-positive': return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' };
      default: return { main: '#6b7280', glow: 'rgba(107, 114, 128, 0.5)' };
    }
  };

  const getClassificationLabel = (classification) => {
    switch (classification) {
      case 'confirmed': return 'Confirmed Exoplanet';
      case 'candidate': return 'Candidate Exoplanet';
      case 'false-positive': return 'False Positive';
      default: return 'Unknown';
    }
  };

  const handleDragStart = useCallback((clientX, clientY) => {
    setIsDragging(true);
    hasDragged.current = false;
    dragStart.current = { 
      x: clientX, 
      y: clientY, 
      offsetX: mapOffset.x, 
      offsetY: mapOffset.y 
    };
  }, [mapOffset]);

  const handleDragMove = useCallback((clientX, clientY) => {
    if (!isDragging) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDragged.current = true;
    }

    setMapOffset({
      x: dragStart.current.offsetX + dx,
      y: dragStart.current.offsetY + dy
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseDown = (e) => handleDragStart(e.clientX, e.clientY);
  const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
  const onMouseUp = handleDragEnd;

  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 1) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchEnd = handleDragEnd;

  const handlePlanetClick = (planet) => {
    if (!hasDragged.current) {
      setSelectedPlanet(planet);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    }
    hasDragged.current = false;
  };

  const handleViewDetails = () => {
    if (selectedPlanet && onSelectPlanet) {
      onSelectPlanet(selectedPlanet);
    }
  };

  if (planets.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900">
        <div className="text-center max-w-md p-6">
          <div className="text-6xl mb-4">🌌</div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            Galaxy Awaits Discovery
          </h2>
          <p className="text-slate-400 mb-6">
            No exoplanets detected yet. Use the Detection interface to analyze stellar data and discover new worlds.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30">
            <div className="text-sm text-slate-300 space-y-2">
              <p className="font-semibold text-cyan-400">AI Classification System:</p>
              <div className="flex justify-between"><span>Confirmed:</span><span className="text-green-400">Confirmed Exoplanet</span></div>
              <div className="flex justify-between"><span>Candidate:</span><span className="text-yellow-400">Candidate Exoplanet</span></div>
              <div className="flex justify-between"><span>False Positive:</span><span className="text-red-400">Not an Exoplanet</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex relative overflow-hidden">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border-r border-cyan-500/30 flex flex-col 
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:flex-shrink-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Exoplanet Map
            </h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search planets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2 mb-4">
            <Filter className="text-slate-400 w-5 h-5 mt-2" />
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none text-sm"
            >
              <option value="all">All Classifications</option>
              <option value="confirmed">Confirmed Exoplanets</option>
              <option value="candidate">Candidate Exoplanets</option>
              <option value="false-positive">False Positives</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="bg-gradient-to-br from-cyan-500/20 to-transparent p-3 rounded-lg border border-cyan-500/30">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Total Detected</span>
                <span className="text-cyan-400 text-2xl font-bold">{stats.total}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-transparent p-3 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">Confirmed</div>
                  <div className="text-xs text-green-400">Exoplanets</div>
                </div>
                <span className="text-green-400 text-2xl font-bold">{stats.confirmed}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-transparent p-3 rounded-lg border border-yellow-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">Candidates</div>
                  <div className="text-xs text-yellow-400">Require Study</div>
                </div>
                <span className="text-yellow-400 text-2xl font-bold">{stats.candidate}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-transparent p-3 rounded-lg border border-red-500/30">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400">False Positives</div>
                  <div className="text-xs text-red-400">Not Exoplanets</div>
                </div>
                <span className="text-red-400 text-2xl font-bold">{stats.falsePositive}</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-3 rounded-lg border border-purple-500/30">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Avg Confidence</span>
                <span className="text-purple-400 text-xl font-bold">{stats.avgConfidence}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredPlanets.map((planet) => {
            const colors = getClassificationColor(planet.classification);
            return (
              <button
                key={planet.id}
                onClick={() => handlePlanetClick(planet)}
                onMouseEnter={() => setHoveredPlanet(planet.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
                className={`w-full p-3 rounded-lg text-left transition-all ${
                  selectedPlanet?.id === planet.id
                    ? 'bg-cyan-500/20 border-2 border-cyan-500 shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{planet.name}</span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.main, boxShadow: `0 0 8px ${colors.glow}` }}
                  />
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span className="font-semibold" style={{ color: colors.main }}>
                      {(planet.detectionConfidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification:</span>
                    <span className="font-semibold text-xs" style={{ color: colors.main }}>
                      {getClassificationLabel(planet.classification)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
                    <div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${planet.detectionConfidence * 100}%`,
                        backgroundColor: colors.main
                      }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div 
        className={`flex-1 relative bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={handleDragEnd}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-40 p-3 bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
        >
          <Menu className="w-6 h-6 text-cyan-400" />
        </button>

        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: 0.3 + Math.random() * 0.5,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoom})`
          }} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative"
            style={{
              width: '800px',
              height: '800px',
              transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoom})`
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 animate-pulse"
                   style={{ boxShadow: '0 0 60px rgba(251, 191, 36, 0.6)' }} />
            </div>

            {filteredPlanets.map((planet, index) => {
              const angle = (index / filteredPlanets.length) * Math.PI * 2;
              const radius = 200 + (index % 3) * 100;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              
              const size = 20 + (planet.radius / 3) * 20;
              const colors = getClassificationColor(planet.classification);

              return (
                <div
                  key={planet.id}
                  onClick={(e) => {
                      e.stopPropagation();
                      handlePlanetClick(planet);
                  }}
                  className="absolute cursor-pointer transition-all duration-300"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%) ${hoveredPlanet === planet.id ? 'scale(1.2)' : 'scale(1)'}`,
                  }}
                  onMouseEnter={() => setHoveredPlanet(planet.id)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                >
                  <div
                    className="absolute rounded-full border opacity-30 animate-spin-slow"
                    style={{
                      width: `${size * 2}px`,
                      height: `${size * 2}px`,
                      borderColor: colors.main,
                      borderWidth: '2px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      animationDuration: '10s'
                    }}
                  />

                  <div
                    className="rounded-full animate-pulse"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: colors.main,
                      boxShadow: `0 0 ${size}px ${colors.glow}`,
                      animationDuration: '3s'
                    }}
                  />

                  {(hoveredPlanet === planet.id || selectedPlanet?.id === planet.id) && (
                    <>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-900/90 backdrop-blur-xl px-2 py-1 rounded-lg border text-xs font-bold"
                         style={{ borderColor: colors.main, color: colors.main }}>
                      {(planet.detectionConfidence * 100).toFixed(1)}%
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-900/90 backdrop-blur-xl px-3 py-1 rounded-lg border border-cyan-500/30 text-white text-xs font-semibold">
                      {planet.name}
                    </div>
                    </>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {selectedPlanet && (
          <div className="absolute top-4 right-4 w-11/12 max-w-xs md:w-80 bg-slate-900/95 backdrop-blur-xl rounded-xl p-6 border shadow-2xl z-30"
               style={{ borderColor: getClassificationColor(selectedPlanet.classification).main }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-cyan-400">{selectedPlanet.name}</h3>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 rounded-lg border"
                 style={{ 
                    backgroundColor: `${getClassificationColor(selectedPlanet.classification).glow}20`,
                    borderColor: getClassificationColor(selectedPlanet.classification).main
                   }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300">AI Detection Score</span>
                <TrendingUp className="w-4 h-4" style={{ color: getClassificationColor(selectedPlanet.classification).main }} />
              </div>
              <div className="text-3xl font-bold mb-1"
                   style={{ color: getClassificationColor(selectedPlanet.classification).main }}>
                {(selectedPlanet.detectionConfidence * 100).toFixed(1)}%
              </div>
              <div className="text-xs" style={{ color: getClassificationColor(selectedPlanet.classification).main }}>
                {getClassificationLabel(selectedPlanet.classification)}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ 
                    width: `${selectedPlanet.detectionConfidence * 100}%`,
                    backgroundColor: getClassificationColor(selectedPlanet.classification).main
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Mass:</span>
                <span className="text-white font-semibold">{selectedPlanet.mass.toFixed(2)} M⊕</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Radius:</span>
                <span className="text-white font-semibold">{selectedPlanet.radius.toFixed(2)} R⊕</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Orbital Period:</span>
                <span className="text-white font-semibold">{selectedPlanet.orbitalPeriod.toFixed(1)} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Temperature:</span>
                <span className="text-white font-semibold">{selectedPlanet.equilibriumTemp.toFixed(0)} K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Distance:</span>
                <span className="text-white font-semibold">{selectedPlanet.distance.toFixed(3)} AU</span>
              </div>
            </div>

            <button 
              onClick={handleViewDetails}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
            >
              Detailed Analysis →
            </button>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
          <button
            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
            className="p-3 bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
          >
            <ZoomIn className="w-5 h-5 text-cyan-400" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))}
            className="p-3 bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 hover:bg-cyan-500/20 transition-all"
          >
            <ZoomOut className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 md:left-24 bg-slate-900/80 backdrop-blur-xl rounded-lg p-4 border border-slate-700 z-30">
          <div className="text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-white mb-2">Classification Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }} />
              <span>Confirmed Exoplanet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" style={{ boxShadow: '0 0 8px rgba(234, 179, 8, 0.5)' }} />
              <span>Candidate Exoplanet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" style={{ boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }} />
              <span>False Positive</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-700">
              <Layers className="inline w-3 h-3 mr-1" />
              <span>Click planets for details</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .cursor-grab {
          cursor: grab;
        }
        .cursor-grabbing {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}