'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageList, MessageInput } from '.';
import { Message } from '@/types/chat';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Hello! I\'m Mind AI, your mental health assistant. I\'m here to listen and support you with understanding and compassion. While I\'m not a replacement for professional therapy, I can help you explore your thoughts and feelings, and suggest coping strategies. How are you feeling today?',
  timestamp: new Date(),
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messages }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending message:', error);
        setError(error.message);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <MessageList messages={messages} />
          {error && (
            <div className="text-red-500 text-center p-2 mb-2 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
          <div className="mt-2 flex items-center justify-end space-x-2 text-xs text-gray-500">
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
        </div>
      </div>
    </div>
  );
}