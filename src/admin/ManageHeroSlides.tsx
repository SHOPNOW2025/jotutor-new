
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
        if (isEnglishAdmin) {
            setFormData({
                title_en: slide?.title_en || '',
                description_en: slide?.description_en || '',
                imageUrl: slide?.imageUrl || '', // Image is shared
            });
        } else {
            setFormData({
                title: slide?.title || '',
                description: slide?.description || '',
                imageUrl: slide?.imageUrl || '',
            });
        }
    }, [slide, isEnglishAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalSlide: HeroSlide = {
            ...(slide || { id: Date.now().toString() } as HeroSlide),
            ...formData,
        };
        onSave(finalSlide);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {isEnglishAdmin ? 'Edit Slide (English)' : (slide ? 'تعديل الشريحة' : 'إضافة شريحة جديدة')}
                    </h2>
                    <div className="space-y-4">
                        {isEnglishAdmin ? (
                            <>
                                <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Title (English)" className="w-full p-2 border rounded" required />
                                <div className="bg-gray-100 p-2 rounded text-xs">
                                    <span className="text-gray-500">Arabic Title (Reference): </span>{slide?.title}
                                </div>
                                <textarea name="description_en" value={formData.description_en || ''} onChange={handleChange} placeholder="Description (English)" rows={4} className="w-full p-2 border rounded" required></textarea>
                            </>
                        ) : (
                            <>
                                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="العنوان" className="w-full p-2 border rounded" required />
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="الوصف" rows={4} className="w-full p-2 border rounded" required></textarea>
                            </>
                        )}
                        
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">{isEnglishAdmin ? 'Banner Image' : 'صورة البنر'}</label>
                            <ImageUploadInput
                                value={formData.imageUrl || ''}
                                onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                placeholder="Image URL"
                            />
                        </div>
                    </div>
                     <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">
                            {isEnglishAdmin ? 'Cancel' : 'إلغاء'}
                        </button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                            {isEnglishAdmin ? 'Save' : 'حفظ'}
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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSlide(null);
    };

    const handleSaveSlide = (slideToSave: HeroSlide) => {
        if (heroSlides.some(s => s.id === slideToSave.id)) {
            setHeroSlides(prev => prev.map(s => s.id === slideToSave.id ? slideToSave : s));
        } else {
            setHeroSlides(prev => [slideToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemoveSlide = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الشريحة؟')) {
            setHeroSlides(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div>
            {isModalOpen && <SlideFormModal slide={editingSlide} onSave={handleSaveSlide} onClose={handleCloseModal} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEnglishAdmin ? 'Manage Home Banner (English)' : 'إدارة بنر الرئيسية'}</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    {isEnglishAdmin ? 'Add New Slide' : 'إضافة شريحة جديدة'}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {heroSlides.map(slide => (
                        <div key={slide.id} className="flex items-start justify-between p-4 border rounded-md bg-gray-50">
                             <div className="flex items-start space-x-4 space-x-reverse">
                                <img src={slide.imageUrl} alt={slide.title} className="w-32 h-20 rounded-md object-cover"/>
                                <div>
                                    <p className="font-semibold text-blue-900">{isEnglishAdmin ? (slide.title_en || slide.title) : slide.title}</p>
                                    <p className="text-gray-600 text-sm mt-1">{isEnglishAdmin ? (slide.description_en || slide.description) : slide.description}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex flex-col space-y-2">
                                <button onClick={() => handleOpenModal(slide)} className="text-blue-500 hover:underline text-sm text-left">{isEnglishAdmin ? 'Edit' : 'تعديل'}</button>
                                {!isEnglishAdmin && <button onClick={() => handleRemoveSlide(slide.id)} className="text-red-500 hover:underline text-sm text-left">حذف</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageHeroSlides;
