
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
    
    const [editLang, setEditLang] = useState<'ar' | 'en'>('ar');
    const [formData, setFormData] = useState<Partial<Course>>({});

    useEffect(() => {
        if (course) {
            setFormData({ ...course });
        } else {
            setFormData({
                id: Date.now().toString(),
                title: '',
                title_en: '',
                description: '',
                description_en: '',
                teacher: '',
                teacher_en: '',
                priceJod: 50,
                duration: '4 أسابيع',
                duration_en: '4 Weeks',
                level: 'مبتدئ',
                level_en: 'Beginner',
                imageUrl: '',
                category: 'التأسيس',
                category_en: 'Foundation',
                curriculum: 'المنهاج الدولي',
                curriculum_en: 'International Curriculum',
                isFeatured: false,
                sessionCount: 8,
                totalHours: 1,
                includedSubjects: ''
            });
        }
    }, [course]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Course);
    };

    return (
        <div className="fixed inset-0 bg-blue-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-fade-in-up border-[6px] border-white">
                
                {/* Header with Switch */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-blue-900">
                            {course ? 'إعدادات الدورة' : 'دورة تعليمية جديدة'}
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Advanced Course Builder</p>
                    </div>
                    
                    <div className="flex bg-gray-200 p-1.5 rounded-2xl shadow-inner">
                        <button 
                            type="button"
                            onClick={() => setEditLang('ar')}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${editLang === 'ar' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            اللغة العربية
                        </button>
                        <button 
                            type="button"
                            onClick={() => setEditLang('en')}
                            className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all duration-300 ${editLang === 'en' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            English Mode
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    
                    {/* الحقول اللغوية المتغيرة */}
                    <div className="bg-blue-50/40 p-8 rounded-[2rem] border border-blue-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <span className="text-8xl font-black">{editLang.toUpperCase()}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg">
                                {editLang === 'ar' ? 'ع' : 'EN'}
                            </div>
                            <h3 className="text-lg font-black text-blue-900 uppercase">بيانات المحتوى ({editLang === 'ar' ? 'بالعربية' : 'In English'})</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            {editLang === 'ar' ? (
                                <>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">العنوان (بالعربية)</label>
                                        <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="مثال: باقة التأسيس الشاملة" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">المعلم (بالعربية)</label>
                                        <input name="teacher" value={formData.teacher || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="اسم المعلم" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">المادة (بالعربية)</label>
                                        <input name="category" value={formData.category || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="مثال: التأسيس" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">المنهاج (بالعربية)</label>
                                        <input name="curriculum" value={formData.curriculum || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="مثال: المنهاج الدولي" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">المستوى والمدة (بالعربية)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input name="level" value={formData.level || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="مبتدئ" />
                                            <input name="duration" value={formData.duration || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="4 أسابيع" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">التفاصيل الكاملة (بالعربية)</label>
                                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={5} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm"></textarea>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">Course Title (English)</label>
                                        <input name="title_en" value={formData.title_en || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="e.g. Comprehensive Foundation Bundle" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">Teacher Name (English)</label>
                                        <input name="teacher_en" value={formData.teacher_en || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="Teacher Name" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">Subject/Category (English)</label>
                                        <input name="category_en" value={formData.category_en || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="e.g. Foundation" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">Curriculum (English)</label>
                                        <input name="curriculum_en" value={formData.curriculum_en || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="e.g. International Curriculum" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">Level & Duration (English)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input name="level_en" value={formData.level_en || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="Beginner" />
                                            <input name="duration_en" value={formData.duration_en || ''} onChange={handleChange} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm" placeholder="4 Weeks" />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-blue-400 mb-2 uppercase tracking-widest mr-1">Full Details (English)</label>
                                        <textarea name="description_en" value={formData.description_en || ''} onChange={handleChange} rows={5} className="w-full p-4 bg-white border-2 border-blue-50 rounded-2xl outline-none focus:border-blue-500 font-bold shadow-sm"></textarea>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* الإعدادات الفنية والمشتركة */}
                    <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-inner">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center font-black shadow-lg">
                                ⚙️
                            </div>
                            <h3 className="text-lg font-black text-blue-900 uppercase">إعدادات ثابتة للجهتين (سعر، حصص، صور)</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest mr-1">السعر الإجمالي (JOD)</label>
                                <input name="priceJod" type="number" value={formData.priceJod || 0} onChange={handleChange} className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-green-500 font-black text-green-600 shadow-sm text-center" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest mr-1">عدد الحصص</label>
                                <input name="sessionCount" type="number" value={formData.sessionCount || 0} onChange={handleChange} className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-green-500 font-black shadow-sm text-center" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest mr-1">ساعة / لكل حصة</label>
                                <input name="totalHours" type="number" step="0.5" value={formData.totalHours || 0} onChange={handleChange} className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-green-500 font-black shadow-sm text-center" />
                            </div>
                            
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest mr-1">رابط صورة الدورة</label>
                                <ImageUploadInput 
                                    value={formData.imageUrl || ''} 
                                    onChange={(url) => setFormData(p => ({...p, imageUrl: url}))} 
                                    placeholder="ارفع صورة جذابة للدورة" 
                                    className="shadow-sm"
                                />
                            </div>

                            <div className="md:col-span-3 flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-gray-50 shadow-sm">
                                <div>
                                    <p className="text-sm font-black text-blue-900 uppercase">تمييز هذه الدورة (Featured)</p>
                                    <p className="text-[10px] text-gray-400 font-bold">ستظهر الدورة في واجهة "أحدث الدورات" بالصفحة الرئيسية</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setFormData(p => ({...p, isFeatured: !p.isFeatured}))}
                                    className={`w-16 h-9 rounded-full transition-all duration-500 relative flex items-center ${formData.isFeatured ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute w-7 h-7 bg-white rounded-full transition-all duration-500 shadow-md ${formData.isFeatured ? 'right-8' : 'right-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* أزرار الحفظ */}
                    <div className="flex gap-4 pt-6">
                        <button type="submit" className="flex-1 bg-blue-900 text-white font-black py-5 rounded-[1.5rem] shadow-2xl hover:bg-blue-800 transition-all active:scale-[0.97] text-lg">
                            اعتماد وحفظ البيانات (باللغتين)
                        </button>
                        <button type="button" onClick={onClose} className="px-12 py-5 bg-gray-100 text-gray-400 font-black rounded-[1.5rem] hover:bg-gray-200 transition-all uppercase text-xs">
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
        <div className="animate-fade-in pb-20">
            {isModalOpen && (
                <CourseFormModal 
                    course={editingCourse} 
                    onSave={handleSaveCourse} 
                    onClose={() => setIsModalOpen(false)} 
                    categories={courseCategories} 
                    curriculums={curriculums} 
                />
            )}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-50">
                <div>
                    <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">إدارة الدورات</h1>
                    <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">Dual-Language Management Hub</p>
                </div>
                <button 
                    onClick={() => handleOpenModal(null)} 
                    className="bg-green-500 text-white font-black py-4 px-10 rounded-2xl shadow-xl hover:bg-green-600 transition-all transform hover:-translate-y-1 flex items-center gap-3 active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    إضافة دورة جديدة
                </button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-8 font-black text-gray-400 text-[10px] uppercase tracking-widest">الدورة والمحتوى</th>
                            <th className="p-8 font-black text-gray-400 text-[10px] uppercase tracking-widest text-center">اكتمال اللغات</th>
                            <th className="p-8 font-black text-gray-400 text-[10px] uppercase tracking-widest">السعر النهائي</th>
                            <th className="p-8 font-black text-gray-400 text-[10px] uppercase tracking-widest text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-all duration-300 group">
                                <td className="p-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white ring-1 ring-gray-100 group-hover:scale-110 transition-transform">
                                            <img src={c.imageUrl || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <div className="font-black text-blue-900 text-lg group-hover:text-blue-600 transition-colors">{c.title}</div>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">{c.category}</span>
                                                <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">بواسطة: {c.teacher}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex justify-center gap-3">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="w-8 h-8 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-black border border-green-200">AR</span>
                                            <span className="text-[8px] text-green-600 font-bold uppercase">Ready</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border transition-colors ${c.title_en ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-50 text-red-400 border-red-100'}`}>EN</span>
                                            <span className={`text-[8px] font-bold uppercase ${c.title_en ? 'text-green-600' : 'text-red-400'}`}>{c.title_en ? 'Ready' : 'Pending'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="font-black text-green-600 text-xl">{c.priceJod} JOD</div>
                                </td>
                                <td className="p-8 text-center">
                                    <button 
                                        onClick={() => handleOpenModal(c)} 
                                        className="bg-blue-900 text-white font-black px-8 py-3 rounded-2xl hover:bg-blue-800 transition-all text-xs shadow-lg transform active:scale-95"
                                    >
                                        فتح وتعديل البيانات
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {courses.length === 0 && (
                    <div className="py-32 text-center text-gray-300">
                        <div className="text-6xl mb-4 opacity-20">📭</div>
                        <p className="font-black uppercase text-sm tracking-widest opacity-40">لا يوجد دورات مسجلة حالياً</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourses;
