
import React, { useState, useEffect } from 'react';
import { OnboardingOptions } from '../types';

interface ManageOnboardingProps {
  options: OnboardingOptions;
  onUpdate: (newOptions: OnboardingOptions) => void;
  isEnglishAdmin?: boolean;
}

const OptionManager: React.FC<{ title: string; items: string[]; setItems: (items: string[]) => void; isEnglishAdmin?: boolean }> = ({ title, items = [], setItems, isEnglishAdmin }) => {
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
                    placeholder={isEnglishAdmin ? `Add ${title}...` : `إضافة ${title.toLowerCase()}...`}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <button
                    onClick={handleAddItem}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
                >
                    {isEnglishAdmin ? 'Add' : 'إضافة'}
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


const ManageOnboarding: React.FC<ManageOnboardingProps> = ({ options, onUpdate, isEnglishAdmin }) => {
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
        setStatus({ message: isEnglishAdmin ? 'Changes saved successfully!' : 'تم حفظ التغييرات بنجاح!', type: 'success' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEnglishAdmin ? 'Onboarding Steps (English)' : 'إدارة مراحل التسجيل'}</h1>
            
            <div className="space-y-8">
                <OptionManager 
                    title={isEnglishAdmin ? "Service Types" : "نوع الخدمة"}
                    items={isEnglishAdmin ? (localOptions.serviceTypes_en || []) : localOptions.serviceTypes}
                    setItems={(newList) => handleUpdateList(isEnglishAdmin ? 'serviceTypes_en' : 'serviceTypes', newList)}
                    isEnglishAdmin={isEnglishAdmin}
                />
                <OptionManager 
                    title={isEnglishAdmin ? "Education Stages" : "المرحلة الدراسية"}
                    items={isEnglishAdmin ? (localOptions.educationStages_en || []) : localOptions.educationStages}
                    setItems={(newList) => handleUpdateList(isEnglishAdmin ? 'educationStages_en' : 'educationStages', newList)}
                    isEnglishAdmin={isEnglishAdmin}
                />
                 <OptionManager 
                    title={isEnglishAdmin ? "Curriculums" : "المنهاج التعليمي"}
                    items={isEnglishAdmin ? (localOptions.curriculums_en || []) : localOptions.curriculums}
                    setItems={(newList) => handleUpdateList(isEnglishAdmin ? 'curriculums_en' : 'curriculums', newList)}
                    isEnglishAdmin={isEnglishAdmin}
                />
                 <OptionManager 
                    title={isEnglishAdmin ? "Subjects" : "المواد الدراسية"}
                    items={isEnglishAdmin ? (localOptions.subjects_en || []) : localOptions.subjects}
                    setItems={(newList) => handleUpdateList(isEnglishAdmin ? 'subjects_en' : 'subjects', newList)}
                    isEnglishAdmin={isEnglishAdmin}
                />
            </div>
            
            <div className="mt-8 pt-6 border-t flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <button onClick={handleSaveChanges} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors">
                    {isEnglishAdmin ? 'Save Changes' : 'حفظ كل التغييرات'}
                </button>
                {status && <p className={`text-sm font-semibold ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.message}</p>}
            </div>
        </div>
    );
};

export default ManageOnboarding;
