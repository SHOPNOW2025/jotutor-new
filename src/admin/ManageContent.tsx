
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
                <div className="space-y-10">
                    {/* قسم الإحصائيات (الدوائر) */}
                    <div className="p-6 border-2 border-green-100 rounded-3xl bg-green-50/30">
                        <h3 className="font-black mb-6 text-blue-900 uppercase text-sm tracking-widest flex items-center gap-2">
                            <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                            {isEnglishAdmin ? 'Homepage Stats (Circles)' : 'إحصائيات الصفحة الرئيسية (الدوائر)'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3 bg-white p-4 rounded-2xl shadow-sm">
                                <label className="block text-[10px] font-black text-gray-400 uppercase">Stat 1: Tutors</label>
                                <input name="statsTeacherCount" value={localContent.homepage.statsTeacherCount || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-sm font-bold" placeholder="Value (+750)"/>
                                <input name="statsTeacherLabel" value={localContent.homepage.statsTeacherLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" placeholder="Label (Tutors)"/>
                            </div>
                            <div className="space-y-3 bg-white p-4 rounded-2xl shadow-sm">
                                <label className="block text-[10px] font-black text-gray-400 uppercase">Stat 2: Acceptance</label>
                                <input name="statsAcceptanceRate" value={localContent.homepage.statsAcceptanceRate || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-sm font-bold" placeholder="Value (25%)"/>
                                <input name="statsAcceptanceLabel" value={localContent.homepage.statsAcceptanceLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" placeholder="Label (Acceptance)"/>
                            </div>
                            <div className="space-y-3 bg-white p-4 rounded-2xl shadow-sm">
                                <label className="block text-[10px] font-black text-gray-400 uppercase">Stat 3: Students</label>
                                <input name="statsStudentCount" value={localContent.homepage.statsStudentCount || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-sm font-bold" placeholder="Value (5000+)"/>
                                <input name="statsStudentLabel" value={localContent.homepage.statsStudentLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" placeholder="Label (Students)"/>
                            </div>
                            <div className="space-y-3 bg-white p-4 rounded-2xl shadow-sm">
                                <label className="block text-[10px] font-black text-gray-400 uppercase">Stat 4: Satisfaction</label>
                                <input name="statsSatisfactionRate" value={localContent.homepage.statsSatisfactionRate || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-sm font-bold" placeholder="Value (95%)"/>
                                <input name="statsSatisfactionLabel" value={localContent.homepage.statsSatisfactionLabel || ''} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" placeholder="Label (Satisfaction)"/>
                            </div>
                        </div>
                    </div>

                    {/* لماذا تختار جو توتر */}
                    <div className="p-6 border rounded-3xl bg-gray-50">
                        <h3 className="font-black mb-6 text-blue-900 uppercase text-xs tracking-widest">Why Choose JoTutor? Section</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Main Title</label>
                                <input name="featuresTitle" value={localContent.homepage.featuresTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl font-bold" placeholder="Features Title"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Subtitle</label>
                                <textarea name="featuresSubtitle" value={localContent.homepage.featuresSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-sm" placeholder="Features Subtitle"></textarea>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="p-4 border rounded-2xl bg-white shadow-sm">
                                    <h4 className="font-black text-green-600 mb-3 text-xs">Feature Box {n}</h4>
                                    <input name={`feature${n}Title` as any} value={(localContent.homepage as any)[`feature${n}Title`]} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg mb-2 text-sm font-bold" placeholder="Title"/>
                                    <textarea name={`feature${n}Desc` as any} value={(localContent.homepage as any)[`feature${n}Desc`]} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" rows={3} placeholder="Description"></textarea>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* كيف يعمل */}
                    <div className="p-6 border rounded-3xl bg-gray-50">
                         <h3 className="font-black mb-6 text-blue-900 uppercase text-xs tracking-widest">How It Works Section</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <input name="howItWorksTitle" value={localContent.homepage.howItWorksTitle} onChange={handleHomepageChange} className="p-2 border rounded-xl font-bold" placeholder="Title"/>
                            <input name="howItWorksSubtitle" value={localContent.homepage.howItWorksSubtitle} onChange={handleHomepageChange} className="p-2 border rounded-xl text-sm" placeholder="Subtitle"/>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="p-4 border rounded-2xl bg-white shadow-sm">
                                    <h4 className="font-black text-blue-500 mb-3 text-xs">Step {n}</h4>
                                    <input name={`step${n}Title` as any} value={(localContent.homepage as any)[`step${n}Title`]} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg mb-2 text-sm font-bold" placeholder="Step Title"/>
                                    <textarea name={`step${n}Desc` as any} value={(localContent.homepage as any)[`step${n}Desc`]} onChange={handleHomepageChange} className="w-full p-2 border rounded-lg text-xs" rows={3} placeholder="Step Description"></textarea>
                                </div>
                            ))}
                         </div>
                    </div>

                    {/* البحث والمعاينة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-3xl bg-white shadow-sm">
                             <h3 className="font-black mb-4 text-blue-900 uppercase text-xs tracking-widest">Teacher Search</h3>
                             <input name="teacherSearchTitle" value={localContent.homepage.teacherSearchTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl mb-3 font-bold" placeholder="Title"/>
                             <textarea name="teacherSearchSubtitle" value={localContent.homepage.teacherSearchSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-sm mb-3" placeholder="Subtitle"></textarea>
                             <input name="discoverMoreTeachers" value={localContent.homepage.discoverMoreTeachers} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-xs" placeholder="Button Label"/>
                        </div>
                        <div className="p-6 border rounded-3xl bg-white shadow-sm">
                             <h3 className="font-black mb-4 text-blue-900 uppercase text-xs tracking-widest">Courses Preview</h3>
                             <input name="coursesPreviewTitle" value={localContent.homepage.coursesPreviewTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl mb-3 font-bold" placeholder="Title"/>
                             <textarea name="coursesPreviewSubtitle" value={localContent.homepage.coursesPreviewSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-sm mb-3" placeholder="Subtitle"></textarea>
                             <input name="discoverMoreCourses" value={localContent.homepage.discoverMoreCourses} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-xs" placeholder="Button Label"/>
                        </div>
                    </div>

                    {/* التقييمات ومخطط الدروس */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 border rounded-3xl bg-white shadow-sm">
                             <h3 className="font-black mb-4 text-blue-900 uppercase text-xs tracking-widest">Testimonials Section</h3>
                             <input name="testimonialsTitle" value={localContent.homepage.testimonialsTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl mb-3 font-bold" placeholder="Title"/>
                             <textarea name="testimonialsSubtitle" value={localContent.homepage.testimonialsSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-sm" placeholder="Subtitle"></textarea>
                        </div>
                        <div className="p-6 border rounded-3xl bg-white shadow-sm">
                             <h3 className="font-black mb-4 text-blue-900 uppercase text-xs tracking-widest">AI Lesson Planner Section</h3>
                             <input name="aiPlannerTitle" value={localContent.homepage.aiPlannerTitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl mb-3 font-bold" placeholder="Title"/>
                             <textarea name="aiPlannerSubtitle" value={localContent.homepage.aiPlannerSubtitle} onChange={handleHomepageChange} className="w-full p-2 border rounded-xl text-sm" placeholder="Subtitle"></textarea>
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

  const tabs: { id: ContentTab, label: string }[] = [
      { id: 'homepage', label: isEnglishAdmin ? 'Homepage Sections' : 'أقسام الصفحة الرئيسية' },
      { id: 'about', label: isEnglishAdmin ? 'About Us' : 'عن المنصة' },
      { id: 'faq', label: isEnglishAdmin ? 'FAQ' : 'الأسئلة الشائعة' },
      { id: 'contact', label: isEnglishAdmin ? 'Contact Info' : 'معلومات التواصل' },
      { id: 'privacy', label: isEnglishAdmin ? 'Privacy' : 'الخصوصية' },
      { id: 'terms', label: isEnglishAdmin ? 'Terms' : 'الشروط' },
      { id: 'paymentRefund', label: isEnglishAdmin ? 'Refund Policy' : 'سياسة الإرجاع' },
  ];

  return (
    <div className="animate-fade-in pb-20">
      <h1 className="text-3xl font-black text-blue-900 mb-6">{isEnglishAdmin ? 'English Site Management' : 'إدارة محتوى الموقع (عربي)'}</h1>
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
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                    <p className="text-xs font-black text-blue-900">{isEnglishAdmin ? 'Ready to Update' : 'جاهز للتحديث'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{isEnglishAdmin ? 'Global Site Strings' : 'نصوص الموقع الرئيسية'}</p>
                </div>
            </div>
            <button 
                onClick={handleSaveChanges} 
                className="bg-blue-900 text-white font-black py-4 px-16 rounded-2xl shadow-xl hover:bg-blue-800 transition-all transform active:scale-95"
            >
                {isEnglishAdmin ? 'Save Changes Now' : 'حفظ التغييرات الآن'}
            </button>
        </div>
        {status && (
            <div className="fixed bottom-10 right-10 animate-bounce-in">
                <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-black flex items-center gap-3">
                    <span>✨</span> {status.message}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ManageContent;
