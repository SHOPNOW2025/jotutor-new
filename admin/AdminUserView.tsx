import React from 'react';
import { UserProfile } from '../types';

interface AdminUserViewProps {
    user: UserProfile;
    onBack: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | string[] }> = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2 mt-2">
                {value.map(item => (
                    <span key={item} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{item}</span>
                ))}
            </div>
        ) : (
            <p className="text-lg font-semibold text-gray-800 mt-1">{value || '-'}</p>
        )}
    </div>
);


const AdminUserView: React.FC<AdminUserViewProps> = ({ user, onBack }) => {
    return (
        <div>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="text-blue-600 hover:underline">&larr; العودة إلى المستخدمين</button>
                <h1 className="text-3xl font-bold text-gray-800 mr-4">ملف المستخدم: {user.username}</h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <DetailItem label="الاسم الكامل" value={user.username} />
                    <DetailItem label="البريد الإلكتروني" value={user.email} />
                    <DetailItem label="رقم الهاتف" value={user.phone} />
                    <DetailItem label="نوع الحساب" value={user.userType} />
                    <DetailItem label="تاريخ الميلاد" value={user.dob} />
                    <DetailItem label="الخدمة المطلوبة" value={user.serviceType} />
                    <DetailItem label="المرحلة التعليمية" value={user.educationStage} />
                    <DetailItem label="الصف الدراسي" value={user.grade} />
                    <DetailItem label="المنهاج" value={user.curriculum} />
                    <div className="md:col-span-2 lg:col-span-3">
                         <DetailItem label="المواد" value={user.subjects} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserView;