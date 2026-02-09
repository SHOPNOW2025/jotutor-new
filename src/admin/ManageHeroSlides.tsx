
import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import ImageUploadInput from './ImageUploadInput';

interface ManageHeroSlidesProps {
    heroSlides: HeroSlide[];
    setHeroSlides: React.Dispatch<React.SetStateAction<HeroSlide[]>>;
    isEnglishAdmin?: boolean;
}

const SlideFormModal: React.FC<{ slide: HeroSlide | null; onSave: (slide: HeroSlide) => void; onClose: () => void; isEnglishAdmin?: boolean; }> = ({ slide, onSave, onClose, isEnglishAdmin }) => {
    const [formData, setFormData] = useState<Partial<HeroSlide>>({});

    useEffect(() => {
        if (slide) {
            setFormData({ ...slide });
        } else {
            setFormData({
                id: Date.now().toString(),
                title: '',
                description: '',
                imageUrl: '',
                title_en: '',
                description_en: '',
                imageUrl_en: ''
            });
        }
    }, [slide]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as HeroSlide);
    };

    return (
        <div className="fixed inset-0 bg-blue-900/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-gray-50 p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-black text-blue-900">
                        {isEnglishAdmin ? 'Edit Slide (English View)' : (slide ? 'تعديل الشريحة العربية' : 'إضافة شريحة جديدة')}
                    </h2>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                        {isEnglishAdmin ? 'EN Mode' : 'AR Mode'}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {isEnglishAdmin ? (
                        <>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Slide Title (English)</label>
                                <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Title (English)" className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Description (English)</label>
                                <textarea name="description_en" value={formData.description_en || ''} onChange={handleChange} placeholder="Description (English)" rows={3} className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-blue-500 font-bold" required></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-blue-600 mb-2 uppercase tracking-widest">English Banner Image (Independent)</label>
                                <ImageUploadInput
                                    value={formData.imageUrl_en || ''}
                                    onChange={(url) => setFormData(prev => ({ ...prev, imageUrl_en: url }))}
                                    placeholder="Upload English Version Image"
                                />
                                <p className="text-[9px] text-gray-400 mt-2 font-bold">هذه الصورة ستظهر فقط عند تحويل الموقع للغة الإنجليزية.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">عنوان الشريحة (عربي)</label>
                                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="العنوان" className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-green-500 font-bold" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">الوصف (عربي)</label>
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="الوصف" rows={3} className="w-full p-4 border-2 border-gray-100 rounded-2xl outline-none focus:border-green-500 font-bold" required></textarea>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-green-600 mb-2 uppercase tracking-widest">صورة البنر العربية (مستقلة)</label>
                                <ImageUploadInput
                                    value={formData.imageUrl || ''}
                                    onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                    placeholder="ارفع الصورة للنسخة العربية"
                                />
                            </div>
                        </>
                    )}
                    
                    <div className="flex gap-4 pt-6 border-t">
                        <button type="submit" className="flex-1 bg-blue-900 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-800 transition-all">
                            {isEnglishAdmin ? 'Save English Version' : 'حفظ التغييرات'}
                        </button>
                        <button type="button" onClick={onClose} className="px-8 py-4 bg-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-200 transition-all">
                            {isEnglishAdmin ? 'Cancel' : 'إلغاء'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageHeroSlides: React.FC<ManageHeroSlidesProps> = ({ heroSlides, setHeroSlides, isEnglishAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

    const handleOpenModal = (slide: HeroSlide | null) => {
        setEditingSlide(slide);
        setIsModalOpen(true);
    };

    const handleSaveSlide = (slideToSave: HeroSlide) => {
        setHeroSlides(prev => {
            const exists = prev.some(s => s.id === slideToSave.id);
            if (exists) return prev.map(s => s.id === slideToSave.id ? slideToSave : s);
            return [slideToSave, ...prev];
        });
        setIsModalOpen(false);
    };

    const handleRemoveSlide = (id: string) => {
        if (window.confirm('هل أنت متأكد؟')) {
            setHeroSlides(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
            {isModalOpen && <SlideFormModal slide={editingSlide} onSave={handleSaveSlide} onClose={() => setIsModalOpen(false)} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-3xl shadow-xl">
                <div>
                    <h1 className="text-3xl font-black text-blue-900 uppercase">إدارة صور البنر</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{isEnglishAdmin ? 'Multi-Language Visuals' : 'التحكم في الصور والنصوص'}</p>
                </div>
                <button onClick={() => handleOpenModal(null)} className="bg-green-500 text-white font-black py-4 px-10 rounded-2xl shadow-lg hover:bg-green-600 transition-all transform hover:-translate-y-1">
                    إضافة شريحة جديدة
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroSlides.map(slide => (
                    <div key={slide.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50 flex flex-col group">
                        <div className="relative h-48 overflow-hidden">
                            <img src={isEnglishAdmin && slide.imageUrl_en ? slide.imageUrl_en : slide.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 right-4 text-white">
                                <p className="text-[10px] font-black uppercase opacity-70">Preview ({isEnglishAdmin ? 'EN' : 'AR'})</p>
                                <h3 className="font-bold">{isEnglishAdmin ? (slide.title_en || slide.title) : slide.title}</h3>
                            </div>
                            {isEnglishAdmin && !slide.imageUrl_en && (
                                <div className="absolute top-4 left-4 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full">Arabic Default Image Used</div>
                            )}
                        </div>
                        <div className="p-6 flex gap-3 mt-auto">
                            <button onClick={() => handleOpenModal(slide)} className="flex-1 bg-blue-900 text-white font-black py-3 rounded-xl hover:bg-blue-800 transition-all text-xs">تعديل</button>
                            {!isEnglishAdmin && <button onClick={() => handleRemoveSlide(slide.id)} className="px-4 py-3 bg-red-50 text-red-500 font-black rounded-xl hover:bg-red-100 transition-all text-xs">حذف</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageHeroSlides;
