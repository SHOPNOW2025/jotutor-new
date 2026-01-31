import React, { useState, useEffect, useRef } from 'react';
// Fix: Corrected import path for types.
import { Course, ChatMessage, Language } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { JOD_TO_USD_RATE } from '../constants';

interface ChatbotProps {
    courses: Course[];
    onSelectCourse: (id: string) => void;
    strings: { [key: string]: string };
    language: Language;
}

const Chatbot: React.FC<ChatbotProps> = ({ courses, onSelectCourse, strings, language }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Effect to manage the introductory tooltip
    useEffect(() => {
        const showTimer = setTimeout(() => {
            if (!isOpen) {
                setShowTooltip(true);
            }
        }, 2000); // Show tooltip after 2 seconds

        const hideTimer = setTimeout(() => {
            setShowTooltip(false);
        }, 9000); // Hide it after 7 more seconds

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isOpen]); // Re-evaluate if chat opens/closes, though it mainly runs once.


    useEffect(() => {
        if (isOpen) {
            setShowTooltip(false); // Hide tooltip immediately when chat is opened
            if (messages.length === 0) {
                setMessages([{ sender: 'bot', text: strings.chatbotWelcome }]);
            }
        }
    }, [isOpen, messages.length, strings.chatbotWelcome]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await getChatbotResponse(trimmedInput, courses);
            
            const recommendedCourses = courses.filter(course => 
                response.recommendedCourseIds.includes(Number(course.id)) // Gemini may return numbers
            );
            
            const botMessage: ChatMessage = {
                sender: 'bot',
                text: response.responseText,
                courses: recommendedCourses.length > 0 ? recommendedCourses : undefined
            };

            setMessages(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Tooltip */}
            <div 
                role="tooltip"
                className={`fixed bottom-24 right-6 w-64 bg-blue-900 text-white p-3 rounded-lg shadow-lg z-50 transition-all duration-500 ease-in-out ${showTooltip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <p className="text-sm text-center">
                    {strings.chatbotTooltip}
                </p>
                {/* Arrow */}
                <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-blue-900"></div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform duration-300 z-50 ${isOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}
                aria-label="Open Chat"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[600px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex-shrink-0 bg-blue-900 text-white p-4 flex justify-between items-center rounded-t-xl">
                    <h3 className="font-bold text-lg">{strings.chatbotTitle}</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    {msg.courses && msg.courses.length > 0 && (
                                        <div className="mt-3">
                                            <p className="font-semibold text-sm mb-2">{strings.chatbotRecommendedCourses}</p>
                                            <div className="space-y-2">
                                                {msg.courses.map(course => (
                                                    <div key={course.id} onClick={() => { onSelectCourse(course.id); setIsOpen(false); }} className="bg-white p-2 rounded-md shadow cursor-pointer hover:shadow-lg transition-shadow">
                                                        <p className="font-bold text-blue-900 text-sm">{course.title}</p>
                                                        <p className="text-xs text-gray-600">{course.category} - {course.price}{strings.jod}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-lg bg-gray-200 text-gray-500 text-sm italic">
                                   {strings.chatbotTyping}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="flex-shrink-0 p-4 border-t">
                    <form onSubmit={handleSend} className="flex space-x-2 space-x-reverse">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={strings.chatbotPlaceholder}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                        />
                        <button type="submit" disabled={isLoading} className="bg-blue-900 text-white font-bold px-4 rounded-lg hover:bg-blue-800 disabled:bg-gray-400">
                           {strings.chatbotSend}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
