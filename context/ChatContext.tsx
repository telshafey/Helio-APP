import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { ChatMessage, ChatContextType } from '../types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: Date.now(),
            role: 'model',
            content: 'مرحباً! أنا مساعد هيليو. كيف يمكنني مساعدتك اليوم في مدينة هليوبوليس الجديدة؟'
        }
    ]);

    const chatRef = useRef<Chat | null>(null);

    // Initialize the chat session
    const initializeChat = useCallback(() => {
        if (!chatRef.current) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: 'You are Helio, a friendly and helpful assistant for residents of Heliopolis New City. Your goal is to answer questions about the city, its services, properties, and community. Be concise, friendly, and always answer in Arabic.',
                    },
                });
            } catch (error) {
                console.error("Failed to initialize Gemini Chat:", error);
                setMessages(prev => [...prev, { id: Date.now(), role: 'model', content: 'عذراً، لم أتمكن من الاتصال بالمساعد الآن.' }]);
            }
        }
    }, []);

    const toggleChat = useCallback(() => {
        setIsChatOpen(prev => {
            if (!prev) { // If opening the chat
                initializeChat();
            }
            return !prev;
        });
    }, [initializeChat]);

    const sendMessage = useCallback(async (message: string) => {
        if (!chatRef.current || isLoading) return;

        setIsLoading(true);
        
        const userMessage: ChatMessage = {
            id: Date.now(),
            role: 'user',
            content: message,
        };
        
        // Use a temporary ID for the model's message to update it during streaming
        const modelMessageId = Date.now() + 1;
        
        setMessages(prev => [...prev, userMessage, { id: modelMessageId, role: 'model', content: '' }]);

        try {
            const stream = await chatRef.current.sendMessageStream({ message });
            
            for await (const chunk of stream) {
                // Update the content of the model's message in the state
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === modelMessageId
                            ? { ...msg, content: msg.content + chunk.text }
                            : msg
                    )
                );
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === modelMessageId
                        ? { ...msg, content: 'عفواً، حدث خطأ ما. يرجى المحاولة مرة أخرى.' }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const value: ChatContextType = {
        isChatOpen,
        toggleChat,
        messages,
        sendMessage,
        isLoading,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};