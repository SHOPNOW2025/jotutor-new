
import React, { useState, useEffect } from 'react';
import { Testimonial } from '../types';
import ImageUploadInput from './ImageUploadInput';

interface ManageTestimonialsProps {
    testimonials: Testimonial[];
    setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
    isEnglishAdmin?: boolean;
}

const TestimonialFormModal: React.FC<{ testimonial: Testimonial | null; onSave: (testimonial: Testimonial) => void; onClose: () => void; isEnglishAdmin?: boolean; }> = ({ testimonial, onSave, onClose, isEnglishAdmin }) => {
    const [formData, setFormData] = useState<Partial<Testimonial>>({});

    useEffect(() => {
        if (isEnglishAdmin) {
            setFormData({
                name_en: testimonial?.name_en || '',
                role_en: testimonial?.role_en || '',
                quote_en: testimonial?.quote_en || '',
                avatarUrl: testimonial?.avatarUrl,
                name: testimonial?.name,
            });
        } else {
            setFormData({
                name: testimonial?.name || '',
                role: testimonial?.role || '',
                avatarUrl: testimonial?.avatarUrl || 'https://picsum.photos/seed/new_testimonial/100/100',
                quote: testimonial?.quote || '',
            });
        }
    }, [testimonial, isEnglishAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTestimonial: Testimonial = {
            ...(testimonial || { id: Date.now().toString() } as Testimonial),
            ...formData,
        };
        onSave(finalTestimonial);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {isEnglishAdmin ? 'Edit Testimonial (English)' : (testimonial ? 'تعديل الشهادة' : 'إضافة شهادة جديدة')}
                    </h2>
                    <div className="space-y-4">
                        {isEnglishAdmin ? (
                            <>
                                <div className="bg-gray-100 p-2 rounded text-xs mb-2">
                                    <span className="text-gray-500">Arabic Name:</span> {formData.name || 'Not set'}
                                </div>
                                <input name="name_en" value={formData.name_en || ''} onChange={handleChange} placeholder="Name (English)" className="w-full p-2 border rounded" required />
                                <input name="role_en" value={formData.role_en || ''} onChange={handleChange} placeholder="Role (e.g. Parent) English" className="w-full p-2 border rounded" required />
                                <textarea name="quote_en" value={formData.quote_en || ''} onChange={handleChange} placeholder="Quote (English)" rows={4} className="w-full p-2 border rounded" required></textarea>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Photo (Shared)</label>
                                    <ImageUploadInput
                                        value={formData.avatarUrl || ''}
                                        onChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                                        placeholder="Image URL"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="الاسم" className="w-full p-2 border rounded" required />
                                <input name="role" value={formData.role || ''} onChange={handleChange} placeholder="الدور (مثال: ولي أمر)" className="w-full p-2 border rounded" required />
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">صورة الشخص</label>
                                    <ImageUploadInput
                                        value={formData.avatarUrl || ''}
                                        onChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                                        placeholder="رابط الصورة"
                                    />
                                </div>
                                <textarea name="quote" value={formData.quote || ''} onChange={handleChange} placeholder="الاقتباس" rows={4} className="w-full p-2 border rounded" required></textarea>
                            </>
                        )}
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

const ManageTestimonials: React.FC<ManageTestimonialsProps> = ({ testimonials, setTestimonials, isEnglishAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

    const handleOpenModal = (testimonial: Testimonial | null) => {
        setEditingTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTestimonial(null);
    };

    const handleSaveTestimonial = (testimonialToSave: Testimonial) => {
        if (testimonials.some(t => t.id === testimonialToSave.id)) {
            setTestimonials(prev => prev.map(t => t.id === testimonialToSave.id ? testimonialToSave : t));
        } else {
            setTestimonials(prev => [testimonialToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemoveTestimonial = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الشهادة؟')) {
            setTestimonials(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div>
            {isModalOpen && <TestimonialFormModal testimonial={editingTestimonial} onSave={handleSaveTestimonial} onClose={handleCloseModal} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEnglishAdmin ? 'Manage Testimonials (English)' : 'إدارة شهادات العملاء'}</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    {isEnglishAdmin ? 'Add New' : 'إضافة شهادة جديدة'}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {testimonials.map(item => (
                        <div key={item.id} className="flex items-start justify-between p-4 border rounded-md bg-gray-50">
                             <div className="flex items-start space-x-4 space-x-reverse">
                                <img src={item.avatarUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover"/>
                                <div>
                                    <p className="font-semibold text-blue-900">{isEnglishAdmin ? (item.name_en || item.name) : item.name} <span className="text-sm text-gray-500">({isEnglishAdmin ? (item.role_en || item.role) : item.role})</span></p>
                                    <p className="text-gray-700 italic mt-1">"{isEnglishAdmin ? (item.quote_en || item.quote) : item.quote}"</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:underline mr-4 text-sm">
                                    {isEnglishAdmin ? 'Edit' : 'تعديل'}
                                </button>
                                {!isEnglishAdmin && <button onClick={() => handleRemoveTestimonial(item.id)} className="text-red-500 hover:underline text-sm">حذف</button>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageTestimonials;
