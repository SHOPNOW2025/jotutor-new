
import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem, AboutContent, ContactContent, HomepageContent } from '../types';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  isEnglishAdmin?: boolean;
}

type ContentTab = 'homepage' | 'about' | 'faq' | 'contact' | 'privacy' | 'terms' | 'paymentRefund';

const ManageContent: React.FC<ManageContentProps> = ({ content, onUpdate, isEnglishAdmin }) => {
  const [activeTab, setActiveTab] = useState<ContentTab>('homepage');
  const [localContent, setLocalContent] = useState<SiteContent>(JSON.parse(JSON.stringify(content)));
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setLocalContent(JSON.parse(JSON.stringify(content)));
  }, [content, isEnglishAdmin]);

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
        setLocalContent(prev => ({ ...prev, about: { ...prev.about, [name]: value.split('\n') } }));
    } else {
        setLocalContent(prev => ({ ...prev, about: { ...prev.about, [name]: value } }));
    }
  };
  
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
     setLocalContent(prev => ({ ...prev, contact: { ...prev.contact, [name]: value } }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
    setLocalContent(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleFaqChange = (id: string, field: string, value: string) => {
    setLocalContent(prev => ({
        ...prev,
        faq: prev.faq.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addFaqItem = () => {
    setLocalContent(prev => ({
        ...prev,
        faq: [...prev.faq, { id: Date.now().toString(), question: '', answer: '', question_en: '', answer_en: '' }]
    }));
  };

  const handleSaveChanges = () => {
    onUpdate(localContent);
    setStatus({ message: isEnglishAdmin ? 'English content saved!' : 'تم حفظ المحتوى العربي!', type: 'success' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
        case 'homepage':
            return (
                <div className="space-y-6">
                    <div className="p-4 border rounded bg-gray-50">
                        <h3 className="font-bold mb-4 text-blue-900 uppercase text-xs">Section Titles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="featuresTitle" value={localContent.homepage.featuresTitle} onChange={handleHomepageChange} className="p-2 border rounded" placeholder="Features Title"/>
                            <textarea name="featuresSubtitle" value={localContent.homepage.featuresSubtitle} onChange={handleHomepageChange} className="p-2 border rounded" placeholder="Features Subtitle"></textarea>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="p-3 border rounded bg-white">
                                <h4 className="font-bold text-green-600 mb-2">Feature {n}</h4>
                                <input name={`feature${n}Title` as any} value={(localContent.homepage as any)[`feature${n}Title`]} onChange={handleHomepageChange} className="w-full p-2 border rounded mb-2 text-sm" placeholder="Title"/>
                                <textarea name={`feature${n}Desc` as any} value={(localContent.homepage as any)[`feature${n}Desc`]} onChange={handleHomepageChange} className="w-full p-2 border rounded text-sm" rows={3} placeholder="Description"></textarea>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border rounded bg-gray-50">
                         <h3 className="font-bold mb-4 text-blue-900 uppercase text-xs">Steps & Search</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="howItWorksTitle" value={localContent.homepage.howItWorksTitle} onChange={handleHomepageChange} className="p-2 border rounded" placeholder="How it works title"/>
                            <input name="teacherSearchTitle" value={localContent.homepage.teacherSearchTitle} onChange={handleHomepageChange} className="p-2 border rounded" placeholder="Teacher Search title"/>
                         </div>
                    </div>
                </div>
            );
        case 'about':
            return (
                <div className="space-y-4">
                    <input name="aboutTitle" value={localContent.about.aboutTitle} onChange={handleAboutChange} className="w-full p-2 border rounded" placeholder="Page Title"/>
                    <textarea name="vision" value={localContent.about.vision} onChange={handleAboutChange} rows={3} className="w-full p-2 border rounded" placeholder="Vision"></textarea>
                    <textarea name="mission" value={localContent.about.mission} onChange={handleAboutChange} rows={4} className="w-full p-2 border rounded" placeholder="Mission"></textarea>
                    <textarea name="whyJoTutor" value={localContent.about.whyJoTutor.join('\n')} onChange={handleAboutChange} rows={6} className="w-full p-2 border rounded" placeholder="Points (one per line)"></textarea>
                </div>
            );
        case 'faq':
            return (
                <div>
                    {localContent.faq.map(item => (
                        <div key={item.id} className="p-4 border rounded mb-4 bg-gray-50">
                            <input 
                                value={isEnglishAdmin ? (item.question_en || '') : item.question} 
                                onChange={e => handleFaqChange(item.id, isEnglishAdmin ? 'question_en' : 'question', e.target.value)} 
                                className="w-full p-2 border rounded mb-2 font-bold" 
                                placeholder="Question"
                            />
                            <textarea 
                                value={isEnglishAdmin ? (item.answer_en || '') : item.answer} 
                                onChange={e => handleFaqChange(item.id, isEnglishAdmin ? 'answer_en' : 'answer', e.target.value)} 
                                className="w-full p-2 border rounded" 
                                placeholder="Answer"
                            ></textarea>
                        </div>
                    ))}
                    <button onClick={addFaqItem} className="bg-blue-500 text-white px-4 py-2 rounded">Add FAQ</button>
                </div>
            );
        case 'contact':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="email" value={localContent.contact.email} onChange={handleContactChange} className="p-2 border rounded" placeholder="Email"/>
                    <input name="phone" value={localContent.contact.phone} onChange={handleContactChange} className="p-2 border rounded" placeholder="Phone"/>
                    <input name="address" value={localContent.contact.address} onChange={handleContactChange} className="p-2 border rounded md:col-span-2" placeholder="Address"/>
                </div>
            );
        case 'privacy':
        case 'terms':
        case 'paymentRefund':
            const f = activeTab === 'privacy' ? 'privacy' : activeTab === 'terms' ? 'terms' : 'paymentRefundPolicy';
            return <textarea value={(localContent as any)[f]} onChange={e => handleTextChange(e, f)} rows={15} className="w-full p-2 border rounded"></textarea>;
        default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-black text-blue-900 mb-6">{isEnglishAdmin ? 'English Site Management' : 'إدارة محتوى الموقع (عربي)'}</h1>
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <nav className="flex gap-2 overflow-x-auto border-b pb-4 mb-6 scrollbar-hide">
            {(['homepage', 'about', 'faq', 'contact', 'privacy', 'terms', 'paymentRefund'] as ContentTab[]).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === t ? 'bg-blue-900 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}>{t.toUpperCase()}</button>
            ))}
        </nav>
        <div className="min-h-[400px]">{renderTabContent()}</div>
        <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <button onClick={handleSaveChanges} className="bg-green-600 text-white font-black py-3 px-12 rounded-xl shadow-lg hover:bg-green-700 transition-all">{isEnglishAdmin ? 'Save English Content' : 'حفظ المحتوى العربي'}</button>
            {status && <p className="text-green-600 font-bold">{status.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageContent;
