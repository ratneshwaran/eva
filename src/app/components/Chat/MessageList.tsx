'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import Avatar from './Avatar';
import AnimatedMessage from './AnimatedMessage';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isSidebarOpen: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning!';
  if (hour >= 12 && hour < 17) return 'Good afternoon!';
  if (hour >= 17 && hour < 22) return 'Good evening!';
  return 'Hello!';
};

export default function MessageList({ messages, isTyping, isSidebarOpen }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full flex flex-col pb-24">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className="flex-shrink-0">
              <Avatar role={message.role} />
            </div>
            <div
              className={`px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white ml-auto max-w-[80%]'
                  : 'bg-white text-gray-900 shadow-sm mr-auto max-w-[80%]'
              }`}
            >
              {message.isTyping ? (
                <div className="whitespace-pre-wrap text-[16px] leading-relaxed">
                  {message.content}
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-[16px] leading-relaxed">
                  {message.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
