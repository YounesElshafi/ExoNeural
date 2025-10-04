import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, Loader2, RefreshCw, Cpu, Zap, CheckCircle, HardHat, ArrowRight } from 'lucide-react';

// ====================================================================
// STATIC DATA (25 PARAMETER DEFINITIONS, PRESETS, ACCURACIES)
// ====================================================================

// 25 PARAMETER DEFINITIONS (Reused from your original file)
const PARAMS = [
  // --- Orbital/System Parameters (koi_period, koi_sma, koi_incl, koi_eccen, koi_dor) ---
  { name: 'koi_period', label: 'Orbital Period', unit: 'days', placeholder: '41.749', category: 'orbital' },
  { name: 'koi_sma', label: 'Semi-Major Axis', unit: 'AU', placeholder: '0.228', category: 'orbital' },
  { name: 'koi_incl', label: 'Orbital Inclination', unit: 'deg', placeholder: '89.77', category: 'orbital' },
  { name: 'koi_eccen', label: 'Eccentricity', unit: '', placeholder: '0.0', category: 'orbital' },
  { name: 'koi_dor', label: 'Distance / Stellar Radius', unit: '', placeholder: '57.11', category: 'orbital' },

  // --- Planet Properties (koi_prad, koi_teq, koi_insol, koi_ror, koi_count) ---
  { name: 'koi_prad', label: 'Planet Radius', unit: 'R⊕', placeholder: '2.94', category: 'planet' },
  { name: 'koi_teq', label: 'Equilibrium Temp.', unit: 'K', placeholder: '486.0', category: 'planet' },
  { name: 'koi_insol', label: 'Stellar Insolation', unit: 'I⊕', placeholder: '13.22', category: 'planet' },
  { name: 'koi_ror', label: 'Planet/Star Radius Ratio', unit: '', placeholder: '0.0294', category: 'planet' },
  { name: 'koi_count', label: 'KOI Multiplicity', unit: '', placeholder: '3', category: 'planet' },

  // --- Transit/Observation Parameters (koi_impact, koi_duration, koi_depth, koi_num_transits, koi_model_snr) ---
  { name: 'koi_impact', label: 'Transit Impact Parameter', unit: '', placeholder: '0.226', category: 'transit' },
  { name: 'koi_duration', label: 'Transit Duration', unit: 'hours', placeholder: '5.6098', category: 'transit' },
  { name: 'koi_depth', label: 'Transit Depth', unit: 'ppm', placeholder: '1055.4', category: 'transit' },
  { name: 'koi_num_transits', label: 'Num. Transits Observed', unit: '', placeholder: '34.0', category: 'transit' },
  { name: 'koi_model_snr', label: 'Model Signal-to-Noise', unit: '', placeholder: '95.0', category: 'transit' },

  // --- Stellar Properties (koi_steff, koi_slogg, koi_smet, koi_srad, koi_smass, koi_srho) ---
  { name: 'koi_steff', label: 'Stellar Effective Temp.', unit: 'K', placeholder: '5506.0', category: 'stellar' },
  { name: 'koi_slogg', label: 'Stellar Surface Gravity', unit: 'log10(cm/s²)', placeholder: '4.473', category: 'stellar' },
  { name: 'koi_smet', label: 'Stellar Metallicity', unit: 'log10(Fe/H)', placeholder: '0.04', category: 'stellar' },
  { name: 'koi_srad', label: 'Stellar Radius', unit: 'R☉', placeholder: '0.914', category: 'stellar' },
  { name: 'koi_smass', label: 'Stellar Mass', unit: 'M☉', placeholder: '0.904', category: 'stellar' },
  { name: 'koi_srho', label: 'Stellar Density', unit: 'g/cm³', placeholder: '2.021', category: 'stellar' },

  // --- False Positive Flags (0 or 1) ---
  { name: 'koi_fpflag_nt', label: 'Not Transit Flag (NT)', unit: '0 or 1', placeholder: '0', category: 'flags' },
  { name: 'koi_fpflag_ss', label: 'Stellar Status Flag (SS)', unit: '0 or 1', placeholder: '0', category: 'flags' },
  { name: 'koi_fpflag_co', label: 'Centroid Offset Flag (CO)', unit: '0 or 1', placeholder: '0', category: 'flags' },
  { name: 'koi_fpflag_ec', label: 'Ephemeris Match Flag (EC)', unit: '0 or 1', placeholder: '0', category: 'flags' },
];

