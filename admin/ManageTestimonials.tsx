import React, { useState } from 'react';
// Fix: Corrected import path for types.
import { Testimonial } from '../types';

interface ManageTestimonialsProps {
    testimonials: Testimonial[];
    setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

const TestimonialFormModal: React.FC<{ testimonial: Testimonial | null; onSave: (testimonial: Testimonial) => void; onClose: () => void; }> = ({ testimonial, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>({
        name: testimonial?.name || '',
        role: testimonial?.role || '',
        avatarUrl: testimonial?.avatarUrl || 'https://picsum.photos/seed/new_testimonial/100/100',
        quote: testimonial?.quote || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTestimonial: Testimonial = {
            id: testimonial?.id || Date.now().toString(),
            ...formData,
        };
        onSave(finalTestimonial);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{testimonial ? 'تعديل الشهادة' : 'إضافة شهادة جديدة'}</h2>
                    <div className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="w-full p-2 border rounded" required />
                        <input name="role" value={formData.role} onChange={handleChange} placeholder="الدور (مثال: ولي أمر)" className="w-full p-2 border rounded" required />
                        <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} placeholder="رابط الصورة" className="w-full p-2 border rounded" />
                        <textarea name="quote" value={formData.quote} onChange={handleChange} placeholder="الاقتباس" rows={4} className="w-full p-2 border rounded" required></textarea>
                    </div>
                     <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">إلغاء</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageTestimonials: React.FC<ManageTestimonialsProps> = ({ testimonials, setTestimonials }) => {
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
            {isModalOpen && <TestimonialFormModal testimonial={editingTestimonial} onSave={handleSaveTestimonial} onClose={handleCloseModal} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة شهادات العملاء</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    إضافة شهادة جديدة
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="space-y-4">
                    {testimonials.map(item => (
                        <div key={item.id} className="flex items-start justify-between p-4 border rounded-md bg-gray-50">
                             <div className="flex items-start space-x-4 space-x-reverse">
                                <img src={item.avatarUrl} alt={item.name} className="w-12 h-12 rounded-full object-cover"/>
                                <div>
                                    <p className="font-semibold text-blue-900">{item.name} <span className="text-sm text-gray-500">({item.role})</span></p>
                                    <p className="text-gray-700 italic mt-1">"{item.quote}"</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button onClick={() => handleOpenModal(item)} className="text-blue-500 hover:underline mr-4 text-sm">تعديل</button>
                                <button onClick={() => handleRemoveTestimonial(item.id)} className="text-red-500 hover:underline text-sm">حذف</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManageTestimonials;
