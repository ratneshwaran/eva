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
import { IoSettingsSharp } from 'react-icons/io5';
import BreathingExercises from '../Breathing/BreathingExercises';
import CrisisResources from '../Crisis/CrisisResources';
import EthicsPrinciples from '../Ethics/EthicsPrinciples';
import Settings from '../Settings/Settings';
import Avatar from './Avatar';
import SoundManager from '@/app/utils/sounds';

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
  const [typingMessage, setTypingMessage] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const typingSpeed = 30; // milliseconds per character
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'chat' | 'breathing' | 'crisis' | 'ethics' | 'settings'>('chat');
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
  const [deletedMessages, setDeletedMessages] = useState<{
    id: string;
    content: string;
    timestamp: Date;
    chatId: string;
  }[]>([]);
  const [userSettings, setUserSettings] = useState({
    soundEnabled: false,
    desktopEnabled: false,
    saveHistory: true,
    allowDataCollection: true
  });

  // Load chat history from localStorage on component mount
  useEffect(() => {
    // Pull saved chat history, fall back to default welcome chat if none exists
    const saved = localStorage.getItem('chatHistory');
    let historyWithDates: typeof chatHistory = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        historyWithDates = parsed.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg: any) => ({ ...msg, timestamp: new Date(msg.timestamp) }))
        }));
      } catch {
        historyWithDates = [];
      }
    }
    // If no previous chats, seed with welcome message
    if (historyWithDates.length === 0) {
      const defaultChat = {
        id: 'default',
        preview: WELCOME_MESSAGE.slice(0, 30) + (WELCOME_MESSAGE.length > 30 ? '...' : ''),
        title: 'Welcome',
        messages: [
          { id: 'welcome', role: 'assistant' as 'assistant', content: WELCOME_MESSAGE, timestamp: new Date() }
        ] as Message[],
        timestamp: new Date()
      };
      historyWithDates = [defaultChat];
    }
    setChatHistory(historyWithDates);
    setCurrentChatId(historyWithDates[0].id);
    // Initialize messages from history
    setMessages(historyWithDates[0].messages);
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Load deleted messages from localStorage
  useEffect(() => {
    const savedDeletedMessages = localStorage.getItem('deletedMessages');
    if (savedDeletedMessages) {
      const parsedMessages = JSON.parse(savedDeletedMessages);
      // Convert string timestamps back to Date objects
      const messagesWithDates = parsedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setDeletedMessages(messagesWithDates);
    }
  }, []);

  // Save deleted messages to localStorage
  useEffect(() => {
    localStorage.setItem('deletedMessages', JSON.stringify(deletedMessages));
  }, [deletedMessages]);

  // Modify the chat history sync effect to be more precise
  useEffect(() => {
    if (activeSection === 'chat' && !isLoading && !isTyping) {
      setChatHistory(prev => {
        const idx = prev.findIndex(c => c.id === currentChatId);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          messages: messages,
          timestamp: new Date()
        };
        return updated;
      });
    }
  }, [messages, currentChatId, activeSection, isLoading, isTyping]);

  // Load user settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Initialize audio context on first user interaction
  const initializeAudio = () => {
    if (userSettings.soundEnabled) {
      SoundManager.preloadSounds();
    }
  };

  // Add click handler to document to initialize audio
  useEffect(() => {
    const handleFirstInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, []);

  // Function to simulate typing effect
  const simulateTyping = async (message: string) => {
    setIsTyping(true);
    setTypingMessage('');
    setTypingIndex(0);

    return new Promise<void>((resolve) => {
      const typeNextChar = () => {
        setTypingMessage(prev => prev + message[typingIndex]);
        setTypingIndex(prevIndex => {
          if (prevIndex + 1 === message.length) {
            setIsTyping(false);
            resolve();
            return prevIndex;
          }
          return prevIndex + 1;
        });
      };

      const typingInterval = setInterval(() => {
        if (typingIndex < message.length) {
          typeNextChar();
        } else {
          clearInterval(typingInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typingInterval);
    });
  };

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
      // Ensure we're not in the middle of typing when loading a new chat
      setIsTyping(false);
      setIsLoading(false);
      setMessages(chat.messages.map(msg => ({ ...msg, isTyping: false })));
    }
  };

  // Modify handleSendMessage to handle message updates more carefully
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage],
          allowDataCollection: userSettings.allowDataCollection
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (!data.message) {
        throw new Error('Invalid response from server');
      }

      // Create the assistant message first
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true
      };

      // Add the empty assistant message
      setMessages(prev => [...prev, assistantMessage]);

      // Type out the message
      let typedContent = '';
      for (const char of data.message) {
        typedContent += char;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: typedContent }
              : msg
          )
        );
        await new Promise(resolve => setTimeout(resolve, typingSpeed));
      }

      // Mark typing as complete
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, isTyping: false }
            : msg
        )
      );

      // Play sound if enabled
      if (userSettings.soundEnabled) {
        await SoundManager.playSound('messageReceived', 0.5);
      }

    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send message. Please try again.');
      // Remove the failed message
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
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
    event?.stopPropagation();
    // Store the messages before deleting the chat
    const chatToDelete = chatHistory.find(chat => chat.id === chatId);
    if (chatToDelete) {
      const messagesToStore = chatToDelete.messages
        .filter(msg => msg.role === 'user')
        .map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          chatId: chatId
        }));
      setDeletedMessages(prev => [...messagesToStore, ...prev]);
    }
    
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    if (chatId === currentChatId) {
      if (chatHistory.length <= 1) {
        startNewChat();
      } else {
        const remainingChats = chatHistory.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          const mostRecentChat = remainingChats[0];
          setCurrentChatId(mostRecentChat.id);
          setMessages(mostRecentChat.messages);
        }
      }
    }
  };

  const handleRestoreMessage = (messageId: string) => {
    const messageToRestore = deletedMessages.find(msg => msg.id === messageId);
    if (messageToRestore) {
      // Add the message to the current chat
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageToRestore.content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Remove from deleted messages
      setDeletedMessages(prev => prev.filter(msg => msg.id !== messageId));
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

  // Clear any typing flags on initial mount so old messages stay static
  useEffect(() => {
    setMessages(prev => prev.map(msg => ({ ...msg, isTyping: false })));
  }, []);

  const handleSectionChange = (section: 'chat' | 'breathing' | 'crisis' | 'ethics' | 'settings') => {
    if (section === 'chat') {
      // When returning to chat, load the current chat's messages
      const currentChat = chatHistory.find(chat => chat.id === currentChatId);
      if (currentChat) {
        setMessages(currentChat.messages);
      }
    }
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return (
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 pb-10">
                <MessageList 
                  messages={messages} 
                  isTyping={isLoading}
                  isSidebarOpen={isSidebarOpen}
                />
              </div>
            <div className="px-6 py-4">
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
      case 'settings':
        return (
          <div className="h-full overflow-y-auto">
            <Settings
              deletedMessages={deletedMessages}
              onRestoreMessage={handleRestoreMessage}
              soundEnabled={userSettings.soundEnabled}
              desktopEnabled={userSettings.desktopEnabled}
              saveHistory={userSettings.saveHistory}
              allowDataCollection={userSettings.allowDataCollection}
              onSettingsChange={(newSettings) => {
                setUserSettings(newSettings);
                localStorage.setItem('userSettings', JSON.stringify(newSettings));
              }}
            />
          </div>
        );
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
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-600">Eva</span>
              <a
                href="https://40seconds.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                by 40seconds.org
              </a>
            </div>
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
                    .map(chat => (
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
                            deleteChat(chat.id, e);
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
                  onClick={() => handleSectionChange('breathing')}
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
                  onClick={() => handleSectionChange('crisis')}
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
                  onClick={() => handleSectionChange('ethics')}
                  className={`w-full flex items-center p-3.5 rounded-lg transition-colors ${
                    activeSection === 'ethics'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaShieldAlt className="w-6 h-6 mr-3" />
                  <span className="font-medium">Ethics</span>
                </button>
                
                <button
                  onClick={() => handleSectionChange('settings')}
                  className={`w-full flex items-center p-3.5 rounded-lg transition-colors ${
                    activeSection === 'settings'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IoSettingsSharp className="w-6 h-6 mr-3" />
                  <span className="font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-white">
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}