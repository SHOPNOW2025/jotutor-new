import React, { useState, useCallback } from 'react';
import { generateLessonPlan } from '../services/geminiService';
import { Language, HomepageContent } from '../types';

interface AILessonPlannerProps {
    content: HomepageContent;
    strings: { [key: string]: string };
    language: Language;
}

const AILessonPlanner: React.FC<AILessonPlannerProps> = ({ content, strings, language }) => {
    const [subject, setSubject] = useState('الرياضيات');
    const [level, setLevel] = useState('ابتدائي');
    const [topic, setTopic] = useState('مقدمة في الجمع');
    const [lessonPlan, setLessonPlan] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGeneratePlan = useCallback(async () => {
        if (!topic.trim()) {
            setError(strings.errorEnterTopic);
            return;
        }
        setIsLoading(true);
        setError('');
        setLessonPlan('');

        try {
            const plan = await generateLessonPlan(subject, level, topic);
            setLessonPlan(plan);
        } catch (err) {
            setError(strings.errorFailedPlan);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [subject, level, topic, strings]);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-blue-900">{content?.aiPlannerTitle || strings.aiPlannerTitle}</h2>
                    <p className="mt-4 text-lg text-gray-600">{content?.aiPlannerSubtitle || strings.aiPlannerSubtitle}</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label htmlFor="ai-subject" className="block text-sm font-medium text-gray-700 mb-1">{strings.subject}</label>
                            <select id="ai-subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                                <option>الرياضيات</option>
                                <option>العلوم</option>
                                <option>اللغة العربية</option>
                                <option>اللغة الإنجليزية</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ai-level" className="block text-sm font-medium text-gray-700 mb-1">{strings.level}</label>
                            <select id="ai-level" value={level} onChange={e => setLevel(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                                <option>ابتدائي</option>
                                <option>متوسط</option>
                                <option>ثانوي</option>
                            </select>
                        </div>
                        <div className="md:col-span-3">
                            <label htmlFor="ai-topic" className="block text-sm font-medium text-gray-700 mb-1">{strings.topic}</label>
                            <input type="text" id="ai-topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder={strings.topicPlaceholder} className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"/>
                        </div>
                    </div>
                    <button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-blue-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {strings.generating}...
                            </>
                        ) : strings.generatePlan}
                    </button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    {lessonPlan && (
                        <div className="mt-8 p-6 bg-gray-100 border-r-4 border-green-500 rounded-md">
                            <h4 className="text-xl font-bold text-blue-900 mb-4">{strings.suggestedPlan}</h4>
                            <pre className="whitespace-pre-wrap text-gray-700 font-sans">{lessonPlan}</pre>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AILessonPlanner;
