import React, { useState, useEffect } from 'react';

interface DeletedMessage {
  id: string;
  content: string;
  timestamp: Date;
  chatId: string;
}

interface UserSettings {
  soundEnabled: boolean;
  desktopEnabled: boolean;
  saveHistory: boolean;
  allowDataCollection: boolean;
}

interface SettingsProps {
  deletedMessages: DeletedMessage[];
  onRestoreMessage?: (messageId: string) => void;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  saveHistory: boolean;
  allowDataCollection: boolean;
  onSettingsChange: (settings: UserSettings) => void;
}

export default function Settings({ 
  deletedMessages, 
  onRestoreMessage,
  soundEnabled,
  desktopEnabled,
  saveHistory,
  allowDataCollection,
  onSettingsChange
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'history'>('general');

  const handleSettingChange = (setting: keyof UserSettings, value: boolean) => {
    onSettingsChange({
      soundEnabled,
      desktopEnabled,
      saveHistory,
      allowDataCollection,
      [setting]: value
    });
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
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-600 text-blue-600'
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
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Desktop notifications</span>
                  <input
                    type="checkbox"
                    checked={desktopEnabled}
                    onChange={(e) => handleSettingChange('desktopEnabled', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                </label>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="rounded-lg p-4 shadow-sm border bg-white border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Privacy</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Save chat history</span>
                  <input
                    type="checkbox"
                    checked={saveHistory}
                    onChange={(e) => handleSettingChange('saveHistory', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Allow data collection for improvement</span>
                  <input
                    type="checkbox"
                    checked={allowDataCollection}
                    onChange={(e) => handleSettingChange('allowDataCollection', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                </label>
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
                          className="ml-4 text-sm text-blue-600 hover:text-blue-700"
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