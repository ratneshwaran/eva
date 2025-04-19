'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedMessageProps {
  message: string;
  messageId: string;
}

export default function AnimatedMessage({ message, messageId }: AnimatedMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const animateText = () => {
      if (currentIndex < message.length) {
        setDisplayedMessage(message.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(animateText, 20);
      } else {
        setIsComplete(true);
      }
    };

    if (messageId === 'welcome') {
      setDisplayedMessage(message);
      setIsComplete(true);
    } else {
      animateText();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message, messageId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre-wrap"
    >
      {displayedMessage}
    </motion.div>
  );
} 