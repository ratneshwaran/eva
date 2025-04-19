'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import MessageList from './MessageList';
import { MessageInput } from './MessageInput';
import { IoMenu, IoClose } from 'react-icons/io5';
import { BsChatDots } from 'react-icons/bs';
import { FaLungs, FaShieldAlt, FaInfoCircle, FaHeart, FaDog } from 'react-icons/fa';
import { GiMeditation } from 'react-icons/gi';
import { MdOutlineSos } from 'react-icons/md';
import { PiDogFill } from 'react-icons/pi';
import BreathingExercises from '../Breathing/BreathingExercises';
import CrisisResources from '../Crisis/CrisisResources';
import EthicsPrinciples from '../Ethics/EthicsPrinciples';
import Avatar from './Avatar';

const WELCOME_MESSAGE = `Hi! I'm Eva, and I'm here to listen and support you.

I can help by:
• Creating a safe space to talk
• Listening without judgment
• Sharing helpful coping tips
• Guiding you through breathing exercises

Just remember - I'm not a therapist, so for urgent support, 
please check our Crisis Help section.

How are you feeling today? I'm here to listen.`;

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const quickActions: QuickAction[] = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Guided exercises to help you relax and find calm',
    icon: <FaLungs className="w-6 h-6" />,
  },
  {
    id: 'crisis',
    title: 'Crisis Resources',
    description: 'Immediate help and support when you need it most',
    icon: <MdOutlineSos className="w-6 h-6" />,
  },
  {
    id: 'meditation',
    title: 'Meditation Guide',
    description: 'Simple meditation techniques for mental wellness',
    icon: <GiMeditation className="w-6 h-6" />,
  },
];

