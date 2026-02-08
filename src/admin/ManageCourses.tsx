import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { seedInitialCourses } from '../googleSheetService';
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
}> = ({ course, onSave, onClose, categories, curriculums }) => {
    
    // لغة التعديل الحالية داخل المودال
    const [editLang, setEditLang] = useState<'ar' | 'en'>('ar');
    const [formData, setFormData] = useState<Partial<Course>>({});

    useEffect(() => {
        if (course) {
            setFormData({ ...course });
        } else {
            // بيانات افتراضية للدورة الجديدة
            setFormData({
                id: Date.now().toString(),
                title: '',
                title_en: '',
                description: '',
                description_en: '',
                teacher: '',
                priceJod: 50,
                duration: '4 أسابيع',
                duration_en: '4 Weeks',
                level: 'مبتدئ',
                level_en: 'Beginner',
                imageUrl: '',
                category: categories[0] || '',
                category_en: '',
                curriculum: curriculums[0] || '',
                curriculum_en: '',
                isFeatured: false,
                includedSubjects: '',
                includedSubjects_en: '',
                sessionCount: 0,
                totalHours: 0
            });
        }
    }, [course, categories, curriculums]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleToggleFeatured = () => {
        setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Course);
    };

    return (
        <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                
                {/* Header with Language Toggle */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <div>
                        <h2 className="text-xl font-black text-blue-900 uppercase tracking-tighter">
                            {course ? 'تعديل الدورة' : 'إضافة دورة جديدة'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Course Management System</p>
                    </div>
                    
                    <div className="flex bg-gray-200 p-1 rounded-2xl">
                        <button 
                            type="button"
                            onClick={() => setEditLang('ar')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${editLang === 'ar' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500'}`}
                        >
                            العربية
                        </button>
                        <button 
                            type="button"
                            onClick={() => setEditLang('en')}
                            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${editLang === 'en' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500'}`}
                        >
                            English
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* حقول متغيرة حسب اللغة المختارة */}
                        <div className="md:col-span-2 space-y-6 bg-blue-50/30 p-6 rounded-3xl border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <h3 className="text-xs font-black text-blue-900 uppercase">معلومات النسخة {editLang === 'ar' ? 'العربية' : 'الإنجليزية'}</h3>
                            </div>

                            {editLang === 'ar' ? (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">عنوان الدورة (العربي)</label>
                                        <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold" placeholder="مثلاً: باقة الرياضيات المتقدمة" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">الفئة (العربي)</label>
                                            <input name="category" value={formData.category || ''} onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold" placeholder="تقوية، لغات..." />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">المادة/المواد المشمولة (العربي)</label>
                                            <input name="includedSubjects" value={formData.includedSubjects || ''} onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold" placeholder="الرياضيات، الفيزياء..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">الوصف (العربي)</label>
                                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold"></textarea>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">Course Title (English)</label>
                                        <input name="title_en" value={formData.title_en || ''} onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold" placeholder="e.g. Advanced Math Package" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">Category (English)</label>
                                            <input name="category_en" value={formData.category_en || ''} onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold" placeholder="Reinforcement, Languages..." />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">Included Subjects (English)</label>
                                            <input name="includedSubjects_en" value={formData.includedSubjects_en || ''} onChange={handleChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold" placeholder="Math, Physics..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">Description (English)</label>
                                        <textarea name="description_en" value={formData.description_en || ''} onChange={handleChange} rows={4} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl outline-none focus:border-blue-500 font-bold"></textarea>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* حقول مشتركة لا تتأثر بتبديل اللغة */}
                        <div className="md:col-span-2 pt-4">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <h3 className="text-xs font-black text-blue-900 uppercase">إعدادات ثابتة (تظهر في اللغتين)</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">اسم المعلم</label>
                                    <input name="teacher" value={formData.teacher || ''} onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-500 font-bold" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">السعر (JOD)</label>
                                    <input name="priceJod" type="number" value={formData.priceJod || 0} onChange={handleChange} className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-green-500 font-bold" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 mb-1 uppercase mr-1">صورة الدورة</label>
                                    <ImageUploadInput value={formData.imageUrl || ''} onChange={(url) => setFormData(p => ({...p, imageUrl: url}))} placeholder="رابط صورة الدورة" />
                                </div>
                                
                                <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                    <div>
                                        <p className="text-sm font-black text-blue-900">تمييز الدورة</p>
                                        <p className="text-[10px] text-gray-400 font-bold">ستظهر في قسم "أحدث الدورات" في الصفحة الرئيسية</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleToggleFeatured}
                                        className={`w-14 h-8 rounded-full transition-all relative ${formData.isFeatured ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${formData.isFeatured ? 'right-7' : 'right-1'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-12 pt-8 border-t">
                        <button type="submit" className="flex-1 bg-blue-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98]">
                            حفظ التعديلات (للغتين)
                        </button>
                        <button type="button" onClick={onClose} className="px-10 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageCourses: React.FC<ManageCoursesProps> = ({ courses, setCourses, courseCategories, curriculums }) => {
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
        <div className="animate-fade-in">
            {isModalOpen && (
                <CourseFormModal 
                    course={editingCourse} 
                    onSave={handleSaveCourse} 
                    onClose={() => setIsModalOpen(false)} 
                    categories={courseCategories} 
                    curriculums={curriculums} 
                />
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-900">إدارة الدورات</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">تعديل المحتوى العربي والإنجليزي في مكان واحد</p>
                </div>
                <button 
                    onClick={() => handleOpenModal(null)} 
                    className="bg-green-500 text-white font-black py-3 px-8 rounded-2xl shadow-xl hover:bg-green-600 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    إضافة دورة جديدة
                </button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-6 font-black text-gray-400 text-[10px] uppercase">الدورة والمعلومات</th>
                            <th className="p-6 font-black text-gray-400 text-[10px] uppercase">الحالة اللغوية</th>
                            <th className="p-6 font-black text-gray-400 text-[10px] uppercase">السعر</th>
                            <th className="p-6 font-black text-gray-400 text-[10px] uppercase text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                                            <img src={c.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-blue-900 group-hover:text-blue-600 transition-colors">{c.title}</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5 font-bold">{c.category} • {c.teacher}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex gap-2">
                                        <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-black" title="Arabic Ready">AR</span>
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${c.title_en ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`} title={c.title_en ? 'English Ready' : 'English Missing'}>EN</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="font-black text-green-600">{c.priceJod} JOD</div>
                                </td>
                                <td className="p-6 text-center">
                                    <button 
                                        onClick={() => handleOpenModal(c)} 
                                        className="bg-blue-50 text-blue-600 font-bold px-5 py-2 rounded-xl hover:bg-blue-900 hover:text-white transition-all text-xs"
                                    >
                                        تعديل البيانات
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {courses.length === 0 && (
                    <div className="py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">لا يوجد دورات مضافة حالياً</div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;