import React, { useState, useEffect } from 'react';
// Fix: Corrected import path for types.
import { OnboardingOptions } from '../types';

interface ManageOnboardingProps {
  options: OnboardingOptions;
  onUpdate: (newOptions: OnboardingOptions) => void;
}

const OptionManager: React.FC<{ title: string; items: string[]; setItems: (items: string[]) => void; }> = ({ title, items, setItems }) => {
    const [newItem, setNewItem] = useState('');

    const handleAddItem = () => {
        if (newItem.trim() && !items.includes(newItem.trim())) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemoveItem = (itemToRemove: string) => {
        setItems(items.filter(item => item !== itemToRemove));
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
            <div className="flex space-x-2 space-x-reverse mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={`إضافة ${title.toLowerCase()}...`}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <button
                    onClick={handleAddItem}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                    إضافة
                </button>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-gray-800">{item}</span>
                        <button
                            onClick={() => handleRemoveItem(item)}
                            className="p-1 text-red-500 hover:bg-red-100 rounded-full"
                            aria-label={`Remove ${item}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ManageOnboarding: React.FC<ManageOnboardingProps> = ({ options, onUpdate }) => {
    const [localOptions, setLocalOptions] = useState<OnboardingOptions>(options);
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setLocalOptions(options);
    }, [options]);

    const handleUpdateList = (key: keyof OnboardingOptions, newList: string[]) => {
        setLocalOptions(prev => ({ ...prev, [key]: newList }));
    };

    const handleSaveChanges = () => {
        onUpdate(localOptions);
        setStatus({ message: 'تم حفظ التغييرات بنجاح!', type: 'success' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">إدارة مراحل التسجيل</h1>
            
            <div className="space-y-8">
                <OptionManager 
                    title="نوع الخدمة" 
                    items={localOptions.serviceTypes}
                    setItems={(newList) => handleUpdateList('serviceTypes', newList)}
                />
                {/* Fix: Corrected property name from 'levels' to 'educationStages' to match the type definition. */}
                <OptionManager 
                    title="المرحلة الدراسية" 
                    items={localOptions.educationStages}
                    setItems={(newList) => handleUpdateList('educationStages', newList)}
                />
                 <OptionManager 
                    title="المنهاج التعليمي" 
                    items={localOptions.curriculums}
                    setItems={(newList) => handleUpdateList('curriculums', newList)}
                />
                 <OptionManager 
                    title="المواد الدراسية" 
                    items={localOptions.subjects}
                    setItems={(newList) => handleUpdateList('subjects', newList)}
                />
                 <OptionManager 
                    title="اللغات (لخيار تعلم لغات جديدة)" 
                    items={localOptions.languages || []}
                    setItems={(newList) => handleUpdateList('languages', newList)}
                />
            </div>
            
            <div className="mt-8 pt-6 border-t flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <button onClick={handleSaveChanges} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                    حفظ كل التغييرات
                </button>
                {status && <p className={`text-sm font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>}
            </div>
        </div>
    );
};

export default ManageOnboarding;