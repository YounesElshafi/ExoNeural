import { useState } from 'react';
import { Search, Filter, Calendar, Globe, BookOpen, Download, Edit3, Save, TrendingUp, CheckCircle, Activity, AlertTriangle } from 'lucide-react';

export default function MissionLogbook({ planets = [], onSelectPlanet, onUpdateNotes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredPlanets = planets
    .filter(planet => {
      const matchesSearch = planet.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterClassification === 'all' || planet.classification === filterClassification;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.discoveryDate).getTime() - new Date(a.discoveryDate).getTime();
      if (sortBy === 'confidence') return b.detectionConfidence - a.detectionConfidence;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const handleEditNotes = (planet) => {
    setEditingNotes(planet.id);
    setNoteText(planet.notes || '');
  };

  const handleSaveNotes = (planetId) => {
    onUpdateNotes(planetId, noteText);
    setEditingNotes(null);
    setNoteText('');
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'confirmed': return CheckCircle;
      case 'candidate': return Activity;
      case 'false-positive': return AlertTriangle;
      default: return Globe;
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'confirmed': return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
      case 'candidate': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
      case 'false-positive': return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };
      default: return { bg: 'bg-slate-500/20', border: 'border-slate-500/30', text: 'text-slate-400' };
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (planets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 p-8">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <BookOpen className="w-24 h-24 mx-auto text-cyan-400 opacity-50" />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
            Mission Logbook Empty
          </h2>
          <p className="text-slate-400 mb-6">
            Your exoplanet detection journey begins now. Use the Detection interface to analyze stellar data and discover new worlds. All detections will automatically appear in your logbook.
          </p>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-cyan-500/30">
            <div className="text-sm text-slate-300 space-y-2">
              <p className="font-semibold text-cyan-400 mb-3">AI Classification System:</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Confirmed: Verified exoplanet detections</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span>Candidate: Requires follow-up observation</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>False Positive: Non-planetary signals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: planets.length,
    confirmed: planets.filter(p => p.classification === 'confirmed').length,
    candidates: planets.filter(p => p.classification === 'candidate').length,
    falsePositive: planets.filter(p => p.classification === 'false-positive').length,
    avgConfidence: (planets.reduce((sum, p) => sum + p.detectionConfidence, 0) / planets.length * 100).toFixed(1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900/30 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            ExoNeural Mission Logbook
          </h1>
          <p className="text-slate-400 text-lg">
            Comprehensive record of AI-detected exoplanets and classification data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-transparent p-6 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-8 h-8 text-cyan-400" />
              <div className="text-3xl font-bold text-cyan-400">{stats.total}</div>
            </div>
            <div className="text-sm text-slate-400">Total Detections</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/20 to-transparent p-6 rounded-xl border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div className="text-3xl font-bold text-green-400">{stats.confirmed}</div>
            </div>
            <div className="text-sm text-slate-400">Confirmed</div>
            <div className="text-xs text-green-400">Exoplanets</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-transparent p-6 rounded-xl border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 text-yellow-400" />
              <div className="text-3xl font-bold text-yellow-400">{stats.candidates}</div>
            </div>
            <div className="text-sm text-slate-400">Candidates</div>
            <div className="text-xs text-yellow-400">Require Study</div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500/20 to-transparent p-6 rounded-xl border border-red-500/30">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div className="text-3xl font-bold text-red-400">{stats.falsePositive}</div>
            </div>
            <div className="text-sm text-slate-400">False Positives</div>
            <div className="text-xs text-red-400">Filtered Out</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-6 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div className="text-3xl font-bold text-purple-400">{stats.avgConfidence}%</div>
            </div>
            <div className="text-sm text-slate-400">Avg Confidence</div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search planets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <Filter className="text-slate-400 w-5 h-5 mt-3" />
              <select
                value={filterClassification}
                onChange={(e) => setFilterClassification(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="all">All Classifications</option>
                <option value="confirmed">Confirmed Exoplanets</option>
                <option value="candidate">Candidate Exoplanets</option>
                <option value="false-positive">False Positives</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="date">Sort by Discovery Date</option>
                <option value="confidence">Sort by Confidence</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>

          <button className="mt-4 flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold">
            <Download className="w-4 h-4" />
            Export Mission Data
          </button>
        </div>

        <div className="space-y-6">
          {filteredPlanets.map((planet) => {
            const colors = getClassificationColor(planet.classification);
            const Icon = getClassificationIcon(planet.classification);
            
            return (
              <div
                key={planet.id}
                className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{planet.name}</h3>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${colors.bg} ${colors.border}`}>
                          <Icon className={`w-4 h-4 ${colors.text}`} />
                          <span className={`text-xs font-semibold ${colors.text}`}>
                            {getClassificationLabel(planet.classification)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Detected: {formatDate(planet.discoveryDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span className={colors.text}>Confidence: {(planet.detectionConfidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPlanet(planet)}
                      className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all font-semibold"
                    >
                      Full Analysis
                    </button>
                  </div>

                  <div className={`mb-4 p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-300">AI Detection Score</span>
                      <span className={`text-xl font-bold ${colors.text}`}>
                        {(planet.detectionConfidence * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-full rounded-full ${colors.text.replace('text-', 'bg-')}`}
                        style={{ width: `${planet.detectionConfidence * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      {planet.classification === 'confirmed' && 'High confidence: Confirmed exoplanet detection'}
                      {planet.classification === 'candidate' && 'Moderate confidence: Candidate requiring follow-up'}
                      {planet.classification === 'false-positive' && 'Low confidence: Classified as false positive signal'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Mass</div>
                      <div className="text-lg font-bold text-white">{planet.mass.toFixed(2)} M⊕</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Radius</div>
                      <div className="text-lg font-bold text-white">{planet.radius.toFixed(2)} R⊕</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Period</div>
                      <div className="text-lg font-bold text-white">{planet.orbitalPeriod.toFixed(1)} d</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Temp</div>
                      <div className="text-lg font-bold text-white">{planet.equilibriumTemp.toFixed(0)} K</div>
                    </div>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Captain's Notes
                      </h4>
                      {editingNotes !== planet.id && (
                        <button
                          onClick={() => handleEditNotes(planet)}
                          className="text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {editingNotes === planet.id ? (
                      <div>
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Record your observations about this detection..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none resize-none"
                          rows={4}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => setEditingNotes(null)}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(planet.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
                          >
                            <Save className="w-4 h-4" />
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm">
                        {planet.notes || 'No observations recorded yet. Click the edit icon to add your notes about this detection.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlanets.length === 0 && planets.length > 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No planets match your search criteria</p>
              <p className="text-sm mt-2">Try adjusting your filters or search term</p>
            </div>
          </div>
        )}

        {planets.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Mission Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-slate-400 mb-2">Detection Success Rate</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {((stats.confirmed + stats.candidates) / stats.total * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  {stats.confirmed + stats.candidates} of {stats.total} detections classified as planets
                </div>
              </div>
              <div>
                <div className="text-slate-400 mb-2">Confirmed Discoveries</div>
                <div className="text-2xl font-bold text-green-400">{stats.confirmed}</div>
                <div className="text-xs text-slate-500">
                  High-confidence exoplanet detections ready for characterization
                </div>
              </div>
              <div>
                <div className="text-slate-400 mb-2">Average Detection Quality</div>
                <div className="text-2xl font-bold text-purple-400">{stats.avgConfidence}%</div>
                <div className="text-xs text-slate-500">
                  Mean confidence across all ExoNeural AI detections
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}