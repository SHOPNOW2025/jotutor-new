
import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import ImageUploadInput from './ImageUploadInput';

interface ManageTeachersProps {
    teachers: Teacher[];
    setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
    isEnglishAdmin?: boolean;
}

const TeacherFormModal: React.FC<{ teacher: Teacher | null; onSave: (teacher: Teacher) => void; onClose: () => void; isEnglishAdmin?: boolean; }> = ({ teacher, onSave, onClose, isEnglishAdmin }) => {
    const [formData, setFormData] = useState<Partial<Teacher>>({});

    useEffect(() => {
        if (isEnglishAdmin) {
            setFormData({
                name_en: teacher?.name_en || '',
                level_en: teacher?.level_en || '',
                bio_en: teacher?.bio_en || '',
                specialties_en: teacher?.specialties_en || [],
                qualifications_en: teacher?.qualifications_en || [],
                avatarUrl: teacher?.avatarUrl, // Shared
                // We keep name/level/etc. as is if editing, or undefined if new
            });
        } else {
            setFormData({
                name: teacher?.name || '',
                avatarUrl: teacher?.avatarUrl || 'https://picsum.photos/seed/new/200/200',
                level: teacher?.level || '',
                experience: teacher?.experience || 0,
                specialties: teacher?.specialties || [],
                rating: teacher?.rating || 5.0,
                reviews: teacher?.reviews || 0,
                pricePerHour: teacher?.pricePerHour || 20,
                bio: teacher?.bio || '',
                qualifications: teacher?.qualifications || [],
            });
        }
    }, [teacher, isEnglishAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'specialties' | 'qualifications' | 'specialties_en' | 'qualifications_en') => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTeacher: Teacher = {
            ...(teacher || { id: Date.now().toString() } as Teacher),
            ...formData
        };
        onSave(finalTeacher);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {isEnglishAdmin ? 'Edit Teacher (English)' : (teacher ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isEnglishAdmin ? (
                            <>
                                <div className="md:col-span-2 bg-gray-100 p-2 rounded mb-2">
                                    <p className="text-xs text-gray-500">Arabic Name: {teacher?.name || 'Not set'}</p>
                                </div>
                                <input name="name_en" value={formData.name_en || ''} onChange={handleChange} placeholder="Name (English)" className="p-2 border rounded" required />
                                <input name="level_en" value={formData.level_en || ''} onChange={handleChange} placeholder="Level (English) e.g., Primary" className="p-2 border rounded" />
                                
                                <div className="md:col-span-2">
                                   <input name="specialties_en" value={(formData.specialties_en || []).join(', ')} onChange={e => handleArrayChange(e, 'specialties_en')} placeholder="Specialties (comma separated) English" className="w-full p-2 border rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <input name="qualifications_en" value={(formData.qualifications_en || []).join(', ')} onChange={e => handleArrayChange(e, 'qualifications_en')} placeholder="Qualifications (comma separated) English" className="w-full p-2 border rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <textarea name="bio_en" value={formData.bio_en || ''} onChange={handleChange} placeholder="Bio (English)" rows={4} className="w-full p-2 border rounded"></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Image (Shared)</label>
                                    <ImageUploadInput
                                        value={formData.avatarUrl || ''}
                                        onChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                                        placeholder="Image URL"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="الاسم" className="p-2 border rounded" required />
                                <div>
                                    <ImageUploadInput
                                        value={formData.avatarUrl || ''}
                                        onChange={(url) => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                                        placeholder="رابط الصورة"
                                    />
                                </div>
                                <input name="level" value={formData.level || ''} onChange={handleChange} placeholder="المرحلة (مثال: ابتدائي, متوسط)" className="p-2 border rounded" />
                                <input name="experience" type="number" value={formData.experience || 0} onChange={handleChange} placeholder="سنوات الخبرة" className="p-2 border rounded" />
                                <input name="pricePerHour" type="number" value={formData.pricePerHour || 0} onChange={handleChange} placeholder="السعر للساعة" className="p-2 border rounded" />
                                <div className="md:col-span-2">
                                   <input name="specialties" value={(formData.specialties || []).join(', ')} onChange={e => handleArrayChange(e, 'specialties')} placeholder="التخصصات (مفصولة بفاصلة)" className="w-full p-2 border rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <input name="qualifications" value={(formData.qualifications || []).join(', ')} onChange={e => handleArrayChange(e, 'qualifications')} placeholder="المؤهلات (مفصولة بفاصلة)" className="w-full p-2 border rounded" />
                                </div>
                                <div className="md:col-span-2">
                                    <textarea name="bio" value={formData.bio || ''} onChange={handleChange} placeholder="نبذة تعريفية" rows={4} className="w-full p-2 border rounded"></textarea>
                                </div>
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


const ManageTeachers: React.FC<ManageTeachersProps> = ({ teachers, setTeachers, isEnglishAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

    const handleOpenModal = (teacher: Teacher | null) => {
        setEditingTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTeacher(null);
    };

    const handleSaveTeacher = (teacherToSave: Teacher) => {
        if (teachers.some(t => t.id === teacherToSave.id)) {
            setTeachers(prev => prev.map(t => t.id === teacherToSave.id ? teacherToSave : t));
        } else {
            setTeachers(prev => [teacherToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemoveTeacher = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المعلم؟')) {
            setTeachers(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div>
            {isModalOpen && <TeacherFormModal teacher={editingTeacher} onSave={handleSaveTeacher} onClose={handleCloseModal} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEnglishAdmin ? 'Manage Teachers (English)' : 'إدارة المعلمين'}</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    {isEnglishAdmin ? 'Add New Teacher' : 'إضافة معلم جديد'}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    {isEnglishAdmin ? 'Name (EN/AR)' : 'الاسم'}
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    {isEnglishAdmin ? 'Level' : 'المرحلة'}
                                </th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">
                                    {isEnglishAdmin ? 'Actions' : 'الإجراءات'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher.id} className="border-b">
                                    <td className="py-3 px-4 flex items-center">
                                        <img src={teacher.avatarUrl} alt={teacher.name} className="w-10 h-10 rounded-full ml-4 object-cover" />
                                        <div>
                                            <div className="font-bold">{isEnglishAdmin ? (teacher.name_en || teacher.name) : teacher.name}</div>
                                            {isEnglishAdmin && <div className="text-xs text-gray-500">{teacher.name}</div>}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">{isEnglishAdmin ? (teacher.level_en || teacher.level) : teacher.level}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(teacher)} className="text-blue-500 hover:underline mr-4">
                                            {isEnglishAdmin ? 'Edit' : 'تعديل'}
                                        </button>
                                        {!isEnglishAdmin && <button onClick={() => handleRemoveTeacher(teacher.id)} className="text-red-500 hover:underline">حذف</button>}
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

export default ManageTeachers;
