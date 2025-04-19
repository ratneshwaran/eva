'use client';

import { Message } from '@/types/chat';
import { motion } from 'framer-motion';
import PromptCard from './PromptCard';
import Avatar from './Avatar';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
  isSidebarOpen?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning!';
  if (hour >= 12 && hour < 17) return 'Good afternoon!';
  if (hour >= 17 && hour < 22) return 'Good evening!';
  return 'Hello!';
};

export default function MessageList({ messages, isTyping = false, isSidebarOpen = true }: MessageListProps) {
  return (
    <div className="w-full flex flex-col pb-24">
      <div className="flex-1 w-full space-y-6 px-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <Avatar state="default" />
              </div>
            )}
            
            <div
              className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto max-w-[80%]'
                  : 'bg-white text-gray-900 shadow-sm mr-auto max-w-[80%]'
              }`}
            >
              <div className="whitespace-pre-wrap text-[16px] leading-relaxed">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Avatar state="thinking" />
            </div>
            <div className="bg-white shadow-sm px-4 py-3 rounded-2xl mr-auto max-w-[80%]">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500 px-4 mt-auto py-2">
        Powered by{' '}
        <a
          href="https://40seconds.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
        >
          40seconds.org
        </a>
      </div>
    </div>
  );
}
