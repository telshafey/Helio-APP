import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { XMarkIcon } from './Icons';
import Logo from './Logo';

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 p-2" dir="ltr">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);


const ChatModal: React.FC = () => {
    const { isChatOpen, toggleChat, messages, sendMessage, isLoading } = useChat();
    const [input, setInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };

    if (!isChatOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100%-2rem)] max-w-sm h-[70vh] max-h-[500px] z-40" dir="rtl">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full h-full flex flex-col animate-chat-popup">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Logo className="h-7" />
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">مساعد هيليو</h3>
                    </div>
                    <button onClick={toggleChat} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Messages */}
                <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-3 py-2 rounded-xl whitespace-pre-wrap ${
                                msg.role === 'user' 
                                ? 'bg-cyan-500 text-white rounded-br-none'
                                : 'bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-slate-100 dark:bg-slate-700 rounded-xl rounded-bl-none">
                                <TypingIndicator />
                             </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="اسأل أي شيء..."
                            className="flex-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-cyan-500 text-white p-2.5 rounded-full hover:bg-cyan-600 disabled:bg-slate-400">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -rotate-90">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatModal;