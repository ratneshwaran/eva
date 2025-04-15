'use client';

import { Message } from '../../types/chat';

interface MessageListProps {
  messages?: Message[];
}

export default function MessageList({ messages = [] }: MessageListProps) {
  if (!messages) return null;
  
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`animate-fade-in flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-sm">
                {message.role === 'user' ? 'You' : 'Mind AI'}
              </span>
              <span className={`text-xs ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={`whitespace-pre-wrap ${message.role === 'user' ? 'text-white' : 'text-gray-900'} text-base`}>
              {message.content}
              {message.role === 'assistant' && message.id === 'welcome' && (
                <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
                  <span>Powered by</span>
                  <a 
                    href="https://40seconds.org" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center hover:opacity-80 transition-opacity"
                  >
                    <div className="h-6 px-3 bg-[#1a1b2e] rounded flex items-center justify-center">
                      <span className="text-white text-sm font-medium tracking-wide">40seconds</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
