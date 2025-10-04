import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Ban, Zap } from 'lucide-react'; // Importing icons for a more visual report

interface CaptainMessageProps {
  prediction: string;
  confidence: number;
  onClose: () => void;
}

const CaptainMessage: React.FC<CaptainMessageProps> = ({ prediction, confidence, onClose }) => {
  const confidencePercent = (confidence * 100).toFixed(1);
  
  // Check for specific prediction types to tailor the message
  const isConfirmedExoplanet = prediction === 'Confirmed Exoplanet';
  const isFalsePositive = prediction === 'False Positive';
  const isCandidate = prediction === 'Candidate Exoplanet';
  
  const commanderAvatarSource = "/OIP-removebg-preview.jpg"; // Using the single image as requested
  
  let messageText: string;
  let reportTitle: string;
  let titleColor: string;
  let icon: React.ReactNode;

  if (isFalsePositive) {
    reportTitle = 'FALSE POSITIVE DETECTED';
    titleColor = 'text-red-400';
    icon = <Ban className="w-12 h-12 text-red-400" />;
    messageText = `Attention, Captain. Analysis indicates this is a ${prediction} with **${confidencePercent}%** certainty. The system is classifying this object as **Non-Habitable**. No further action required.`;
  } else if (isConfirmedExoplanet) {
    reportTitle = 'PRIORITY DISCOVERY CONFIRMED';
    titleColor = 'text-green-400';
    icon = <BadgeCheck className="w-12 h-12 text-green-400" />;
    messageText = `Outstanding work, Captain! Confirmed Exoplanet detected with **${confidencePercent}%** confidence. This is a priority discovery and is classified as **Potentially Habitable!**`;
  } else { // Candidate Exoplanet or Default
    reportTitle = 'NEW CANDIDATE LOGGED';
    titleColor = 'text-yellow-400';
    icon = <Zap className="w-12 h-12 text-yellow-400" />;
    messageText = `Good job, Captain. A new Candidate Exoplanet logged with **${confidencePercent}%** confidence. Proceed to detailed analysis.`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose} // Close on backdrop click
    >
      <motion.div
        initial={{ scale: 0.5, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        // Replicating the modal box style from IntroSequence's CallScene
        className="bg-gray-800 border border-cyan-500/50 rounded-xl p-6 md:p-8 w-full max-w-lg shadow-2xl text-center"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        
        {/* Commander/AI Section (Styled like the CallScene avatar) */}
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={commanderAvatarSource} 
            alt="AI Commander" 
            // Replicated avatar style
            className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
          />
          <h3 className="text-xl font-bold text-cyan-400">AI Commander Report:</h3>
        </div>

        <div className={`p-4 ${isConfirmedExoplanet ? 'bg-green-900/30' : isFalsePositive ? 'bg-red-900/30' : 'bg-yellow-900/30'} rounded-lg border-l-4 ${isConfirmedExoplanet ? 'border-green-400' : isFalsePositive ? 'border-red-400' : 'border-yellow-400'} mb-6`}>
            <div className='flex items-center justify-center space-x-3'>
                {icon}
                <h2 className={`text-3xl font-extrabold ${titleColor}`}>
                    {reportTitle}
                </h2>
            </div>
        </div>

        {/* Message Body (Styled like the CallScene message box) */}
        <p 
          className="text-lg text-white mb-6 p-4 bg-gray-700/50 rounded-lg text-left"
          // Using dangerouslySetInnerHTML to allow for the **bolding** inside the messageText
          dangerouslySetInnerHTML={{ __html: messageText }}
        />

        {/* Acknowledge Button (Styled like the CallScene button) */}
        <button
          onClick={onClose}
          // Replicated button style
          className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-lg font-bold transition-all shadow-lg flex items-center justify-center"
        >
          Acknowledged, Captain
        </button>
      </motion.div>
    </motion.div>
  );
};

export default CaptainMessage;