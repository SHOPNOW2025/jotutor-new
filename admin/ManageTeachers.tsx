import React, { useState } from 'react';
// Fix: Corrected import path for types.
import { Teacher } from '../types';

interface ManageTeachersProps {
    teachers: Teacher[];
    setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherFormModal: React.FC<{ teacher: Teacher | null; onSave: (teacher: Teacher) => void; onClose: () => void }> = ({ teacher, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Teacher, 'id' | 'rating' | 'reviews'>>({
        name: teacher?.name || '',
        avatarUrl: teacher?.avatarUrl || 'https://picsum.photos/seed/new/200/200',
        level: teacher?.level || '',
        experience: teacher?.experience || 0,
        specialties: teacher?.specialties || [],
        pricePerHour: teacher?.pricePerHour || 20,
        bio: teacher?.bio || '',
        qualifications: teacher?.qualifications || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setFormData(prev => ({ ...prev, [name]: isNumber ? Number(value) : value }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'specialties' | 'qualifications') => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, [field]: value.split(',').map(s => s.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTeacher: Teacher = {
            id: teacher?.id || Date.now().toString(),
            rating: teacher?.rating || 0,
            reviews: teacher?.reviews || 0,
            ...formData
        };
        onSave(finalTeacher);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{teacher ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="p-2 border rounded" required />
                        <input name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} placeholder="رابط الصورة" className="p-2 border rounded" />
                        <input name="level" value={formData.level} onChange={handleChange} placeholder="المرحلة (مثال: ابتدائي, متوسط)" className="p-2 border rounded" />
                        <input name="experience" type="number" value={formData.experience} onChange={handleChange} placeholder="سنوات الخبرة" className="p-2 border rounded" />
                        <input name="pricePerHour" type="number" value={formData.pricePerHour} onChange={handleChange} placeholder="السعر للساعة" className="p-2 border rounded" />
                        <div className="md:col-span-2">
                           <input name="specialties" value={formData.specialties.join(', ')} onChange={e => handleArrayChange(e, 'specialties')} placeholder="التخصصات (مفصولة بفاصلة)" className="w-full p-2 border rounded" />
                        </div>
                        <div className="md:col-span-2">
                            <input name="qualifications" value={formData.qualifications.join(', ')} onChange={e => handleArrayChange(e, 'qualifications')} placeholder="المؤهلات (مفصولة بفاصلة)" className="w-full p-2 border rounded" />
                        </div>
                        <div className="md:col-span-2">
                            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="نبذة تعريفية" rows={4} className="w-full p-2 border rounded"></textarea>
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


const ManageTeachers: React.FC<ManageTeachersProps> = ({ teachers, setTeachers }) => {
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
            {isModalOpen && <TeacherFormModal teacher={editingTeacher} onSave={handleSaveTeacher} onClose={handleCloseModal} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة المعلمين</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    إضافة معلم جديد
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">الاسم</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">المرحلة</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">التخصصات</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map(teacher => (
                                <tr key={teacher.id} className="border-b">
                                    <td className="py-3 px-4 flex items-center">
                                        <img src={teacher.avatarUrl} alt={teacher.name} className="w-10 h-10 rounded-full ml-4 object-cover" />
                                        {teacher.name}
                                    </td>
                                    <td className="py-3 px-4">{teacher.level}</td>
                                    <td className="py-3 px-4">{teacher.specialties.join(', ')}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(teacher)} className="text-blue-500 hover:underline mr-4">تعديل</button>
                                        <button onClick={() => handleRemoveTeacher(teacher.id)} className="text-red-500 hover:underline">حذف</button>
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
