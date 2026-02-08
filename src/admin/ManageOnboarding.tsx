
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
        <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-green-500">
            <h2 className="text-xl font-bold text-gray-700 mb-4">{title}</h2>
            <div className="flex space-x-2 space-x-reverse mb-4">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={isEnglishAdmin ? `Add ${title}...` : `إضافة ${title.toLowerCase()}...`}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button onClick={handleAddItem} className="bg-blue-900 text-white font-bold py-2 px-6 rounded-xl">إضافة</button>
            </div>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                        <span className="text-sm font-bold">{item}</span>
                        <button onClick={() => handleRemoveItem(item)} className="text-red-500 font-bold hover:text-red-700">×</button>
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
        setStatus({ message: isEnglishAdmin ? 'English lists updated!' : 'تم تحديث القوائم بنجاح!', type: 'success' });
        setTimeout(() => setStatus(null), 3000);
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-black text-blue-900 mb-6">
                {isEnglishAdmin ? 'Registration Steps (English)' : 'مراحل التسجيل (عربي)'}
            </h1>
            
            <div className="space-y-6">
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
                    title={isEnglishAdmin ? "Curriculums" : "المناهج"}
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
            
            <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <button onClick={handleSaveChanges} className="bg-green-600 text-white font-black py-4 px-12 rounded-2xl shadow-xl hover:bg-green-700 transition-all">
                    حفظ التغييرات
                </button>
                {status && <p className="text-green-600 font-bold">{status.message}</p>}
            </div>
        </div>
    );
};

export default ManageOnboarding;