const PRESETS = {
  confirmed: {
    koi_period: 41.74938613, koi_prad: 2.94, koi_sma: 0.228, koi_incl: 89.77, koi_teq: 486.0,
    koi_insol: 13.22, koi_impact: 0.226, koi_duration: 5.6098, koi_depth: 1055.4, koi_dor: 57.11,
    koi_eccen: 0.0, koi_ror: 0.029414, koi_steff: 5506.0, koi_slogg: 4.473, koi_smet: 0.04,
    koi_srad: 0.914, koi_smass: 0.904, koi_srho: 2.02141, koi_num_transits: 34.0, koi_count: 3,
    koi_model_snr: 95.0, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0
  },
  candidate: {
    koi_period: 8.2927558, koi_prad: 1.01, koi_sma: 0.0807, koi_incl: 86.52, koi_teq: 927.0,
    koi_insol: 174.36, koi_impact: 0.6346, koi_duration: 4.784, koi_depth: 103.3, koi_dor: 10.43,
    koi_eccen: 0.0, koi_ror: 0.009775, koi_steff: 6146.0, koi_slogg: 4.497, koi_smet: -0.26,
    koi_srad: 0.943, koi_smass: 1.02, koi_srho: 0.31213, koi_num_transits: 158.0, koi_count: 2,
    koi_model_snr: 8.4, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0
  },
  false_positive: {
    koi_period: 0.518071538, koi_prad: 42.1, koi_sma: 0.0126, koi_incl: 34.22, koi_teq: 2536.0,
    koi_insol: 9823.05, koi_impact: 1.264, koi_duration: 1.7865, koi_depth: 2195.5, koi_dor: 1.529,
    koi_eccen: 0.0, koi_ror: 0.318862, koi_steff: 5876.0, koi_slogg: 4.273, koi_smet: -0.02,
    koi_srad: 1.209, koi_smass: 0.999, koi_srho: 0.25201, koi_num_transits: 178.0, koi_count: 1,
    koi_model_snr: 152.1, koi_fpflag_nt: 0, koi_fpflag_ss: 1, koi_fpflag_co: 1, koi_fpflag_ec: 0
  },
  hot_jupiter: {
    koi_period: 3.5, koi_prad: 11.2, koi_sma: 0.05, koi_incl: 88.5, koi_teq: 1200.0,
    koi_insol: 1500.0, koi_impact: 0.5, koi_duration: 3.8, koi_depth: 15000.0, koi_dor: 15.0,
    koi_eccen: 0.01, koi_ror: 0.1, koi_steff: 5850.0, koi_slogg: 4.4, koi_smet: 0.05,
    koi_srad: 1.05, koi_smass: 1.1, koi_srho: 1.0, koi_num_transits: 500.0, koi_count: 1,
    koi_model_snr: 500.0, koi_fpflag_nt: 0, koi_fpflag_ss: 0, koi_fpflag_co: 0, koi_fpflag_ec: 0
  },
};

const ACCURACIES_DATA = {
    LightGBM: 0.9295,
    XGBoost: 0.9275,
    RandomForest: 0.9314,
    Ensemble: 0.9314,
};

type ModelName = keyof typeof ACCURACIES_DATA;
type Category = 'orbital' | 'planet' | 'stellar' | 'transit' | 'flags';
const modelOptions: ModelName[] = ['LightGBM', 'XGBoost', 'RandomForest', 'Ensemble'];
const categories: Category[] = ['orbital', 'planet', 'stellar', 'transit', 'flags'];

// ====================================================================
// SHARED TYPES
// ====================================================================

interface Hyperparameters {
    n_estimators: string;
    max_depth: string;
    learning_rate: string;
}

interface PredictionFormProps {
  onPredict: (data: any) => void;
  loading: boolean;
}

// ====================================================================
// STEP 3: FEATURE INPUT COMPONENT (Reusing your original form logic)
// ====================================================================

interface Step3Props extends PredictionFormProps {
    selectedModel: ModelName;
    hyperparams: Hyperparameters;
}

