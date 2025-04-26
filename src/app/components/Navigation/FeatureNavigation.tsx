// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50 relative">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Mind AI</h1>
              </div>
              <div className="h-6 px-2 md:px-3 bg-[#1a1b2e] rounded flex items-center justify-center">
                <span className="text-white text-xs md:text-sm font-medium tracking-wide">40seconds</span>
              </div>
              <span className="text-xs md:text-sm text-gray-600">Your Mental Health Assistant</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile floating button */}
      <button
        className="fixed z-30 bottom-24 left-4 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Open features menu"
        onClick={() => setIsMobileOpen(true)}
        style={{ display: isMobileOpen ? 'none' : 'block' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar for desktop and mobile drawer */}
        {/* Desktop sidebar */}
        <div className={`
          hidden md:block
          transition-all duration-300 bg-white border-r border-gray-200 p-4 overflow-y-auto
          ${isMinimized ? 'w-16' : 'w-80'}
        `}>
          <button
            aria-label={isMinimized ? 'Expand sidebar' : 'Minimize sidebar'}
            onClick={() => setIsMinimized((v) => !v)}
            className="mb-4 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isMinimized ? (
              <span title="Expand">▶️</span>
            ) : (
              <span title="Minimize">◀️</span>
            )}
          </button>
          <div className="space-y-2">
            {FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`
                  w-full rounded-lg text-left transition-all flex items-center ${isMinimized ? 'justify-center p-3' : 'p-4'}
                  ${activeFeature === feature.id
                    ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                    : 'bg-white border-2 border-gray-100 hover:border-blue-200'
                  }
                `}
              >
                <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                {!isMinimized && (
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        {/* Mobile sidebar drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close sidebar overlay"
            />
            {/* Drawer */}
            <div className="relative w-4/5 max-w-xs bg-white border-r border-gray-200 p-4 overflow-y-auto h-full shadow-xl animate-slide-in-left">
              <button
                aria-label="Close sidebar"
                onClick={() => setIsMobileOpen(false)}
                className="mb-4 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span title="Close">✖️</span>
              </button>
              <div className="space-y-2">
                {FEATURES.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => {
                      setActiveFeature(feature.id);
                      setIsMobileOpen(false);
                    }}
                    className={`
                      w-full rounded-lg text-left transition-all flex items-center p-4
                      ${activeFeature === feature.id
                        ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
                        : 'bg-white border-2 border-gray-100 hover:border-blue-200'
                      }
                    `}
                  >
                    <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                    <div className="ml-3">
                      <h3 className="text-base font-semibold text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content: always render each feature but toggle via hidden class */}
        <div className="flex-1 overflow-y-auto relative">
          <div className={`${activeFeature === 'chat' ? 'block' : 'hidden'} h-full`}> 
            <ChatInterface />
          </div>
          <div className={`${activeFeature === 'breathing' ? 'block' : 'hidden'} h-full`}> 
            <BreathingExercise />
          </div>
          <div className={`${activeFeature === 'resources' ? 'block' : 'hidden'} h-full`}> 
            <CrisisSupport />
          </div>
        </div>
      </div>
      {/* Mobile sidebar slide-in animation */}
      <style jsx global>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.2s ease-out;
        }
      `}</style>
    </div>
  );
} 