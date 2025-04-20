'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DynamicAvatarProps {
  state: 'idle' | 'userTyping' | 'aiTyping' | 'waiting';
}

export default function DynamicAvatar({ state }: DynamicAvatarProps) {
  const getAvatarContent = () => {
    switch (state) {
      case 'userTyping':
        return (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-white text-6xl"
            >
              😊
            </motion.div>
          </motion.div>
        );
      
      case 'aiTyping':
        return (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <motion.div className="text-white text-6xl">
              🤔
            </motion.div>
          </motion.div>
        );
      
      case 'waiting':
        return (
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <div className="text-white text-6xl">
              😌
            </div>
          </motion.div>
        );
      
      default: // idle
        return (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <div className="text-white text-6xl">
              🙂
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getAvatarContent()}
    </div>
  );
} 