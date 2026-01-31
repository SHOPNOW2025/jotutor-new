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

    const gradesAr = [
        'روضة 1', 'روضة 2',
        'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس',
        'الصف السابع', 'الصف الثامن', 'الصف التاسع', 'الصف العاشر', 'الصف الحادي عشر', 'الصف الثاني عشر (توجيهي)',
        'جامعي'
    ];
    const gradesEn = [
        'KG1', 'KG2',
        '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade',
        '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade',
        'College'
    ];

    const availableGrades = isEnglishAdmin ? gradesEn : gradesAr;

    useEffect(() => {
        if (isEnglishAdmin) {
            setFormData({
                title_en: course?.title_en || '',
                description_en: course?.description_en || '',
                level_en: course?.level_en || '',
                category_en: course?.category_en || (categories.length > 0 ? categories[0] : ''),
                curriculum_en: course?.curriculum_en || '',
                duration_en: course?.duration_en || '',
                includedSubjects_en: course?.includedSubjects_en || '',
                targetGrades: course?.targetGrades || [],
                teacher: course?.teacher || '',
                priceJod: course?.priceJod,
                priceUsd: course?.priceUsd,
                priceSar: course?.priceSar,
                imageUrl: course?.imageUrl,
                isFeatured: course?.isFeatured,
                sessionCount: course?.sessionCount,
                totalHours: course?.totalHours,
            });
        } else {
            setFormData({
                title: course?.title || '',
                description: course?.description || '',
                teacher: course?.teacher || '',
                priceJod: course?.priceJod || (course?.price || 50),
                priceUsd: course?.priceUsd || (course?.priceJod ? course.priceJod * 1.41 : 70),
                priceSar: course?.priceSar || (course?.priceJod ? course.priceJod * 5.3 : 265),
                duration: course?.duration || '4 أسابيع',
                level: course?.level || 'مبتدئ',
                imageUrl: course?.imageUrl || 'https://picsum.photos/seed/course/400/225',
                category: course?.category || (categories.length > 0 ? categories[0] : ''),
                curriculum: course?.curriculum || (curriculums.length > 0 ? curriculums[0] : ''),
                isFeatured: course?.isFeatured || false,
                sessionCount: course?.sessionCount || 0,
                totalHours: course?.totalHours || 0,
                includedSubjects: course?.includedSubjects || '',
                targetGrades: course?.targetGrades || [],
            });
        }
    }, [course, isEnglishAdmin, categories, curriculums]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleGradeToggle = (grade: string) => {
        setFormData(prev => {
            const currentGrades = prev.targetGrades || [];
            if (currentGrades.includes(grade)) {
                return { ...prev, targetGrades: currentGrades.filter(g => g !== grade) };
            } else {
                return { ...prev, targetGrades: [...currentGrades, grade] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCourse: Course = {
            ...(course || { id: Date.now().toString() } as Course),
            ...formData,
        };
        onSave(finalCourse);
    };

    if (isEnglishAdmin) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Course (English Version)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Course Title (English)</label>
                                <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Course Title" className="w-full p-2 border rounded" required />
                            </div>
                            <div className="bg-gray-100 p-2 rounded">
                                <span className="text-xs text-gray-500 block">Teacher (Arabic DB)</span>
                                <span className="font-semibold">{formData.teacher}</span>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Category (English)</label>
                                <input name="category_en" value={formData.category_en || ''} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Curriculum (English)</label>
                                <input name="curriculum_en" value={formData.curriculum_en || ''} onChange={handleChange} placeholder="Curriculum" className="w-full p-2 border rounded" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-2">Target Grade Levels (English)</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
                                    {gradesEn.map(grade => (
                                        <label key={grade} className="flex items-center space-x-2 cursor-pointer">
                                            <input type="checkbox" checked={formData.targetGrades?.includes(grade) || false} onChange={() => handleGradeToggle(grade)} className="rounded text-green-600" />
                                            <span className="text-sm">{grade}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Included Subjects (English)</label>
                                <input name="includedSubjects_en" value={formData.includedSubjects_en || ''} onChange={handleChange} placeholder="e.g. Math, Physics" className="w-full p-2 border rounded" />
                            </div>
                            <input name="duration_en" value={formData.duration_en || ''} onChange={handleChange} placeholder="Duration (e.g. 4 Weeks)" className="p-2 border rounded" />
                            <input name="level_en" value={formData.level_en || ''} onChange={handleChange} placeholder="Level (e.g. Beginner)" className="p-2 border rounded" />
                            <div className="md:col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Description (English)</label>
                                <textarea name="description_en" value={formData.description_en || ''} onChange={handleChange} placeholder="Course Description" rows={4} className="w-full p-2 border rounded"></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
                            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">Save English Data</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{course ? 'تعديل الدورة' : 'إضافة دورة جديدة'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="عنوان الدورة" className="p-2 border rounded md:col-span-2" required />
                        <input name="teacher" value={formData.teacher} onChange={handleChange} placeholder="اسم المعلم" className="p-2 border rounded" required />
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">الفئة</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">المنهاج</label>
                            <select name="curriculum" value={formData.curriculum} onChange={handleChange} className="w-full p-2 border rounded">
                                <option value="">اختر المنهاج</option>
                                {curriculums.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-2">الصفوف المستهدفة</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
                                {gradesAr.map(grade => (
                                    <label key={grade} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                                        <input type="checkbox" checked={formData.targetGrades?.includes(grade) || false} onChange={() => handleGradeToggle(grade)} className="rounded text-green-600" />
                                        <span className="text-sm">{grade}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">المواد التي تشملها الدورة</label>
                            <input name="includedSubjects" value={formData.includedSubjects} onChange={handleChange} placeholder="مثال: الرياضيات، الفيزياء، الكيمياء" className="w-full p-2 border rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 bg-blue-50 p-2 rounded border md:col-span-2">
                             <div>
                                <label className="block text-xs text-gray-500 mb-1">عدد الحصص</label>
                                <input name="sessionCount" type="number" value={formData.sessionCount} onChange={handleChange} placeholder="عدد الحصص" className="w-full p-2 border rounded" />
                             </div>
                             <div>
                                <label className="block text-xs text-gray-500 mb-1">مدة الحصة (ساعة)</label>
                                <input name="totalHours" type="number" value={formData.totalHours} onChange={handleChange} placeholder="مدة الحصة" className="w-full p-2 border rounded" />
                             </div>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded border">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">السعر (JOD)</label>
                                <input name="priceJod" type="number" value={formData.priceJod} onChange={handleChange} placeholder="د.أ" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">السعر (USD)</label>
                                <input name="priceUsd" type="number" value={formData.priceUsd} onChange={handleChange} placeholder="$" className="w-full p-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">السعر (SAR)</label>
                                <input name="priceSar" type="number" value={formData.priceSar} onChange={handleChange} placeholder="ر.س" className="w-full p-2 border rounded" />
                            </div>
                        </div>
                        <input name="duration" value={formData.duration} onChange={handleChange} placeholder="المدة (نصي)" className="p-2 border rounded" />
                        <input name="level" value={formData.level} onChange={handleChange} placeholder="المستوى" className="p-2 border rounded" />
                        <div className="md:col-span-2">
                            <label className="block text-xs text-gray-500 mb-1">صورة الدورة</label>
                            <ImageUploadInput value={formData.imageUrl || ''} onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))} placeholder="رابط الصورة" />
                        </div>
                        <div className="md:col-span-2">
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="وصف الدورة" rows={4} className="w-full p-2 border rounded"></textarea>
                        </div>
                        <div className="md:col-span-2 flex items-center mt-2">
                            <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="h-5 w-5 text-green-600 border-gray-300 rounded ml-2" />
                            <label htmlFor="isFeatured" className="text-sm text-gray-700 font-bold">إظهار في الصفحة الرئيسية</label>
                        </div>
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

const ManageCourses: React.FC<ManageCoursesProps> = ({ courses, setCourses, courseCategories, curriculums, isEnglishAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [isSeeding, setIsSeeding] = useState(false);

    const handleOpenModal = (course: Course | null) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };

    const handleSaveCourse = (courseToSave: Course) => {
        if (courses.some(c => c.id === courseToSave.id)) {
            setCourses(prev => prev.map(c => c.id === courseToSave.id ? courseToSave : c));
        } else {
            setCourses(prev => [courseToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemoveCourse = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذه الدورة؟')) {
            setCourses(prev => prev.filter(c => c.id !== id));
        }
    };
    
    const handleSeedData = async () => {
        if (!window.confirm('هل أنت متأكد من رغبتك في إضافة البيانات الأولية؟ سيتم إضافة أو تحديث أكثر من 80 دورة.')) return;
        setIsSeeding(true);
        const result = await seedInitialCourses();
        if (result.success && result.seededCourses) {
            setCourses(result.seededCourses);
            alert('تم تحميل البيانات الأولية للدورات بنجاح!');
        }
        setIsSeeding(false);
    };

    return (
        <div>
            {isModalOpen && <CourseFormModal course={editingCourse} onSave={handleSaveCourse} onClose={handleCloseModal} categories={courseCategories} curriculums={curriculums} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEnglishAdmin ? 'Course Management (English Mode)' : 'إدارة الدورات'}</h1>
                 {!isEnglishAdmin && (
                     <div className="flex space-x-2 space-x-reverse">
                        <button onClick={handleSeedData} disabled={isSeeding} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400">{isSeeding ? 'جاري التحميل...' : 'تحميل بيانات أولية'}</button>
                        <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">إضافة دورة جديدة</button>
                    </div>
                 )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">Title (Primary)</th>
                                {isEnglishAdmin && <th className="text-right py-3 px-4 font-semibold text-sm">Title (English)</th>}
                                <th className="text-right py-3 px-4 font-semibold text-sm">Teacher</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="border-b">
                                    <td className="py-3 px-4">{course.title}</td>
                                    {isEnglishAdmin && <td className="py-3 px-4 text-blue-700">{course.title_en || '-'}</td>}
                                    <td className="py-3 px-4">{course.teacher}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(course)} className="text-blue-500 hover:underline mr-4">Edit</button>
                                        {!isEnglishAdmin && <button onClick={() => handleRemoveCourse(course.id)} className="text-red-500 hover:underline">Delete</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;