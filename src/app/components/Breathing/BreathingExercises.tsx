'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type BreathingPattern = {
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfterExhale?: number;
};

const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: 'Box Breathing',
    description: 'Through the nose into the belly, hold, slowly out the mouth, hold at the bottom.',
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
  },
  {
    name: '4-7-8 Breathing',
    description: 'A natural tranquilizer for the nervous system, helping reduce anxiety and promote sleep.',
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
  {
    name: 'Relaxing Breath',
    description: 'A gentle breathing pattern for deep relaxation and stress relief.',
    inhale: 5,
    hold: 2,
    exhale: 6,
  },
];

export default function BreathingExercises() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'holdAfterExhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [progress, setProgress] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (!isBreathing) {
      setProgress(0);
      setTotalTime(0);
      return;
    }

    const updateInterval = 8; // 120fps for smoother animation
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.05) {
          switch (currentPhase) {
            case 'inhale':
              setCurrentPhase('hold');
              return selectedPattern.hold;
            case 'hold':
              setCurrentPhase('exhale');
              return selectedPattern.exhale;
            case 'exhale':
              if (selectedPattern.holdAfterExhale) {
                setCurrentPhase('holdAfterExhale');
                return selectedPattern.holdAfterExhale;
              }
              setCurrentPhase('inhale');
              setTotalTime(0);
              return selectedPattern.inhale;
            case 'holdAfterExhale':
              setCurrentPhase('inhale');
              setTotalTime(0);
              return selectedPattern.inhale;
          }
        }
        return prev - (updateInterval / 1000);
      });

      setTotalTime(prev => {
        const totalDuration = getTotalDuration();
        const newTime = prev + updateInterval / 1000;
        return newTime >= totalDuration ? 0 : newTime;
      });

      setProgress((prev) => {
        // Calculate progress based on the phase duration and countdown
        switch (currentPhase) {
          case 'inhale': {
            const phaseProgress = (selectedPattern.inhale - countdown) / selectedPattern.inhale;
            return phaseProgress * 25;
          }
          case 'hold': {
            const phaseProgress = (selectedPattern.hold - countdown) / selectedPattern.hold;
            return 25 + (phaseProgress * 25);
          }
          case 'exhale': {
            const phaseProgress = (selectedPattern.exhale - countdown) / selectedPattern.exhale;
            return 50 + (phaseProgress * 25);
          }
          case 'holdAfterExhale': {
            const holdTime = selectedPattern.holdAfterExhale || 1;
            const phaseProgress = (holdTime - countdown) / holdTime;
            return 75 + (phaseProgress * 25);
          }
          default:
            return 0;
        }
      });
    }, updateInterval);

    return () => clearInterval(timer);
  }, [isBreathing, currentPhase, selectedPattern, countdown]);

  const getTotalDuration = () => {
    return selectedPattern.inhale + selectedPattern.hold + selectedPattern.exhale + 
           (selectedPattern.holdAfterExhale || 0);
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'text-blue-600';
      case 'hold':
        return 'text-blue-600';
      case 'exhale':
        return 'text-teal-600';
      case 'holdAfterExhale':
        return 'text-sky-400';
    }
  };

  const getBreathPath = () => {
    const width = 100;
    const height = 80;
    const midY = height/2;
    const topY = height/4;
    const bottomY = height*3/4;
    
    // Create SVG path for breathing pattern
    let path = `M 0,${midY} `; // Start at middle left
    
    // Inhale curve up (0-25%)
    path += `C 15,${midY} 20,${topY} 25,${topY} `;
    // Hold at top (25-50%)
    path += `L 50,${topY} `;
    // Exhale curve down (50-75%)
    path += `C 55,${topY} 60,${bottomY} 75,${bottomY} `;
    // Hold at bottom (75-100%)
    path += `L 100,${bottomY}`;
    
    return path;
  };

  const getProgressPath = (progress: number) => {
    const width = 100;
    const height = 80;
    const midY = height/2;
    const topY = height/4;
    const bottomY = height*3/4;
    
    // Return empty path at start of new cycle
    if (progress === 0) {
      return '';
    }
    
    let path = `M 0,${midY} `;
    
    if (progress <= 25) {
      // Inhale curve up (0-25%)
      const t = progress / 25;
      const p0 = midY;  // start y
      const p1 = midY;  // first control point y
      const p2 = topY;  // second control point y
      const p3 = topY;  // end y
      
      const x0 = 0;     // start x
      const x1 = 15;    // first control point x
      const x2 = 20;    // second control point x
      const x3 = 25;    // end x
      
      const currentX = x0*(1-t)**3 + 3*x1*t*(1-t)**2 + 3*x2*t**2*(1-t) + x3*t**3;
      const currentY = p0*(1-t)**3 + 3*p1*t*(1-t)**2 + 3*p2*t**2*(1-t) + p3*t**3;
      
      return `M 0,${midY} C ${x1},${p1} ${x2},${p2} ${currentX},${currentY}`;
    } else if (progress <= 50) {
      // Complete inhale curve
      path += `C 15,${midY} 20,${topY} 25,${topY} `;
      // Draw hold line only up to current progress
      const holdX = 25 + ((progress - 25) / 25) * 25;
      return path + `L ${holdX},${topY}`;
    } else if (progress <= 75) {
      // Complete inhale and hold
      path += `C 15,${midY} 20,${topY} 25,${topY} L 50,${topY} `;
      
      // Exhale curve down (50-75%)
      const t = (progress - 50) / 25;
      const p0 = topY;    // start y
      const p1 = topY;    // first control point y
      const p2 = bottomY; // second control point y
      const p3 = bottomY; // end y
      
      const x0 = 50;    // start x
      const x1 = 55;    // first control point x
      const x2 = 60;    // second control point x
      const x3 = 75;    // end x
      
      const currentX = x0*(1-t)**3 + 3*x1*t*(1-t)**2 + 3*x2*t**2*(1-t) + x3*t**3;
      const currentY = p0*(1-t)**3 + 3*p1*t*(1-t)**2 + 3*p2*t**2*(1-t) + p3*t**3;
      
      return path + `C ${x1},${p1} ${x2},${p2} ${currentX},${currentY}`;
    } else {
      // Complete inhale, hold, and exhale
      path += `C 15,${midY} 20,${topY} 25,${topY} L 50,${topY} C 55,${topY} 60,${bottomY} 75,${bottomY} `;
      // Draw final hold line only up to current progress
      const holdX = Math.min(75 + ((progress - 75) / 25) * 25, 100);
      return path + `L ${holdX},${bottomY}`;
    }
  };

  // Calculate the total path length once
  const pathLength = 100; // Using 100 as our base unit for simplicity

  const getYPosition = (progress: number) => {
    const height = 80;
    const midY = height/2;
    const topY = height/4;
    const bottomY = height*3/4;

    if (progress <= 25) {
      // Inhale - cubic bezier curve up
      const t = progress / 25;
      const p0 = midY;
      const p1 = midY;
      const p2 = topY;
      const p3 = topY;
      return p0*(1-t)**3 + 3*p1*t*(1-t)**2 + 3*p2*t**2*(1-t) + p3*t**3;
    } else if (progress <= 50) {
      // Hold at top
      return topY;
    } else if (progress <= 75) {
      // Exhale - cubic bezier curve down
      const t = (progress - 50) / 25;
      const p0 = topY;
      const p1 = topY;
      const p2 = bottomY;
      const p3 = bottomY;
      return p0*(1-t)**3 + 3*p1*t*(1-t)**2 + 3*p2*t**2*(1-t) + p3*t**3;
    } else {
      // Hold at bottom
      return bottomY;
    }
  };

  const getPhaseDisplay = (phase: string) => {
    switch (phase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
      case 'holdAfterExhale':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      default:
        return phase;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Breathing Exercises
      </h1>
      
      {/* Pattern Selection */}
      <div className="flex justify-center gap-4 mb-8">
        {BREATHING_PATTERNS.map((pattern) => (
          <button
            key={pattern.name}
            onClick={() => {
              setSelectedPattern(pattern);
              setIsBreathing(false);
              setCurrentPhase('inhale');
              setCountdown(pattern.inhale);
            }}
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedPattern.name === pattern.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {pattern.name}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
        {selectedPattern.description}
      </p>

      {/* Breathing Animation Container */}
      <div className="relative flex items-center justify-center gap-8 mb-8">
        {/* Animation */}
        <div className="relative w-full max-w-xl aspect-[2/1]">
          <svg
            viewBox="0 0 100 80"
            className="w-full h-full"
            style={{ transform: 'translateX(-5%)' }}
          >
            {/* Background guide path */}
            <path
              d={getBreathPath()}
              stroke="#E5E7EB"
              strokeWidth="2"
              fill="none"
            />
            
            {/* Moving indicator */}
            <motion.circle
              cx={progress}
              cy={getYPosition(progress)}
              r="4"
              className="fill-blue-600"
            />
          </svg>
        </div>

        {/* Phase indicator - Now on the right side */}
        <div className="w-32 flex-shrink-0">
          <h2 className={`text-4xl font-bold ${getPhaseColor()}`}>
            {isBreathing ? getPhaseDisplay(currentPhase) : 'Ready'}
          </h2>
          {isBreathing && (
            <div className="text-2xl text-gray-600 mt-2">
              {Math.ceil(countdown)}s
            </div>
          )}
        </div>
      </div>

      {/* Start/Stop Button */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setIsBreathing(!isBreathing);
            if (!isBreathing) {
              setCurrentPhase('inhale');
              setCountdown(selectedPattern.inhale);
            }
          }}
          className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isBreathing ? 'Stop Breathing Exercise' : 'Start Breathing Exercise'}
        </button>
      </div>
    </div>
  );
} 