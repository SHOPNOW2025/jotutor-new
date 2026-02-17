
import React, { useState, useEffect } from 'react';
import { SiteContent, FAQItem, AboutContent, ContactContent, HomepageContent, FooterContent } from '../types';

interface ManageContentProps {
  content: SiteContent;
  onUpdate: (newContent: SiteContent) => void;
  isEnglishAdmin?: boolean;
}

type ContentTab = 'homepage' | 'about' | 'faq' | 'contact' | 'footer' | 'settings' | 'privacy' | 'terms' | 'paymentRefund';

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

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalContent(prev => ({ ...prev, [name]: value }));
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
    setStatus({ message: isEnglishAdmin ? 'Content saved successfully!' : 'تم حفظ المحتوى بنجاح!', type: 'success' });
    setTimeout(() => setStatus(null), 3000);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
        case 'homepage':
            return (
                <div className="space-y-10 animate-fade-in">
                    <div className="p-6 border-2 border-green-100 rounded-3xl bg-green-50/30">
                        <h3 className="font-black mb-6 text-blue-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                            {isEnglishAdmin ? 'Homepage Statistics' : 'إحصائيات الصفحة الرئيسية'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { id: 'Teacher', type: 'Count' },
                                { id: 'Acceptance', type: 'Rate' },
                                { id: 'Student', type: 'Count' },
                                { id: 'Satisfaction', type: 'Rate' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3 bg-white p-4 rounded-2xl shadow-sm border border-green-50">
                                    <label className="block text-[9px] font-black text-gray-400 uppercase">{stat.id}</label>
                                    <input name={`stats${stat.id}${stat.type}${isEnglishAdmin ? '_en' : ''}` as any} value={(localContent.homepage as any)[`stats${stat.id}${stat.type}${isEnglishAdmin ? '_en' : ''}`] || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-sm font-bold text-green-600" />
                                    <input name={`stats${stat.id}Label${isEnglishAdmin ? '_en' : ''}` as any} value={(localContent.homepage as any)[`stats${stat.id}Label${isEnglishAdmin ? '_en' : ''}`] || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-2 border-blue-100 rounded-3xl bg-blue-50/30">
                        <h3 className="font-black mb-6 text-blue-900 uppercase text-xs tracking-widest flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                            {isEnglishAdmin ? 'Features Section' : 'قسم الميزات'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="featuresTitle" value={localContent.homepage.featuresTitle || ''} onChange={handleHomepageChange} className="w-full p-3 border rounded-xl font-bold" />
                            <textarea name="featuresSubtitle" value={localContent.homepage.featuresSubtitle || ''} onChange={handleHomepageChange} className="w-full p-3 border rounded-xl text-sm" rows={1}></textarea>
                        </div>
                    </div>
                </div>
            );
        case 'settings':
            return (
                <div className="space-y-8 animate-fade-in">
                    <div className="p-8 border-4 border-dashed border-blue-200 rounded-[2.5rem] bg-blue-50/30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg">💳</div>
                            <div>
                                <h3 className="text-xl font-black text-blue-900 uppercase tracking-tighter">إعدادات بوابة ماستركارد</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase">Real-Time Gateway Session Controller</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-blue-900 mb-2 uppercase tracking-widest">Active Mastercard Session ID</label>
                                <input 
                                    name="mastercardSessionId" 
                                    value={localContent.mastercardSessionId || ''} 
                                    onChange={handleSettingsChange} 
                                    className="w-full p-5 bg-white border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-600 font-mono text-blue-600 font-bold shadow-inner" 
                                    placeholder="SESSION0002XXXXXXXXXXXXXX" 
                                />
                                <p className="mt-3 text-[10px] text-gray-400 font-bold leading-relaxed bg-white/50 p-3 rounded-lg border">
                                    ملاحظة: هذا المعرف يتم استخراجه من لوحة تحكم التاجر. إذا انتهت صلاحيته، ستظهر للطلاب رسالة "Session Expired". قم بتوليد معرف جديد وضعه هنا ليعمل الدفع فوراً.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 border rounded-[2.5rem] bg-gray-50/50">
                        <h3 className="text-lg font-black text-blue-900 mb-4 uppercase">مفاتيح API أخرى</h3>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase">Google Gemini API Key</label>
                            <input name="geminiApiKey" value={localContent.geminiApiKey || ''} onChange={handleSettingsChange} className="w-full p-3 border rounded-xl font-mono text-xs" type="password" />
                        </div>
                    </div>
                </div>
            );
        case 'footer':
            return (
                <div className="space-y-8 animate-fade-in">
                    <div className="p-6 border rounded-[2rem] bg-gray-50 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <textarea name="description" value={localContent.footer?.description || ''} onChange={handleFooterChange} className="w-full p-3 border rounded-xl text-sm" dir="rtl" rows={4} placeholder="وصف الفوتر بالعربي"></textarea>
                            <textarea name="description_en" value={localContent.footer?.description_en || ''} onChange={handleFooterChange} className="w-full p-3 border rounded-xl text-sm" rows={4} placeholder="Footer description in English"></textarea>
                        </div>
                    </div>
                </div>
            );
        case 'faq':
            return (
                <div>
                    {localContent.faq.map(item => (
                        <div key={item.id} className="p-4 border rounded mb-4 bg-gray-50">
                            <input value={isEnglishAdmin ? (item.question_en || '') : item.question} onChange={e => handleFaqChange(item.id, isEnglishAdmin ? 'question_en' : 'question', e.target.value)} className="w-full p-2 border rounded mb-2 font-bold" />
                            <textarea value={isEnglishAdmin ? (item.answer_en || '') : item.answer} onChange={e => handleFaqChange(item.id, isEnglishAdmin ? 'answer_en' : 'answer', e.target.value)} className="w-full p-2 border rounded"></textarea>
                        </div>
                    ))}
                    <button onClick={addFaqItem} className="bg-blue-500 text-white px-4 py-2 rounded">Add FAQ</button>
                </div>
            );
        case 'contact':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="email" value={localContent.contact.email} onChange={handleContactChange} className="p-