const Step3FeatureInput: React.FC<Step3Props> = ({ onPredict, loading, selectedModel, hyperparams }) => {
  const [formData, setFormData] = useState(
    PARAMS.reduce((acc, p) => ({ ...acc, [p.name]: '' }), {}) as Record<string, string | number>
  );
  const [inputMethod, setInputMethod] = useState<'manual' | 'csv'>('manual');
  const [activeCategory, setActiveCategory] = useState<Category>('orbital'); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePresetLoad = (presetName: keyof typeof PRESETS) => {
    const preset = PRESETS[presetName];
    const stringifiedPreset = Object.entries(preset).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: String(value)
    }), {});
    setFormData(stringifiedPreset);
  };

  const handleReset = () => {
    setFormData(PARAMS.reduce((acc, p) => ({ ...acc, [p.name]: '' }), {}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    // 1. Prepare 25 feature parameters
    const parsedFeatures: Record<string, number> = {};
    for (const param of PARAMS) {
        const key = param.name;
        const value = formData[key];
        parsedFeatures[key] = value === '' ? NaN : parseFloat(String(value)); 
    }

    // 2. Add the selected model and its hyperparameters (if applicable) to the final data
    const predictionData = {
        ...parsedFeatures,
        model_name: selectedModel,
        ...(selectedModel !== 'Ensemble' && {
            n_estimators: parseInt(hyperparams.n_estimators),
            max_depth: parseInt(hyperparams.max_depth),
            learning_rate: parseFloat(hyperparams.learning_rate),
        })
    };

    onPredict(predictionData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // CSV logic (reused from your original file)
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const rows = text.split('\n').filter(r => r.trim() !== '');
        if (rows.length < 2) return;

        const headers = rows[0].split(',').map(h => h.trim());
        const expectedHeaders = PARAMS.map(p => p.name);
        
        if (!expectedHeaders.every(h => headers.includes(h))) return;

        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          const obj: any = {
            model_name: selectedModel,
            ...(selectedModel !== 'Ensemble' && {
                n_estimators: parseInt(hyperparams.n_estimators),
                max_depth: parseInt(hyperparams.max_depth),
                learning_rate: parseFloat(hyperparams.learning_rate),
            })
          };
          expectedHeaders.forEach((h) => {
            const headerIndex = headers.indexOf(h);
            const value = (headerIndex !== -1 && values[headerIndex] !== undefined) 
                ? values[headerIndex] 
                : '';
            obj[h] = value === '' ? NaN : parseFloat(value);
          });
          return obj;
        });

        onPredict({ data, batch: true });
      };
      reader.readAsText(file);
    }
  };

  const filteredParams = PARAMS.filter(p => p.category === activeCategory);
    
  return (
    <motion.div
      key="step3-form"
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
        {/* Model & Hyperparameter Summary */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-purple-500/50 text-sm">
            <p className="font-semibold text-purple-300">Selected Model: <span className="text-white">{selectedModel}</span></p>
            {selectedModel !== 'Ensemble' && (
                <div className="text-gray-400 mt-1">
                    <span className="mr-3">N_Estimators: <span className="text-cyan-400">{hyperparams.n_estimators}</span></span>
                    <span className="mr-3">Max_Depth: <span className="text-cyan-400">{hyperparams.max_depth}</span></span>
                    <span>Learning_Rate: <span className="text-cyan-400">{hyperparams.learning_rate}</span></span>
                </div>
            )}
        </div>

        {/* Input method selector */}
        <div className="flex mb-6 bg-gray-800/50 rounded-xl p-1 shadow-inner">
            <button
                type="button"
                onClick={() => setInputMethod('manual')}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                    inputMethod === 'manual'
                        ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
                Manual Input (Single)
            </button>
            <button
                type="button"
                onClick={() => setInputMethod('csv')}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 font-medium ${
                    inputMethod === 'csv'
                        ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
                Batch Upload (CSV)
            </button>
        </div>

        {inputMethod === 'manual' ? (
            <div className="space-y-6">
                {/* Preset Selection */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                    <p className="text-sm text-gray-300 mb-3 font-semibold">Quick Load Presets:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                            type="button"
                            onClick={() => handlePresetLoad('confirmed')}
                            className="px-3 py-2 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-600/30 transition-all text-sm shadow-md"
                        >
                            ✅ CONFIRMED
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePresetLoad('candidate')}
                            className="px-3 py-2 bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-all text-sm shadow-md"
                        >
                            ❓ CANDIDATE
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePresetLoad('false_positive')}
                            className="px-3 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-all text-sm shadow-md"
                        >
                            ❌ FALSE POSITIVE
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePresetLoad('hot_jupiter')}
                            className="px-3 py-2 bg-orange-600/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-600/30 transition-all text-sm shadow-md"
                        >
                            🔥 Hot Jupiter
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setActiveCategory(cat as Category)}
                            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium whitespace-nowrap border-2 ${
                                activeCategory === cat
                                    ? 'bg-cyan-500/30 border-cyan-500 text-cyan-300 shadow-md'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:text-white hover:border-purple-500/50'
                            }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Filtered Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredParams.map((param) => (
                            <div key={param.name}>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {param.label}
                                    {param.unit && <span className="text-cyan-400 ml-1 font-normal">({param.unit})</span>}
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name={param.name}
                                    value={formData[param.name]}
                                    onChange={handleInputChange}
                                    step="any"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 shadow-lg"
                                    placeholder={param.placeholder}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(168, 85, 247, 0.8)" }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-400/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Predict Exoplanet</span>
                                </>
                            )}
                        </motion.button>
                        
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading}
                            className="p-4 bg-gray-700/70 text-gray-300 rounded-xl hover:bg-gray-600/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:text-white"
                            title="Reset all inputs"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        ) : (
            <div className="space-y-6">
                <div className="border-2 border-dashed border-purple-600/50 rounded-xl p-8 text-center bg-gray-800/50">
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2 font-medium">
                        Upload a CSV file for Batch Prediction.
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                        Your CSV must include columns with the **exact names** of the 25 required parameters:
                    </p>
                    <p className="text-xs text-cyan-400 mb-6 font-mono break-all bg-gray-700/30 p-2 rounded-lg">
                        {PARAMS.map(p => p.name).join(', ')}
                    </p>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="csv-upload"
                        disabled={loading}
                    />
                    <label
                        htmlFor="csv-upload"
                        className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl cursor-pointer transition-all duration-300 text-lg ${loading ? 'bg-gray-500 opacity-50' : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-xl hover:shadow-purple-400/30'}`}
                    >
                        <Upload className="w-5 h-5 mr-3" />
                        {loading ? 'Processing...' : 'Choose CSV File'}
                    </label>
                </div>
            </div>
        )}
    </motion.div>
  );
};