function FirstTimeInfo({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Important Information About Eva</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-blue-700 mb-2">What Eva Can Do:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Help explore thoughts and feelings</li>
                <li>Suggest coping strategies</li>
                <li>Provide mental health resources</li>
                <li>Guide breathing exercises</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg text-red-700 mb-2">Important Limitations:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Not a replacement for professional therapy</li>
                <li>Cannot diagnose conditions or prescribe treatments</li>
                <li>Responses based on training, not real-time medical knowledge</li>
                <li>Not for crisis situations - please contact emergency services</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              I understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('chat');
  const [showFirstTimeInfo, setShowFirstTimeInfo] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    preview: string;
    messages: Message[];
    timestamp: Date;
    title: string;
  }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      // Convert string timestamps back to Date objects
      const historyWithDates = parsedHistory.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChatHistory(historyWithDates);
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  const startNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date()
    }]);
    
    // Add new chat to history
    setChatHistory(prev => [{
      id: newChatId,
      preview: 'New conversation',
      title: 'New conversation',
      messages: [{
        id: 'welcome',
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: new Date()
      }],
      timestamp: new Date()
    }, ...prev]);
  };

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    // Update chat history
    setChatHistory(prev => {
      const chatIndex = prev.findIndex(c => c.id === currentChatId);
      if (chatIndex === -1) {
        // If this is a new chat, add it to history
        return [{
          id: currentChatId,
          preview: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          messages: updatedMessages,
          timestamp: new Date()
        }, ...prev];
      }
      // Update existing chat
      const updatedHistory = [...prev];
      updatedHistory[chatIndex] = {
        ...updatedHistory[chatIndex],
        preview: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        messages: updatedMessages,
        timestamp: new Date()
      };
      return updatedHistory;
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (!data.message) {
        throw new Error('Invalid response from server');
      }
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Update chat history with AI response
      setChatHistory(prev => {
        const chatIndex = prev.findIndex(c => c.id === currentChatId);
        const updatedHistory = [...prev];
        updatedHistory[chatIndex] = {
          ...updatedHistory[chatIndex],
          messages: finalMessages,
          timestamp: new Date()
        };
        return updatedHistory;
      });

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessageInput = (message: string) => {
    handleSendMessage(message);
  };

  const deleteChat = (chatId: string, event: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent triggering the chat selection if event exists
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    // If the deleted chat was the current chat, start a new chat
    if (chatId === currentChatId) {
      if (chatHistory.length <= 1) {
        startNewChat();
      } else {
        // Switch to the most recent remaining chat
        const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          const mostRecentChat = remainingChats[0];
          setCurrentChatId(mostRecentChat.id);
          setMessages(mostRecentChat.messages);
        }
      }
    }
  };

  const startRenaming = (chatId: string, currentTitle: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const handleRename = (chatId: string, event: React.FormEvent) => {
    event.preventDefault();
    if (editTitle.trim()) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, title: editTitle.trim() }
          : chat
      ));
      setEditingChatId(null);
      setEditTitle('');
    }
  };

  const deleteAllChats = () => {
    if (window.confirm('Are you sure you want to delete all conversations? This cannot be undone.')) {
      setChatHistory([]);
      startNewChat();
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6">
              <MessageList 
                messages={messages} 
                isTyping={isLoading}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
            <div className="px-6 py-4 -mt-8">
              <MessageInput 
                onSendMessage={handleMessageInput}
                isLoading={isLoading}
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
              )}
            </div>
          </div>
        );
      case 'breathing':
        return <div className="h-full overflow-y-auto"><BreathingExercises /></div>;
      case 'crisis':
        return <div className="h-full overflow-y-auto"><CrisisResources /></div>;
      case 'ethics':
        return <div className="h-full overflow-y-auto"><EthicsPrinciples /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {showFirstTimeInfo && (
        <FirstTimeInfo onClose={() => setShowFirstTimeInfo(false)} />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed md:relative w-72 h-full bg-gray-50 border-r transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 z-30`}>
        <div className="p-4 h-full flex flex-col">
          {/* Logo and Version */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <PiDogFill className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">Eva</span>
            <span className="text-sm font-medium text-gray-600 ml-auto px-2 py-0.5 bg-gray-100 rounded">Beta</span>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full mb-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BsChatDots className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Chat History Container */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {/* Recent Chats */}
            <div className="flex-1 overflow-y-auto mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Recent Conversations</h3>
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <p className="text-lg mb-2">It's quiet in here...</p>
                  <p className="text-sm">Start a new conversation to begin chatting with Eva</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chatHistory
                    .filter(chat => 
                      searchQuery ? 
                        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        chat.preview.toLowerCase().includes(searchQuery.toLowerCase()) : 
                        true
                    )
                    .map((chat) => (
                      <div key={chat.id} className="flex items-center px-2">
                        <div className="flex-1 flex items-center min-w-0">
                          {editingChatId === chat.id ? (
                            <form 
                              onSubmit={(e) => handleRename(chat.id, e)}
                              className="flex-1 flex items-center min-w-0 pr-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                                autoFocus
                                onBlur={() => {
                                  if (editTitle.trim()) {
                                    handleRename(chat.id, new Event('submit') as any);
                                  } else {
                                    setEditingChatId(null);
                                  }
                                }}
                              />
                            </form>
                          ) : (
                            <button
                              onClick={() => {
                                loadChat(chat.id);
                                setActiveSection('chat');
                              }}
                              className={`flex-1 p-2 text-left rounded-lg hover:bg-gray-100 transition-colors min-w-0 ${
                                currentChatId === chat.id && activeSection === 'chat' ? 'bg-gray-100' : ''
                              }`}
                            >
                              <div className="font-medium text-gray-900 truncate text-sm">
                                {chat.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {chat.timestamp.toLocaleString()}
                              </div>
                            </button>
                          )}
                          <button
                            onClick={(e) => startRenaming(chat.id, chat.title, e)}
                            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            title="Rename conversation"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this conversation?')) {
                              deleteChat(chat.id, e);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-1"
                          title="Delete conversation"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Features Navigation - Fixed at bottom */}
            <div className="flex-shrink-0 border-t pt-6 mb-4">
              <div className="text-sm font-semibold text-gray-600 mb-2 px-2">Support Tools</div>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSection('breathing')}
                  className={`w-full flex items-center p-3.5 rounded-lg transition-colors ${
                    activeSection === 'breathing'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaLungs className="w-6 h-6 mr-3" />
                  <span className="font-medium">Breathing</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('crisis')}
                  className={`w-full flex items-center p-3.5 rounded-lg transition-colors ${
                    activeSection === 'crisis'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <MdOutlineSos className="w-6 h-6 mr-3" />
                  <span className="font-medium">Crisis Help</span>
                </button>
                
                <button
                  onClick={() => setActiveSection('ethics')}
                  className={`w-full flex items-center p-3.5 rounded-lg transition-colors ${
                    activeSection === 'ethics'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaShieldAlt className="w-6 h-6 mr-3" />
                  <span className="font-medium">Ethics</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4 justify-between bg-white">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
          </button>
          <div className="flex items-center gap-4 flex-1">
            <h1 className="text-2xl font-bold">
              <span className="text-gray-700">A Safe Space to Talk</span>
            </h1>
          </div>
          <button
            onClick={() => setShowFirstTimeInfo(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
          >
            <FaInfoCircle size={20} />
            <span className="text-sm font-semibold">About Eva</span>
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}