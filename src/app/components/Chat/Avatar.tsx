import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaUser } from 'react-icons/fa';

interface AvatarProps {
  role: 'user' | 'assistant';
}

export default function Avatar({ role }: AvatarProps) {
  const { theme } = useTheme();
  const bgClass = `bg-${theme}-600`;
  if (role === 'user') {
    return (
      <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
        <FaUser className="w-5 h-5 text-white" />
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full ${bgClass} flex items-center justify-center`}>
      <span className="text-white text-lg font-semibold">E</span>
    </div>
  );
} 