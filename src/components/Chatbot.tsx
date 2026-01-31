import React, { useState, useEffect, useRef } from 'react';
import { Course, ChatMessage, Language } from '../types';
import { getChatbotResponse } from '../services/geminiService';

interface ChatbotProps {
    courses: Course[];
    onSelectCourse: (id: string) => void;
    strings: { [key: string]: string };
    language: Language;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ courses, onSelectCourse, strings, language, isOpen, setIsOpen }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Message for under construction
    const underConstructionMsg = "المساعد الذكي Mr.Pincel تحت الإنشاء حالياً وسيكون متاحاً لمساعدتكم قريباً جداً. نحن نعمل بجهد لتقديم تجربة تعليمية فريدة مدعومة بالذكاء الاصطناعي. شكراً لصبركم!";

    useEffect(() => {
        const showTimer = setTimeout(() => {
            if (!isOpen) {
                setShowTooltip(true);
            }
        }, 2000);

        const hideTimer = setTimeout(() => {
            setShowTooltip(false);
        }, 9000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isOpen]);


    useEffect(() => {
        if (isOpen) {
            setShowTooltip(false);
            if (messages.length === 0) {
                // Set initial message to the construction notice
                setMessages([{ sender: 'bot', text: underConstructionMsg }]);
            }
        }
    }, [isOpen, messages.length]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        // Temporarily disabled
        return;
    };

    const mrPincelIcon = "https://i.ibb.co/sd7GkLLT/image-removebg-preview.png";

    return (
        <>
            {/* Tooltip */}
            <div 
                role="tooltip"
                className={`fixed bottom-24 right-6 w-64 bg-blue-900 text-white p-3 rounded-lg shadow-lg z-50 transition-all duration-500 ease-in-out ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <p className="text-sm text-center font-medium">
                    {language === 'ar' ? 'قريباً: مساعدك الذكي Mr.Pincel' : 'Coming Soon: Mr.Pincel AI Assistant'}
                </p>
                <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-900"></div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-2 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform duration-300 z-50 border-2 border-white ${isOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}
                aria-label="Open Chat"
            >
                <img 
                    src={mrPincelIcon} 
                    alt="Mr.Pincel" 
                    className="w-14 h-14 object-contain"
                />
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex-shrink-0 bg-blue-900 text-white p-4 flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="bg-white rounded-full p-1">
                             <img src={mrPincelIcon} alt="Mr.Pincel" className="w-8 h-8 object-contain" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{strings.chatbotTitle}</h3>
                            <p className="text-xs text-orange-400 font-bold">Under Construction 🚧</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col items-center justify-center text-center">
                    <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-inner max-w-[90%]">
                        <div className="text-4xl mb-4">🚧</div>
                        <p className="text-blue-900 font-bold text-lg mb-2">Mr.Pincel قادم قريباً!</p>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {underConstructionMsg}
                        </p>
                    </div>
                    <div ref={messagesEndRef} />
                </div>

                {/* Input (Disabled) */}
                <div className="flex-shrink-0 p-4 border-t bg-gray-100">
                    <div className="flex space-x-2 space-x-reverse opacity-50 cursor-not-allowed">
                        <input
                            disabled
                            type="text"
                            placeholder="المحادثة مغلقة مؤقتاً..."
                            className="flex-1 p-2 border border-gray-300 rounded-lg bg-gray-200"
                        />
                        <button disabled className="bg-gray-400 text-white font-bold px-4 rounded-lg">
                           {strings.chatbotSend}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;