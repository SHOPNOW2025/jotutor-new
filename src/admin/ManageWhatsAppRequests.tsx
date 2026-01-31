
import React, { useMemo } from 'react';
import { Payment } from '../types';

interface ManageWhatsAppRequestsProps {
    payments: Payment[];
    onActivate: (paymentId: string) => Promise<void>;
}

const ManageWhatsAppRequests: React.FC<ManageWhatsAppRequestsProps> = ({ payments, onActivate }) => {
    
    // Filter only Pending payments and sort by date (newest first)
    const pendingRequests = useMemo(() => {
        return payments
            .filter(p => p.status === 'Pending')
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [payments]);

    const handleActivateClick = (paymentId: string, userName: string) => {
        if (window.confirm(`هل أنت متأكد من تفعيل الدورة للطالب ${userName}؟\nسيتم إضافة الدورة إلى ملف الطالب فوراً.`)) {
            onActivate(paymentId);
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">الدورات عبر واتساب</h1>
                    <p className="text-gray-500 mt-1">قائمة الطلاب الذين ينتظرون تفعيل دوراتهم بعد الدفع اليدوي (كليك).</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 text-blue-800 font-semibold">
                    عدد الطلبات المعلقة: {pendingRequests.length}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                {pendingRequests.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>لا يوجد طلبات معلقة حالياً.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">اسم الطالب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">اسم الدورة</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">تاريخ الطلب</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">المبلغ</th>
                                    <th className="text-right py-3 px-4 font-semibold text-sm">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map(req => (
                                    <tr key={req.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-800">{req.userName}</td>
                                        <td className="py-3 px-4 text-gray-600">{req.courseName}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{new Date(req.date).toLocaleString()}</td>
                                        <td className="py-3 px-4 font-bold text-blue-900">{req.amount} {req.currency}</td>
                                        <td className="py-3 px-4">
                                            <button 
                                                onClick={() => handleActivateClick(req.id, req.userName)}
                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors text-sm flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                تفعيل الدورة
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageWhatsAppRequests;
