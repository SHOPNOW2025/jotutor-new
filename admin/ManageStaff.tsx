import React, { useState } from 'react';
// Fix: Corrected import path for types.
import { StaffMember, StaffPermission } from '../types';

interface ManageStaffProps {
    staff: StaffMember[];
    setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
}

const permissionOptions: StaffPermission[] = ['Full Control', 'Manage Teachers', 'Manage Users', 'Manage Blog'];

const StaffFormModal: React.FC<{ staffMember: StaffMember | null; onSave: (staffMember: StaffMember) => void; onClose: () => void; }> = ({ staffMember, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: staffMember?.name || '',
        email: staffMember?.email || '',
        permissions: staffMember?.permissions || 'Manage Blog',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalStaffMember: StaffMember = {
            id: staffMember?.id || Date.now().toString(),
            ...formData,
            permissions: formData.permissions as StaffPermission,
        };
        onSave(finalStaffMember);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{staffMember ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h2>
                    <div className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم" className="w-full p-2 border rounded" required />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" className="w-full p-2 border rounded" required />
                        <select name="permissions" value={formData.permissions} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                            {permissionOptions.map(perm => <option key={perm} value={perm}>{perm}</option>)}
                        </select>
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


const ManageStaff: React.FC<ManageStaffProps> = ({ staff, setStaff }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    const handleOpenModal = (staffMember: StaffMember | null) => {
        setEditingStaff(staffMember);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const handleSaveStaff = (staffToSave: StaffMember) => {
        if (staff.some(s => s.id === staffToSave.id)) {
            setStaff(prev => prev.map(s => s.id === staffToSave.id ? staffToSave : s));
        } else {
            setStaff(prev => [staffToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemoveStaff = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الموظف؟')) {
            setStaff(prev => prev.filter(s => s.id !== id));
        }
    };

  return (
    <div>
      {isModalOpen && <StaffFormModal staffMember={editingStaff} onSave={handleSaveStaff} onClose={handleCloseModal} />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الموظفين</h1>
        <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
            إضافة موظف
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-right py-3 px-4 font-semibold text-sm">الاسم</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">البريد الإلكتروني</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">الصلاحيات</th>
                        <th className="text-right py-3 px-4 font-semibold text-sm">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map(member => (
                        <tr key={member.id} className="border-b">
                            <td className="py-3 px-4">{member.name}</td>
                            <td className="py-3 px-4">{member.email}</td>
                            <td className="py-3 px-4">{member.permissions}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                                <button onClick={() => handleOpenModal(member)} className="text-blue-500 hover:underline mr-4">تعديل</button>
                                <button onClick={() => handleRemoveStaff(member.id)} className="text-red-500 hover:underline">حذف</button>
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

export default ManageStaff;
