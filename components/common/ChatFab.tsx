import React from 'react';
import { useChat } from '../../context/ChatContext';
import { ChatBubbleOvalLeftEllipsisIcon } from './Icons';

const ChatFab: React.FC = () => {
    const { toggleChat } = useChat();

    return (
        <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-cyan-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 ease-in-out z-30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            aria-label="Open chat assistant"
        >
            <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8" />
        </button>
    );
};

export default ChatFab;