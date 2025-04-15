'use client';

import { useState, useEffect } from 'react';

const BREATHING_PATTERNS = {
  calm: { inhale: 4, hold: 4, exhale: 4, name: 'Box Breathing' },
  relax: { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Relaxing Breath' },
  energize: { inhale: 6, hold: 0, exhale: 2, name: 'Energizing Breath' },
};

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';
type BreathingPattern = keyof typeof BREATHING_PATTERNS;

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [pattern, setPattern] = useState<BreathingPattern>('calm');
  const [phase, setPhase] = useState<BreathingPhase>('rest');
  const [timer, setTimer] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          const currentPattern = BREATHING_PATTERNS[pattern];
          
          if (phase === 'inhale' && prev >= currentPattern.inhale) {
            setPhase('hold');
            return 0;
          } else if (phase === 'hold' && prev >= currentPattern.hold) {
            setPhase('exhale');
            return 0;
          } else if (phase === 'exhale' && prev >= currentPattern.exhale) {
            setPhase('inhale');
            setCycles((prev) => prev + 1);
            return 0;
          }
          
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, phase, pattern]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimer(0);
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('rest');
    setTimer(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Breathing Exercises</h2>
      
      <div className="mb-6">
        <label className="block text-lg text-gray-700 mb-2">Choose a breathing pattern:</label>
        <select
          value={pattern}
          onChange={(e) => setPattern(e.target.value as BreathingPattern)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          disabled={isActive}
        >
          {Object.entries(BREATHING_PATTERNS).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center mb-8">
        <div className={`
          w-48 h-48 rounded-full flex items-center justify-center
          transition-all duration-1000
          ${phase === 'inhale' ? 'scale-150 bg-blue-100' : ''}
          ${phase === 'hold' ? 'scale-150 bg-green-100' : ''}
          ${phase === 'exhale' ? 'scale-100 bg-purple-100' : ''}
          ${phase === 'rest' ? 'scale-100 bg-gray-100' : ''}
        `}>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {phase === 'rest' ? 'Ready' : phase}
            </div>
            {phase !== 'rest' && (
              <div className="text-xl text-gray-600">{timer}s</div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-lg text-gray-700 mb-2">
          Completed cycles: {cycles}
        </p>
        <button
          onClick={isActive ? stopExercise : startExercise}
          className={`
            px-6 py-3 rounded-lg text-white font-semibold text-lg
            ${isActive
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-600 hover:bg-blue-700'
            }
            transition-colors
          `}
        >
          {isActive ? 'Stop' : 'Start'} Exercise
        </button>
      </div>

      <div className="text-gray-700">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Find a comfortable position and relax your body</li>
          <li>Follow the breathing circle: expand as you inhale, hold, and contract as you exhale</li>
          <li>Keep your breathing smooth and natural</li>
          <li>If you feel lightheaded, stop and return to normal breathing</li>
        </ul>
      </div>
    </div>
  );
} 