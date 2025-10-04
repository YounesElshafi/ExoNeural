import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Users, Award } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative z-10 mt-16 py-12 border-t border-purple-500/20"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
           style={{ cursor: 'pointer' }}
          >
            <Users className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-white mb-2">ExoNeural Team</h4>
            <p className="text-gray-300 text-sm">
             5 passionate developers and data scientists working together to advance exoplanet discovery
            </p>
           <p className="text-cyan-400 text-xs mt-2 font-medium">
             Click to meet our team →
           </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
          >
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-white mb-2">NASA Space Apps Challenge</h4>
            <p className="text-gray-300 text-sm">
              2025 Local Hackathon - Exploring space science through innovative technology solutions
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-gray-900/50 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20"
          >
            <Rocket className="w-8 h-8 text-pink-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-white mb-2">Mission</h4>
            <p className="text-gray-300 text-sm">
              Democratizing exoplanet detection through AI and making space science accessible to everyone
            </p>
          </motion.div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 ExoNeural Team. Built with ❤️ for NASA Space Apps Challenge.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Advancing the search for worlds beyond our solar system through artificial intelligence.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;