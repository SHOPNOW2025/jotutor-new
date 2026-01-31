
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';

interface ProfileViewProps {
    userProfile: UserProfile;
    onUpdate: (updatedProfile: UserProfile) => Promise<boolean>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
    const [newSubject, setNewSubject] = useState('');

    // تحديث البيانات المحلية إذا تغير البروفايل من الخارج
    useEffect(() => {
        setFormData({ ...userProfile });
    }, [userProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubject = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
            setFormData(prev => ({
                ...prev,
                subjects: [...prev.subjects, newSubject.trim()]
            }));
            setNewSubject('');
        }
    };

    const handleRemoveSubject = (subjectToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter(s => s !== subjectToRemove)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        const success = await onUpdate(formData);
        if (success) {
            setIsEditing(false);
        } else {
            alert("حدث خطأ أثناء حفظ البيانات. يرجى المحاولة لاحقاً.");
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        setFormData({ ...userProfile });
        setIsEditing(false);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-black text-blue-900">الملف الشخصي</h1>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-900 text-white font-bold py-2 px-6 rounded-xl hover:bg-blue-800 transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        تعديل الملف الشخصي
                    </button>
                )}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* الاسم الكامل */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">الاسم الكامل</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold"
                            />
                        ) : (
                            <p className="text-lg font-bold text-blue-900 mt-1">{userProfile.username}</p>
                        )}
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">البريد الإلكتروني</label>
                        {isEditing ? (
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold"
                            />
                        ) : (
                            <p className="text-lg font-bold text-blue-900 mt-1">{userProfile.email}</p>
                        )}
                    </div>

                    {/* العمر */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">العمر</label>
                        {isEditing ? (
                            <input 
                                type="number" 
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold"
                            />
                        ) : (
                            <p className="text-lg font-bold text-blue-900 mt-1">{userProfile.age}</p>
                        )}
                    </div>

                    {/* الصف الدراسي */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">الصف الدراسي</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                name="grade"
                                value={formData.grade}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                placeholder="مثلاً: الصف العاشر"
                            />
                        ) : (
                            <p className="text-lg font-bold text-blue-900 mt-1">{userProfile.grade}</p>
                        )}
                    </div>

                    {/* معلومات ثابتة في وضع التعديل (اختياري) */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">نوع المستخدم</label>
                        <p className="text-lg font-bold text-blue-900 mt-1">{userProfile.userType}</p>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 mb-2 uppercase">الخدمة المطلوبة</label>
                        <p className="text-lg font-bold text-blue-900 mt-1">{userProfile.serviceType}</p>
                    </div>

                    {/* المواد الدراسية */}
                    <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-100">
                        <label className="block text-xs font-black text-gray-400 mb-4 uppercase">المواد التي تهمني</label>
                        
                        {isEditing && (
                            <div className="flex gap-2 mb-4">
                                <input 
                                    type="text" 
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold"
                                    placeholder="أضف مادة جديدة..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubject(e as any)}
                                />
                                <button 
                                    onClick={handleAddSubject}
                                    className="bg-green-500 text-white px-6 rounded-xl font-bold hover:bg-green-600 transition-all"
                                >
                                    إضافة
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mt-2">
                            {(isEditing ? formData.subjects : userProfile.subjects).map(subject => (
                                <div 
                                    key={subject} 
                                    className="bg-green-50 text-green-700 text-sm font-black px-4 py-2 rounded-full border border-green-100 flex items-center gap-2"
                                >
                                    {subject}
                                    {isEditing && (
                                        <button 
                                            onClick={() => handleRemoveSubject(subject)}
                                            className="hover:text-red-500 transition-colors"
                                            title="حذف"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-12 flex gap-4 pt-8 border-t border-gray-100">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-900 text-white font-black py-3 px-10 rounded-xl shadow-lg hover:bg-blue-800 transition-all disabled:bg-gray-300 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    جاري الحفظ...
                                </>
                            ) : "حفظ التعديلات"}
                        </button>
                        <button 
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="bg-gray-100 text-gray-500 font-black py-3 px-10 rounded-xl hover:bg-gray-200 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileView;
