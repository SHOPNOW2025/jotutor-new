import React, { useState } from 'react';
import { FAQItem } from '../types';

interface FAQPageProps {
  faqs: FAQItem[];
  strings: { [key: string]: string };
}

const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-right py-5 px-6"
            >
                <span className="font-semibold text-lg text-blue-900">{item.question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            {isOpen && (
                <div className="px-6 pb-5 text-gray-600">
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};

const FAQPage: React.FC<FAQPageProps> = ({ faqs, strings }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.faqTitle}</h1>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
            {faqs.map(item => <FAQAccordion key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
