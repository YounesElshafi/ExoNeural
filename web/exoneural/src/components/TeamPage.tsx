import React from 'react';
import { motion } from 'framer-motion';
import { User, Code, Database, Brain, Rocket, Star } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const TeamPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Unis Shrief",
      role: "Machine Learning Engineer (Leader)",
      description: "Team leader and ML expert specializing in astronomical data analysis and exoplanet detection algorithms using advanced neural networks.",
      icon: <Brain className="w-8 h-8" />,
      gradient: "from-purple-600/20 to-cyan-600/20 border-purple-500/30"
    },
    {
      name: "Sameh Sobhi",
      role: "Data Engineer",
      description: "Specializes in big data processing, pipeline optimization, and astronomical database management for exoplanet datasets.",
      icon: <Database className="w-8 h-8" />,
      gradient: "from-green-600/20 to-emerald-600/20 border-green-500/30"
    },
    {
      name: "Omar Abdelall",
      role: "Data Engineer",
      description: "Expert in data preprocessing, feature engineering, and building robust data pipelines for machine learning workflows.",
      icon: <Database className="w-8 h-8" />,
      gradient: "from-blue-600/20 to-indigo-600/20 border-blue-500/30"
    },
    {
      name: "Amr Samy",
      role: "Fullstack Web Developer",
      description: "Frontend and backend development, creating seamless user experiences for space science applications with modern web technologies.",
      icon: <Code className="w-8 h-8" />,
      gradient: "from-cyan-600/20 to-blue-600/20 border-cyan-500/30"
    },
    {
      name: "Yassmin Awni",
      role: "Researcher & Video Editor",
      description: "Conducts research on exoplanet detection methods and creates engaging video content to communicate our findings.",
      icon: <Star className="w-8 h-8" />,
      gradient: "from-pink-600/20 to-rose-600/20 border-pink-500/30"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            Meet the ExoNeural Team
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Passionate developers and data scientists working together to advance exoplanet discovery
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full border border-purple-400/30"
          >
            <Rocket className="w-5 h-5 text-purple-300 mr-2" />
            <span className="text-sm text-purple-300 font-medium">
              NASA Space Apps Challenge 2024
            </span>
          </motion.div>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className={`bg-gradient-to-br ${member.gradient} backdrop-blur-lg rounded-2xl p-8 border shadow-2xl group cursor-pointer`}
            >
              {/* Icon and Role */}
              <div className="flex items-center justify-between mb-6">
                <motion.div
                  className="text-white group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {member.icon}
                </motion.div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 uppercase tracking-wider">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Name */}
              <motion.h3
                className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300"
              >
                {member.name}
              </motion.h3>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed text-sm group-hover:text-gray-200 transition-colors duration-300">
                {member.description}
              </p>

              {/* Animated border effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)`,
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-lg rounded-2xl p-12 border border-purple-500/30 shadow-2xl max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-white mb-6"
              animate={{ 
                textShadow: [
                  '0 0 10px rgba(139, 92, 246, 0.5)',
                  '0 0 20px rgba(139, 92, 246, 0.8)',
                  '0 0 10px rgba(139, 92, 246, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Our Mission
            </motion.h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              To democratize exoplanet detection through artificial intelligence, making the wonders 
              of space science accessible to researchers, educators, and space enthusiasts worldwide.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-cyan-400 font-semibold mb-2">Innovation</h4>
                <p className="text-gray-400">Pushing the boundaries of AI in astronomy</p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-2">Accuracy</h4>
                <p className="text-gray-400">Delivering precise exoplanet classifications</p>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h4 className="text-pink-400 font-semibold mb-2">Accessibility</h4>
                <p className="text-gray-400">Making space science tools available to all</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPage;