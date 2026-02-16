
import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem, AboutContent, ContactContent, HomepageContent, FooterContent } from '../types';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  isEnglishAdmin?: boolean;
}

type ContentTab = 'homepage' | 'about' | 'faq' | 'contact' | 'footer' | 'privacy' | 'terms' | 'paymentRefund';

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
  
  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({
        ...prev,
        footer: { ...(prev.footer || { description: '', description_en: '', rights: '', rights_en: '' }), [name]: value }
    }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({
        ...prev,
        contact: { ...prev.contact, [name]: value }
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
    setStatus({ message: isEnglishAdmin ? 'English content saved!' : 'تم حفظ المحتوى بنجاح!', type: 'success' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
        case 'homepage':
            return (
                <div className="space-y-10">
                    <div className="p-6 border-2 border-green-100 rounded-3xl bg-green-50/30">
                        <h3 className="font-black mb-6 text-blue-900 uppercase text-sm tracking-widest flex items-center gap-2">
                            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                            {isEnglishAdmin ? 'Homepage Stats' : 'إحصائيات الصفحة الرئيسية'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { id: 'Teacher', type: 'Count' },
                                { id: 'Acceptance', type: 'Rate' },
                                { id: 'Student', type: 'Count' },
                                { id: 'Satisfaction', type: 'Rate' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase">{stat.id}</label>
                                    <input 
                                        name={`stats${stat.id}${stat.type}${isEnglishAdmin ? '_en' : ''}` as any} 
                                        value={(localContent.homepage as any)[`stats${stat.id}${stat.type}${isEnglishAdmin ? '_en' : ''}`] || ''} 
                                        onChange={handleHomepageChange} 
                                        className="w-full p-2 border rounded-lg text-sm font-bold" 
                                        placeholder="Value"
                                    />
                                    <input 
                                        name={`stats${stat.id}Label${isEnglishAdmin ? '_en' : ''}` as any} 
                                        value={(localContent.homepage as any)[`stats${stat.id}Label${isEnglishAdmin ? '_en' : ''}`] || ''} 
                                        onChange={handleHomepageChange} 
                                        className="w-full p-2 border rounded-lg text-xs" 
                                        placeholder="Label"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case 'footer':
            return (
                <div className="space-y-8 animate-fade-in">
                    {/* نصوص الفوتر */}
                    <div className="p-6 border rounded-[2rem] bg-gray-50 space-y-6">
                        <h3 className="font-black text-blue-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
                            {isEnglishAdmin ? 'Footer Texts (Bilingual)' : 'نصوص الفوتر (ثنائي اللغة)'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-black text-green-600 mb-2 uppercase">وصف الفوتر (عربي)</label>
                                    <textarea name="description" value={localContent.footer?.description || ''} onChange={handleFooterChange} className="w-full p-3 border rounded-xl text-sm text-right" dir="rtl" rows={4}></textarea>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-black text-green-600 mb-2 uppercase">حقوق النشر (عربي)</label>
                                    <input name="rights" value={localContent.footer?.rights || ''} onChange={handleFooterChange} className="w-full p-3 border rounded-xl text-sm text-right" dir="rtl" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-black text-blue-600 mb-2 uppercase">Footer Description (EN)</label>
                                    <textarea name="description_en" value={localContent.footer?.description_en || ''} onChange={handleFooterChange} className="w-full p-3 border rounded-xl text-sm" rows={4}></textarea>
                                </div>
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                                    <label className="block text-[10px] font-black text-blue-600 mb-2 uppercase">Copyright (EN)</label>
                                    <input name="rights_en" value={localContent.footer?.rights_en || ''} onChange={handleFooterChange} className="w-full p-3 border rounded-xl text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* روابط التواصل الاجتماعي */}
                    <div className="p-6 border rounded-[2rem] bg-blue-50/30 space-y-6">
                        <h3 className="font-black text-blue-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-2 h-4 bg-green-500 rounded-full"></span>
                            {isEnglishAdmin ? 'Social Media Links' : 'روابط التواصل الاجتماعي'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">FB</div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase">Facebook URL</label>
                                    <input name="facebook" value={localContent.contact.facebook || ''} onChange={handleSocialChange} className="w-full p-1 border-b outline-none text-xs text-blue-600 font-medium" placeholder="https://facebook.com/..." />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center font-bold">IG</div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase">Instagram URL</label>
                                    <input name="instagram" value={localContent.contact.instagram || ''} onChange={handleSocialChange} className="w-full p-1 border-b outline-none text-xs text-pink-600 font-medium" placeholder="https://instagram.com/..." />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold">YT</div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase">YouTube URL</label>
                                    <input name="youtube" value={localContent.contact.youtube || ''} onChange={handleSocialChange} className="w-full p-1 border-b outline-none text-xs text-red-600 font-medium" placeholder="https://youtube.com/..." />
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-800 rounded-xl flex items-center justify-center font-bold">IN</div>
                                <div className="flex-1">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase">LinkedIn URL</label>
                                    <input name="linkedin" value={localContent.contact.linkedin || ''} onChange={handleSocialChange} className="w-full p-1 border-b outline-none text-xs text-blue-800 font-medium" placeholder="https://linkedin.com/in/..." />
                                </div>
                            </div>
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

  const tabs: { id: ContentTab, label: string }[] = [
      { id: 'homepage', label: isEnglishAdmin ? 'Homepage' : 'الرئيسية' },
      { id: 'footer', label: isEnglishAdmin ? 'Footer' : 'الفوتر والروابط' },
      { id: 'about', label: isEnglishAdmin ? 'About Us' : 'عن المنصة' },
      { id: 'faq', label: isEnglishAdmin ? 'FAQ' : 'الأسئلة' },
      { id: 'contact', label: isEnglishAdmin ? 'Contact' : 'التواصل' },
      { id: 'privacy', label: isEnglishAdmin ? 'Privacy' : 'الخصوصية' },
      { id: 'terms', label: isEnglishAdmin ? 'Terms' : 'الشروط' },
  ];

  return (
    <div className="animate-fade-in pb-20">
      <h1 className="text-3xl font-black text-blue-900 mb-6">{isEnglishAdmin ? 'English Site Management' : 'إدارة محتوى الموقع'}</h1>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <nav className="flex gap-2 overflow-x-auto border-b pb-4 mb-8 scrollbar-hide no-scrollbar">
            {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-6 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-blue-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}>
                    {t.label.toUpperCase()}
                </button>
            ))}
        </nav>
        <div className="min-h-[500px]">{renderTabContent()}</div>
        <div className="mt-12 pt-8 border-t flex justify-between items-center bg-gray-50 -mx-8 -mb-8 p-8 rounded-b-[2.5rem]">
            <button 
                onClick={handleSaveChanges} 
                className="bg-blue-900 text-white font-black py-4 px-16 rounded-2xl shadow-xl hover:bg-blue-800 transition-all transform active:scale-95"
            >
                {isEnglishAdmin ? 'Save Changes Now' : 'حفظ التغييرات الآن'}
            </button>
        </div>
        {status && <div className="fixed bottom-10 right-10 bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black z-[100] animate-bounce">{status.message}</div>}
      </div>
    </div>
  );
};

export default ManageContent;
