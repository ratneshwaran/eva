'use client';

import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { useTheme } from '../../contexts/ThemeContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function MessageInput({ onSendMessage, isLoading = false, value, onChange }: MessageInputProps) {
  const [localMessage, setLocalMessage] = useState('');
  const { theme } = useTheme();
  const buttonColorMap = {
    blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    purple: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    green: { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
  } as const;
  const { bg, hover } = buttonColorMap[theme];

  const handleSend = () => {
    const messageToSend = value || localMessage;
    if (messageToSend.trim() && !isLoading) {
      onSendMessage(messageToSend);
      if (!onChange) {
        setLocalMessage('');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setLocalMessage(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <textarea
        value={value || localMessage}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        rows={1}
        disabled={isLoading}
        className="flex-1 px-6 py-3 text-base text-gray-700 bg-white rounded-full border border-gray-200 focus:outline-none focus:border-blue-400 resize-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      />
      <button
        onClick={handleSend}
        disabled={!(value || localMessage).trim() || isLoading}
        className={`w-12 h-12 ${bg} text-white rounded-full ${hover} transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-sm`}
        aria-label="Send message"
      >
        <IoSend size={20} />
      </button>
    </div>
  );
}

export default MessageInput;