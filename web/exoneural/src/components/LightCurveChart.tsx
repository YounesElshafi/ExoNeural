import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LightCurveChart: React.FC = () => {
  // Generate dummy light curve data showing a transit
  const generateLightCurveData = () => {
    const data = [];
    const totalPoints = 100;
    const transitStart = 40;
    const transitEnd = 60;
    const transitDepth = 0.02; // 2% brightness drop
    
    for (let i = 0; i < totalPoints; i++) {
      let brightness = 1.0;
      
      // Add some noise
      brightness += (Math.random() - 0.5) * 0.005;
      
      // Create transit dip
      if (i >= transitStart && i <= transitEnd) {
        const transitProgress = (i - transitStart) / (transitEnd - transitStart);
        const transitShape = Math.sin(transitProgress * Math.PI);
        brightness -= transitDepth * transitShape;
      }
      
      data.push({
        time: i * 0.1, // Time in days
        brightness: brightness,
        normalized: brightness
      });
    }
    
    return data;
  };

  const data = generateLightCurveData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/90 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-white text-sm">
            Time: <span className="text-cyan-400">{label.toFixed(2)} days</span>
          </p>
          <p className="text-white text-sm">
            Brightness: <span className="text-purple-400">{payload[0].value.toFixed(4)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-gradient-to-br from-gray-900/80 to-purple-900/40 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Simulated Light Curve Data
      </h3>
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(1)}d`}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
              tickFormatter={(value) => value.toFixed(3)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="brightness"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: '#06B6D4',
                stroke: '#0891B2',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-800/30 rounded-lg p-3 text-center">
          <p className="text-gray-400">Transit Depth</p>
          <p className="text-cyan-400 font-bold">~2.0%</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3 text-center">
          <p className="text-gray-400">Transit Duration</p>
          <p className="text-purple-400 font-bold">~2.0 days</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3 text-center">
          <p className="text-gray-400">Data Points</p>
          <p className="text-green-400 font-bold">100</p>
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mt-4 text-center">
        This simulated light curve shows a typical exoplanet transit signature with a characteristic brightness dip.
      </p>
    </motion.div>
  );
};

export default LightCurveChart;