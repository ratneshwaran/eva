// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

import { FC } from 'react';

interface PromptCardProps {
  title: string;
  description: string;
}

const PromptCard: FC<PromptCardProps> = ({ title, description }) => {
  return (
    <button 
      className="w-full max-w-[250px] text-left p-5 bg-white rounded-xl border hover:border-gray-300 hover:shadow-sm transition-all duration-200"
      onClick={() => {
        // Handle prompt selection
      }}
    >
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </button>
  );
};

export default PromptCard; 