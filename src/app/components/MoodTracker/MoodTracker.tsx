// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

'use client';

import { useState } from 'react';

interface MoodEntry {
  mood: number;
  note: string;
  timestamp: Date;
}

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊'];

export default function MoodTracker() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [currentNote, setCurrentNote] = useState('');

  const logMood = (moodLevel: number) => {
    const newEntry: MoodEntry = {
      mood: moodLevel,
      note: currentNote,
      timestamp: new Date(),
    };
    setMoodEntries([...moodEntries, newEntry]);
    setCurrentNote('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mood Tracker</h2>
      
      <div className="mb-6">
        <p className="text-lg text-gray-700 mb-4">How are you feeling right now?</p>
        <div className="flex justify-center space-x-6">
          {MOOD_EMOJIS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => logMood(index)}
              className="text-4xl hover:scale-110 transition-transform p-2 rounded-full hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <textarea
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Add a note about how you're feeling... (optional)"
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
          rows={3}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Mood History</h3>
        <div className="space-y-4">
          {moodEntries.slice().reverse().map((entry, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
              <div className="flex-1">
                <p className="text-gray-600">{entry.note || 'No note added'}</p>
                <p className="text-sm text-gray-500">
                  {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 