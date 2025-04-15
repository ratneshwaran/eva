'use client';

import { useState } from 'react';
import ChatInterface from '../Chat/ChatInterface';
import BreathingExercise from '../Breathing/BreathingExercise';
import CrisisSupport from '../Resources/CrisisSupport';

type Feature = 'chat' | 'breathing' | 'resources';

interface FeatureInfo {
  id: Feature;
  name: string;
  description: string;
  icon: string;
}

const FEATURES: FeatureInfo[] = [
  {
    id: 'chat',
    name: 'Empathetic AI',
    description: 'Talk with Mind AI about your thoughts and feelings',
    icon: '💭'
  },
  {
    id: 'breathing',
    name: 'Breathing Exercises',
    description: 'Guided breathing for relaxation and stress relief',
    icon: '🫁'
  },
  {
    id: 'resources',
    name: 'Crisis Resources',
    description: 'Access mental health support and crisis resources',
    icon: '🆘'
  }
];

export default function FeatureNavigation() {
  const [activeFeature, setActiveFeature] = useState<Feature>('chat');

  const renderFeature = () => {
    switch (activeFeature) {
      case 'chat':
        return <ChatInterface />;
      case 'breathing':
        return <BreathingExercise />;
      case 'resources':
        return <CrisisSupport />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Mind AI</h1>
              </div>
              <div className="h-6 px-3 bg-[#1a1b2e] rounded flex items-center justify-center">
                <span className="text-white text-sm font-medium tracking-wide">40seconds</span>
              </div>
              <span className="text-sm text-gray-600">Your Mental Health Assistant</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div className="space-y-2">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`
                  w-full p-4 rounded-lg text-left transition-all
                  ${activeFeature === feature.id
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                    : 'bg-white border-2 border-gray-100 hover:border-blue-200'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full">
            {renderFeature()}
          </div>
        </div>
      </div>
    </div>
  );
} 