// ====================================================================
// STEP 2: ACCURACIES COMPONENT
// ====================================================================

interface Step2Props {
    onContinue: () => void;
    selectedModel: ModelName;
}

const Step2Accuracies: React.FC<Step2Props> = ({ onContinue, selectedModel }) => {
    return (
        <motion.div
            key="step2-accuracies"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="flex items-center space-x-2 text-2xl font-bold text-white/90">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h2>Step 2: Pre-Training Accuracies</h2>
            </div>
            
            <ul className="space-y-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 shadow-lg">
                {Object.entries(ACCURACIES_DATA).map(([model, accuracy]) => (
                    <motion.li
                        key={model}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + (modelOptions.indexOf(model as ModelName) * 0.1) }}
                        className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                            model === selectedModel 
                            ? 'bg-purple-600/30 border border-purple-500 text-white font-semibold' 
                            : 'text-gray-300'
                        }`}
                    >
                        <span className="flex items-center">
                            {model === selectedModel && <ArrowRight className="w-4 h-4 mr-2 text-cyan-400" />}
                            {model}
                        </span>
                        <span className="text-xl font-mono text-white">{accuracy.toFixed(4)}</span>
                    </motion.li>
                ))}
            </ul>

            <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-900/50 flex items-center justify-center gap-2 text-lg"
            >
                Continue to Prediction Input
                <ArrowRight className="w-5 h-5" />
            </motion.button>
        </motion.div>
    );
};

// ====================================================================
// STEP 1: MODEL SELECTION COMPONENT
// ====================================================================

interface Step1Props {
    onPreTrain: () => void;
    selectedModel: ModelName;
    setSelectedModel: (model: ModelName) => void;
    hyperparams: Hyperparameters;
    setHyperparams: (params: Hyperparameters) => void;
}

const Step1ModelSelection: React.FC<Step1Props> = ({ onPreTrain, selectedModel, setSelectedModel, hyperparams, setHyperparams }) => {
    
    const handleHyperparamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHyperparams(prev => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div
            key="step1-selection"
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
        >
            <div className="flex items-center space-x-2 text-2xl font-bold text-white/90">
                <Cpu className="w-6 h-6 text-purple-400" />
                <h2>Step 1: Select Model</h2>
            </div>

            <div className="space-y-4">
                {/* Model Selection Dropdown */}
                <label className="block text-base font-medium text-gray-400">
                    Machine Learning Model
                </label>
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as ModelName)}
                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
                >
                    {modelOptions.map((model) => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
                
                {/* Conditional Hyperparameters */}
                {selectedModel !== 'Ensemble' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 pt-4 border-t border-gray-700/50"
                    >
                        <div className="text-sm font-medium text-gray-300 flex items-center gap-1 mb-2">
                            <HardHat className="w-4 h-4 text-cyan-400" /> Model Hyperparameters
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {Object.entries({
                                n_estimators: { label: 'N Estimators', type: 'number', min: 1, step: 1 },
                                max_depth: { label: 'Max Depth', type: 'number', min: 1, step: 1 },
                                learning_rate: { label: 'Learning Rate', type: 'number', min: 0.01, step: 0.01 }
                            }).map(([key, { label, type, min, step }]) => {
                                const hKey = key as keyof Hyperparameters;
                                return (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                                        <input
                                            type={type}
                                            name={key}
                                            value={hyperparams[hKey]}
                                            onChange={handleHyperparamChange}
                                            className="p-3 w-full bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 transition-colors text-base"
                                            min={min}
                                            step={step}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Pre Training Button */}
            <motion.button
                onClick={onPreTrain}
                whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(168, 85, 247, 0.8)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 text-lg"
            >
                <Zap className="w-5 h-5" />
                <span>Pre Training Analysis</span>
            </motion.button>
        </motion.div>
    );
};

// ====================================================================
// MAIN COMPONENT
// ====================================================================

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, loading }) => {
    // Step State: 1, 2, or 3
    const [step, setStep] = useState(1);
    
    // Model and Hyperparameter States (maintained across all steps)
    const [selectedModel, setSelectedModel] = useState<ModelName>('LightGBM');
    const [hyperparams, setHyperparams] = useState<Hyperparameters>({
      n_estimators: '100',
      max_depth: '10',
      learning_rate: '0.1',
    });

    // Step handlers
    const onPreTrainClick = () => setStep(2);
    const onContinueClick = () => setStep(3);

    // Conditional rendering of components based on the current step
    const currentStepComponent = useMemo(() => {
        switch (step) {
            case 1:
                return (
                    <Step1ModelSelection 
                        onPreTrain={onPreTrainClick}
                        selectedModel={selectedModel}
                        setSelectedModel={setSelectedModel}
                        hyperparams={hyperparams}
                        setHyperparams={setHyperparams}
                    />
                );
            case 2:
                return (
                    <Step2Accuracies 
                        onContinue={onContinueClick}
                        selectedModel={selectedModel}
                    />
                );
            case 3:
                return (
                    <Step3FeatureInput 
                        onPredict={onPredict}
                        loading={loading}
                        selectedModel={selectedModel}
                        hyperparams={hyperparams}
                    />
                );
            default:
                return null;
        }
    }, [step, onPredict, loading, selectedModel, hyperparams]);


    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl min-h-[500px] relative overflow-hidden"
        >
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center border-b pb-3 border-gray-700/50">
                Exoplanet AI Prediction
            </h2>

            {/* Step Indicators */}
            <div className="flex justify-around mb-8 text-center">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="relative flex flex-col items-center">
                        <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                                step === s 
                                    ? 'bg-cyan-500 text-gray-900 shadow-xl shadow-cyan-900' 
                                    : step > s 
                                        ? 'bg-green-500 text-gray-900' 
                                        : 'bg-gray-700 text-gray-400'
                            }`}
                        >
                            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                        </div>
                        <p className={`mt-2 text-sm font-medium transition-colors ${step === s ? 'text-cyan-400' : 'text-gray-500'}`}>
                            {s === 1 ? 'Model' : s === 2 ? 'Accuracies' : 'Features'}
                        </p>
                        {s < 3 && (
                            <div className={`absolute left-[calc(50%+20px)] top-5 w-20 h-0.5 transform -translate-y-1/2 transition-colors duration-500 ${step > s ? 'bg-green-500' : 'bg-gray-700'}`}></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="relative pt-4">
                <AnimatePresence mode="wait">
                    {currentStepComponent}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default PredictionForm;