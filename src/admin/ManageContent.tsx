
import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem, AboutContent, ContactContent, HomepageContent } from '../types';
import { initialData } from '../mockData';
import ImageUploadInput from './ImageUploadInput';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  isEnglishAdmin?: boolean;
}

type ContentTab = 'homepage' | 'about' | 'faq' | 'contact' | 'privacy' | 'terms' | 'paymentRefund' | 'config';

const ManageContent: React.FC<ManageContentProps> = ({ content, onUpdate, isEnglishAdmin }) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('homepage');
  const [localContent, setLocalContent] = useState<SiteContent>(JSON.parse(JSON.stringify(content)));
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setLocalContent(JSON.parse(JSON.stringify(content)));
  }, [content]);

  const handleHomepageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({
        ...prev,
        homepage: { ...prev.homepage, [name]: value }
    }));
  };
  
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'whyJoTutor') {
        setLocalContent(prev => ({
            ...prev,
            about: { ...prev.about, [name]: value.split('\n') }
        }));
    } else {
        setLocalContent(prev => ({
            ...prev,
            about: { ...prev.about, [name]: value }
        }));
    }
  };

  const handleAboutImageChange = (name: string, value: string) => {
      setLocalContent(prev => ({
          ...prev,
          about: { ...prev.about, [name]: value }
      }));
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
     setLocalContent(prev => ({
        ...prev,
        contact: { ...prev.contact, [name]: value }
    }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({ ...prev, [name]: value }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, section: 'privacy' | 'terms' | 'paymentRefundPolicy') => {
    const { name, value } = e.target;
    setLocalContent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFaqChange = (id: string, field: 'question' | 'answer' | 'question_en' | 'answer_en', value: string) => {
    setLocalContent(prev => ({
        ...prev,
        faq: prev.faq.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addFaqItem = () => {
    const newFaq: FAQItem = { 
        id: Date.now().toString(), 
        question: 'سؤال جديد', 
        answer: 'إجابة جديدة',
        question_en: 'New Question',
        answer_en: 'New Answer'
    };
    setLocalContent(prev => ({ ...prev, faq: [...prev.faq, newFaq]}));
  };
  
  const removeFaqItem = (id: string) => {
    setLocalContent(prev => ({ ...prev, faq: prev.faq.filter(item => item.id !== id)}));
  };

  const handleSaveChanges = () => {
    onUpdate(localContent);
    setStatus({ message: isEnglishAdmin ? 'English content saved successfully!' : 'تم حفظ المحتوى العربي بنجاح!', type: 'success' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  const renderTabContent = () => {
    const defaultHomepage = initialData.siteContent.homepage;

    switch(activeTab) {
        case 'homepage':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 p-4 border rounded-md bg-white shadow-sm">
                        <h3 className="text-lg font-bold mb-4 text-blue-900 border-b pb-2">{isEnglishAdmin ? 'Features Section (EN)' : 'قسم الميزات (AR)'}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الرئيسي</label>
                            <input name="featuresTitle" value={localContent.homepage.featuresTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الفرعي</label>
                            <textarea name="featuresSubtitle" value={localContent.homepage.featuresSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded" rows={2}></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {[1, 2, 3].map(num => (
                                <div key={num} className="p-3 bg-gray-50 rounded border">
                                    <h5 className="font-bold text-green-600 mb-2 text-xs">Box {num}</h5>
                                    <input name={`feature${num}Title` as any} value={(localContent.homepage as any)[`feature${num}Title`]} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="Title"/>
                                    <textarea name={`feature${num}Desc` as any} value={(localContent.homepage as any)[`feature${num}Desc`]} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" placeholder="Description" rows={3}></textarea>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 p-4 border rounded-md bg-white shadow-sm ring-1 ring-green-200">
                        <h3 className="text-lg font-bold mb-4 text-green-800 border-b pb-2">
                            {isEnglishAdmin ? 'Statistics (EN)' : 'الإحصائيات (AR)'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">المعلمين</label>
                                <input name="statsTeacherCount" value={localContent.homepage.statsTeacherCount || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 font-bold" />
                                <input name="statsTeacherLabel" value={localContent.homepage.statsTeacherLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">القبول</label>
                                <input name="statsAcceptanceRate" value={localContent.homepage.statsAcceptanceRate || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 font-bold" />
                                <input name="statsAcceptanceLabel" value={localContent.homepage.statsAcceptanceLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">الطلاب</label>
                                <input name="statsStudentCount" value={localContent.homepage.statsStudentCount || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 font-bold" />
                                <input name="statsStudentLabel" value={localContent.homepage.statsStudentLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">الرضا</label>
                                <input name="statsSatisfactionRate" value={localContent.homepage.statsSatisfactionRate || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 font-bold" />
                                <input name="statsSatisfactionLabel" value={localContent.homepage.statsSatisfactionLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded text-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            );
        case 'about':
            return (
                <div className="space-y-6">
                    <div>
                        <label className="font-semibold block mb-1">عنوان الصفحة</label>
                        <input name="aboutTitle" value={localContent.about.aboutTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md"/>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">الرؤية</label>
                        <input name="visionTitle" value={localContent.about.visionTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md mb-2"/>
                        <textarea name="vision" value={localContent.about.vision} onChange={handleAboutChange} rows={3} className="w-full p-2 border rounded-md"></textarea>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">الرسالة</label>
                        <input name="missionTitle" value={localContent.about.missionTitle} onChange={handleAboutChange} className="w-full p-2 border rounded-md mb-2"/>
                        <textarea name="mission" value={localContent.about.mission} onChange={handleAboutChange} rows={5} className="w-full p-2 border rounded-md"></textarea>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">لماذا نحن؟ (كل جملة في سطر)</label>
                        <textarea name="whyJoTutor" value={localContent.about.whyJoTutor.join('\n')} onChange={handleAboutChange} rows={8} className="w-full p-2 border rounded-md"></textarea>
                    </div>
                </div>
            );
        case 'faq':
            return (
                <div>
                    {localContent.faq.map(item => (
                        <div key={item.id} className="grid grid-cols-1 gap-2 mb-4 p-4 border rounded-md bg-gray-50 relative">
                            <button onClick={() => removeFaqItem(item.id)} className="absolute top-2 left-2 text-red-500 p-1">X</button>
                            <input 
                                type="text" 
                                value={isEnglishAdmin ? (item.question_en || '') : item.question} 
                                onChange={e => handleFaqChange(item.id, isEnglishAdmin ? 'question_en' : 'question', e.target.value)} 
                                placeholder="السؤال" 
                                className="w-full p-2 border rounded-md font-bold"
                            />
                            <textarea 
                                value={isEnglishAdmin ? (item.answer_en || '') : item.answer} 
                                onChange={e => handleFaqChange(item.id, isEnglishAdmin ? 'answer_en' : 'answer', e.target.value)} 
                                placeholder="الإجابة" 
                                rows={2} 
                                className="w-full p-2 border rounded-md"
                            ></textarea>
                        </div>
                    ))}
                    <button onClick={addFaqItem} className="bg-blue-500 text-white py-2 px-4 rounded">إضافة سؤال</button>
                </div>
            );
        case 'contact':
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="email" value={localContent.contact.email} onChange={handleContactChange} placeholder="Email" className="p-2 border rounded"/>
                        <input name="phone" value={localContent.contact.phone} onChange={handleContactChange} placeholder="Phone" className="p-2 border rounded"/>
                        <input name="address" value={localContent.contact.address} onChange={handleContactChange} placeholder="Address" className="p-2 border rounded md:col-span-2"/>
                    </div>
                </div>
            );
        case 'privacy':
        case 'terms':
        case 'paymentRefund':
            const fieldName = activeTab === 'privacy' ? 'privacy' : activeTab === 'terms' ? 'terms' : 'paymentRefundPolicy';
            return (
                <textarea 
                    name={fieldName} 
                    value={(localContent as any)[fieldName] || ''} 
                    onChange={(e) => handleTextChange(e, fieldName as any)} 
                    rows={12} 
                    className="w-full p-2 border rounded-md"
                ></textarea>
            );
        default: return null;
    }
  };

  const tabs: { id: ContentTab, label: string }[] = [
      { id: 'homepage', label: 'الرئيسية' },
      { id: 'about', label: 'عن المنصة' },
      { id: 'faq', label: 'الأسئلة الشائعة' },
      { id: 'contact', label: 'اتصل بنا' },
      { id: 'privacy', label: 'الخصوصية' },
      { id: 'terms', label: 'الشروط' },
      { id: 'paymentRefund', label: 'الدفع والارجاع' }
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEnglishAdmin ? 'English Content Management' : 'إدارة المحتوى العربي'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-900">
        <nav className="flex space-x-4 space-x-reverse overflow-x-auto border-b mb-6">
            {tabs.map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
                    className={`py-2 px-4 font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-900 text-blue-900' : 'border-transparent text-gray-400'}`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
        
        <div className="min-h-[400px]">
            {renderTabContent()}
        </div>
        
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <button onClick={handleSaveChanges} className="bg-green-600 text-white font-black py-3 px-10 rounded-xl shadow-lg hover:bg-green-700 transition-all">
                {isEnglishAdmin ? 'Save English Version' : 'حفظ النسخة العربية'}
            </button>
            {status && <p className="text-green-600 font-bold">{status.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageContent;
