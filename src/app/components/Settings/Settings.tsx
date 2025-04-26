// Author: Ratneshwaran Maheswaran
// Affiliation: University College London
// Email: ratneshwaran.maheswaran.21@ucl.ac.uk

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface DeletedMessage {
  id: string;
  content: string;
  timestamp: Date;
  chatId: string;
}

interface SettingsProps {
  deletedMessages: DeletedMessage[];
  onRestoreMessage?: (messageId: string) => void;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  saveHistory: boolean;
  allowDataCollection: boolean;
  theme: 'blue' | 'purple' | 'green';
  onSettingsChange: (settings: {
    soundEnabled: boolean;
    desktopEnabled: boolean;
    saveHistory: boolean;
    allowDataCollection: boolean;
    theme: 'blue' | 'purple' | 'green';
  }) => void;
}

export default function Settings({ 
  deletedMessages, 
  onRestoreMessage,
  soundEnabled,
  desktopEnabled,
  saveHistory,
  allowDataCollection,
  theme,
  onSettingsChange
}: SettingsProps) {
  const { theme: currentTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'history'>('general');

  const handleSettingChange = (
    setting: 'soundEnabled' | 'desktopEnabled' | 'saveHistory' | 'allowDataCollection',
    value: boolean
  ) => {
    // Update only the toggled setting, keep others unchanged
    const newSettings = {
      soundEnabled: setting === 'soundEnabled' ? value : soundEnabled,
      desktopEnabled: setting === 'desktopEnabled' ? value : desktopEnabled,
      saveHistory: setting === 'saveHistory' ? value : saveHistory,
      allowDataCollection:
        setting === 'allowDataCollection' ? value : allowDataCollection,
      theme: currentTheme,
    };
    onSettingsChange(newSettings);
  };

  useEffect(() => {
    if (desktopEnabled) {
      Notification.requestPermission().then((permission) => {
        if (permission !== 'granted') {
          handleSettingChange('desktopEnabled', false);
        }
      });
    }
  }, [desktopEnabled]);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 px-1 ${
            activeTab === 'general'
              ? `border-b-2 border-${currentTheme}-600 text-${currentTheme}-600`
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 ${
            activeTab === 'history'
              ? `border-b-2 border-${currentTheme}-600 text-${currentTheme}-600`
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Message History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'general' ? (
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="rounded-lg p-4 shadow-sm border bg-white border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Sound notifications</span>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                    className={`form-checkbox h-4 w-4 accent-${currentTheme}-600 transition duration-150 ease-in-out`}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Desktop notifications</span>
                  <input
                    type="checkbox"
                    checked={desktopEnabled}
                    onChange={(e) => handleSettingChange('desktopEnabled', e.target.checked)}
                    className={`form-checkbox h-4 w-4 accent-${currentTheme}-600 transition duration-150 ease-in-out`}
                  />
                </label>
              </div>
            </div>

            {/* Account */}
            <div className="rounded-lg p-4 shadow-sm border bg-white border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Account</h3>
              {user && (
                <button
                  onClick={() => signOut()}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout ({user.email})
                </button>
              )}
            </div>

            {/* Theme Selection */}
            <div className="rounded-lg p-4 shadow-sm border bg-white border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Theme</h3>
              <div className="space-y-2">
                {(['blue','purple','green'] as const).map(color => (
                  <label key={color} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="theme"
                      value={color}
                      checked={theme === color}
                      onChange={() => onSettingsChange({ soundEnabled, desktopEnabled, saveHistory, allowDataCollection, theme: color })}
                      className={`form-radio h-4 w-4 accent-${color}-600`}
                    />
                    <span className="capitalize text-gray-700">{color}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg p-4 shadow-sm border bg-white border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Recently Deleted Messages</h3>
              {deletedMessages.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No deleted messages</p>
              ) : (
                <div className="space-y-4">
                  {deletedMessages.map((message) => (
                    <div key={message.id} className="flex items-start justify-between border-b pb-4 border-gray-200">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{message.content}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {onRestoreMessage && (
                        <button
                          onClick={() => onRestoreMessage(message.id)}
                          className={`ml-4 text-sm text-${currentTheme}-600 hover:text-${currentTheme}-700`}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 