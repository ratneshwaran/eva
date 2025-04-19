import { motion } from 'framer-motion';
import { FaRegSmile, FaRegClock } from 'react-icons/fa';
import { BsEmojiSmileUpsideDown, BsLightbulb } from 'react-icons/bs';

type AvatarState = 'default' | 'thinking' | 'responding' | 'listening';

interface AvatarProps {
  state: AvatarState;
  size?: number;
}

export default function Avatar({ state = 'default', size = 40 }: AvatarProps) {
  const getIcon = () => {
    switch (state) {
      case 'thinking':
        return <BsEmojiSmileUpsideDown className="text-blue-500" />;
      case 'responding':
        return <BsLightbulb className="text-yellow-500" />;
      case 'listening':
        return <FaRegClock className="text-green-500" />;
      default:
        return <FaRegSmile className="text-blue-600" />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ 
        scale: state === 'thinking' ? [0.8, 1.1, 0.8] : 1,
        rotate: state === 'responding' ? [0, 10, -10, 0] : 0
      }}
      transition={{ 
        duration: state === 'thinking' ? 2 : 0.5,
        repeat: state === 'thinking' ? Infinity : 0,
        ease: "easeInOut"
      }}
      className={`
        rounded-full bg-white p-2 shadow-md
        flex items-center justify-center
        border-2 border-gray-200
      `}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={{ 
          opacity: state === 'listening' ? [1, 0.5, 1] : 1 
        }}
        transition={{ 
          duration: 1.5,
          repeat: state === 'listening' ? Infinity : 0,
          ease: "easeInOut"
        }}
        style={{ fontSize: size * 0.6 }}
      >
        {getIcon()}
      </motion.div>
    </motion.div>
  );
} 