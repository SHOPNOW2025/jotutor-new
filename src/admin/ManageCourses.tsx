
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { seedInitialCourses } from '../googleSheetService';
import { initialData } from '../mockData';
import ImageUploadInput from './ImageUploadInput';

interface ManageCoursesProps {
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    courseCategories: string[];
    curriculums: string[];
    isEnglishAdmin?: boolean;
}

const CourseFormModal: React.FC<{ 
    course: Course | null; 
    onSave: (course: Course) => void; 
    onClose: () => void; 
    categories: string[]; 
    curriculums: string[];
    isEnglishAdmin?: boolean;
}> = ({ course, onSave, onClose, categories, curriculums, isEnglishAdmin }) => {
    
    const [formData, setFormData] = useState<Partial<Course>>({});

    useEffect(() => {
        if (isEnglishAdmin) {
            setFormData({
                title_en: course?.title_en || '',
                description_en: course?.description_en || '',
                level_en: course?.level_en || '',
                category_en: course?.category_en || '',
                curriculum_en: course?.curriculum_en || '',
                duration_en: course?.duration_en || '',
                includedSubjects_en: course?.includedSubjects_en || '',
                // Preserve non-translatable fields
                id: course?.id,
                teacher: course?.teacher,
                imageUrl: course?.imageUrl,
                priceJod: course?.priceJod
            });
        } else {
            setFormData({
                title: course?.title || '',
                description: course?.description || '',
                teacher: course?.teacher || '',
                priceJod: course?.priceJod || 50,
                duration: course?.duration || '4 أسابيع',
                level: course?.level || 'مبتدئ',
                imageUrl: course?.imageUrl || '',
                category: course?.category || '',
                curriculum: course?.curriculum || '',
                isFeatured: course?.isFeatured || false,
                includedSubjects: course?.includedSubjects || ''
            });
        }
    }, [course, isEnglishAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCourse: Course = {
            ...(course || { id: Date.now().toString() } as Course),
            ...formData,
        };
        onSave(finalCourse);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="text-2xl font-black text-blue-900 mb-6 border-b pb-4">
                        {isEnglishAdmin ? 'Edit Course Details (English)' : 'تعديل بيانات الدورة (عربي)'}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isEnglishAdmin ? (
                            <>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Course Title (EN)</label>
                                    <input name="title_en" value={formData.title_en || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Category (EN)</label>
                                    <input name="category_en" value={formData.category_en || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Curriculum (EN)</label>
                                    <input name="curriculum_en" value={formData.curriculum_en || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Description (EN)</label>
                                    <textarea name="description_en" value={formData.description_en || ''} onChange={handleChange} rows={4} className="w-full p-3 bg-gray-50 border rounded-xl"></textarea>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">عنوان الدورة (AR)</label>
                                    <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">الفئة (AR)</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold">
                                        <option value="">اختر</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">المعلم</label>
                                    <input name="teacher" value={formData.teacher || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border rounded-xl font-bold" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">الوصف (AR)</label>
                                    <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} className="w-full p-3 bg-gray-50 border rounded-xl font-bold"></textarea>
                                </div>
                            </>
                        )}
                        
                        {!isEnglishAdmin && (
                            <div className="md:col-span-2 mt-4 pt-4 border-t">
                                <label className="block text-xs font-bold text-blue-900 mb-2 uppercase">إعدادات مشتركة</label>
                                <ImageUploadInput value={formData.imageUrl || ''} onChange={(url) => setFormData(p => ({...p, imageUrl: url}))} placeholder="صورة الدورة" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-10">
                        <button type="button" onClick={onClose} className="px-8 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl">إلغاء</button>
                        <button type="submit" className="px-10 py-3 bg-blue-900 text-white font-black rounded-xl shadow-lg hover:bg-blue-800 transition-all">
                            حفظ البيانات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageCourses: React.FC<ManageCoursesProps> = ({ courses, setCourses, courseCategories, curriculums, isEnglishAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const handleOpenModal = (course: Course | null) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleSaveCourse = (courseToSave: Course) => {
        setCourses(prev => {
            const index = prev.findIndex(c => c.id === courseToSave.id);
            if (index > -1) {
                const updated = [...prev];
                updated[index] = courseToSave;
                return updated;
            }
            return [courseToSave, ...prev];
        });
        setIsModalOpen(false);
    };

    return (
        <div>
            {isModalOpen && <CourseFormModal course={editingCourse} onSave={handleSaveCourse} onClose={() => setIsModalOpen(false)} categories={courseCategories} curriculums={curriculums} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-blue-900">{isEnglishAdmin ? 'Courses (English Mode)' : 'إدارة الدورات (عربي)'}</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-500 text-white font-black py-3 px-8 rounded-2xl shadow-xl hover:bg-green-600 transition-all">إضافة دورة جديدة</button>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-5 font-bold text-gray-400">العنوان</th>
                            <th className="p-5 font-bold text-gray-400">الحالة</th>
                            <th className="p-5 font-bold text-gray-400">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id} className="border-b hover:bg-blue-50/30 transition-colors">
                                <td className="p-5">
                                    <div className="font-bold text-blue-900">{isEnglishAdmin ? (c.title_en || 'No English Title') : c.title}</div>
                                    <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">ID: {c.id}</div>
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-black ${isEnglishAdmin && !c.title_en ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                                        {isEnglishAdmin && !c.title_en ? 'Need Translation' : 'Ready'}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <button onClick={() => handleOpenModal(c)} className="text-blue-600 font-bold hover:underline">تعديل</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCourses;
