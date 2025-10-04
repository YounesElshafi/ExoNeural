import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Zap, Globe, Loader2 } from 'lucide-react';

interface PredictionResult {
  prediction: string;
  confidence: number;
  status?: string;
  error?: string;
  // تم التحديث: إضافة توزيع الاحتمالات من الموديل
  probabilities?: {
    'False Positive': number;
    'Candidate Exoplanet': number;
    'Confirmed Exoplanet': number;
  };
}

interface ResultsCardProps {
  result: PredictionResult | null;
  loading: boolean;
  onViewInMap: () => void;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, loading, onViewInMap }) => {

  const getResultIcon = (prediction: string) => {
    switch (prediction) {
      case 'Confirmed Exoplanet':
        return <CheckCircle className="w-10 h-10 text-emerald-400" />;
      case 'Candidate Exoplanet':
        return <AlertTriangle className="w-10 h-10 text-yellow-400" />;
      case 'False Positive':
        return <XCircle className="w-10 h-10 text-red-400" />;
      default:
        return <Zap className="w-10 h-10 text-purple-400" />;
    }
  };

  const getResultColor = (prediction: string) => {
    switch (prediction) {
      case 'Confirmed Exoplanet':
        return {
          gradient: 'from-emerald-900/40 to-cyan-900/40',
          border: 'border-emerald-500/50',
          iconColor: 'text-emerald-400'
        };
      case 'Candidate Exoplanet':
        return {
          gradient: 'from-yellow-900/40 to-orange-900/40',
          border: 'border-yellow-500/50',
          iconColor: 'text-yellow-400'
        };
      case 'False Positive':
        return {
          gradient: 'from-red-900/40 to-fuchsia-900/40',
          border: 'border-red-500/50',
          iconColor: 'text-red-400'
        };
      default:
        return {
          gradient: 'from-purple-900/40 to-gray-900/40',
          border: 'border-purple-500/30',
          iconColor: 'text-purple-400'
        };
    }
  };

  const currentColors = result ? getResultColor(result.prediction) : getResultColor('default');
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.75) return 'text-emerald-400';
    if (confidence >= 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-emerald-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Initial state (no result, not loading)
  if (!result && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-900/50 to-purple-900/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Exoplanet Analysis AI
        </h3>
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Globe className="w-16 h-16 text-purple-400 opacity-50" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Awaiting Input</h3>
            <p className="text-gray-400 text-sm">
              Enter the 25 planetary and stellar parameters to begin a new detection run.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br ${currentColors.gradient} backdrop-blur-lg rounded-2xl p-8 border ${currentColors.border} shadow-2xl`}
    >
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Detection Results
      </h3>

      {loading ? (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className={`w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4 ${currentColors.iconColor}`}
          >
            <Loader2 className="w-16 h-16 animate-spin text-purple-500" />
          </motion.div>
          <p className="text-gray-300 font-medium">Analyzing stellar data...</p>
        </div>
      ) : result ? (
        <div className="space-y-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              {getResultIcon(result.prediction)}
            </motion.div>
            
            <motion.h4
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl font-extrabold mb-2 ${currentColors.iconColor}`}
            >
              {result.prediction}
            </motion.h4>
            
            {result.error ? (
              <p className="text-red-400 bg-red-900/30 p-3 rounded-lg border border-red-500/50">
                Error during analysis: {result.error}
              </p>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {/* Confidence Bar */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-inner">
                  <p className="text-gray-300 text-sm mb-2 font-medium">Model Confidence</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                    <div className="w-32 bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence * 100}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className={`h-3 rounded-full ${getProgressBarColor(result.confidence)}`}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Classification: <span className="font-semibold text-white">{result.prediction}</span>
                  </p>
                </div>

                {/* Detailed Probability Breakdown (NEW SECTION) */}
                {result.probabilities && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 shadow-inner"
                    >
                        <p className="text-gray-300 text-sm mb-3 font-medium border-b border-gray-700/50 pb-2">
                            Probabilities
                        </p>
                        <div className="space-y-2 text-sm">
                            {/* Display probabilities in a fixed, logical order */}
                            {Object.entries(result.probabilities)
                                .sort(([keyA], [keyB]) => {
                                    const order = ['False Positive', 'Candidate Exoplanet', 'Confirmed Exoplanet'];
                                    return order.indexOf(keyA) - order.indexOf(keyB);
                                })
                                .map(([label, probability]) => {
                                    const isPrediction = label === result.prediction;
                                    const colorClass = isPrediction ? 'text-cyan-400' : 'text-gray-400';

                                    return (
                                        <div key={label} className="flex justify-between items-center">
                                            <span className={`font-medium ${colorClass}`}>
                                                {label.toUpperCase()}:
                                            </span>
                                            <span className={`text-base font-bold ${getConfidenceColor(probability)}`}>
                                                {(probability * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                    );
                                })}
                        </div>
                    </motion.div>
                )}
                
                {/* Meta Data */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700">
                    <p className="text-gray-400">Analysis Type</p>
                    <p className="text-white font-medium">Single Target</p>
                  </div>
                  <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700">
                    <p className="text-gray-400">Processing Time</p>
                    <p className="text-white font-medium">~0.5s</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Action Button */}
          {!result.error && (
            <div className="pt-4 border-t border-gray-700/50">
              <button 
                onClick={onViewInMap}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 text-lg"
              >
                <Globe className="w-5 h-5" />
                Visualize Planet
              </button>
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default ResultsCard;