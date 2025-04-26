// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

import { motion } from 'framer-motion';

interface MessageProps {
  text: string;
  isUser: boolean;
}

export function Message({ text, isUser }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col max-w-[85%] ${isUser ? 'ml-auto' : ''}`}
    >
      <div
        className={`p-5 rounded-lg shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="text-lg">
          {text}
        </div>
      </div>
    </motion.div>
  );
} 