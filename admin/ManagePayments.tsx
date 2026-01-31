import React, { useState, useMemo } from 'react';
// Fix: Corrected import path for types.
import { Payment } from '../types';

interface ManagePaymentsProps {
    payments: Payment[];
}

const ManagePayments: React.FC<ManagePaymentsProps> = ({ payments }) => {
    const [filter, setFilter] = useState<'All' | 'Success' | 'Failed'>('All');

    const filteredPayments = useMemo(() => {
        if (filter === 'All') {
            return payments;
        }
        return payments.filter(p => p.status === filter);
    }, [payments, filter]);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الدفعات</h1>
                <div className="flex space-x-2 space-x-reverse bg-gray-200 p-1 rounded-lg">
                    {(['All', 'Success', 'Failed'] as const).map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === f ? 'bg-white text-blue-900 shadow' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            {f === 'All' ? 'الكل' : (f === 'Success' ? 'الناجحة' : 'الفاشلة')}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">معرف العملية</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">التاريخ</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">المستخدم</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">الدورة</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">المبلغ</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(payment => (
                                <tr key={payment.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-500">#{payment.id}</td>
                                    <td className="py-3 px-4">{new Date(payment.date).toLocaleString()}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{payment.userName}</td>
                                    <td className="py-3 px-4 text-gray-600">{payment.courseName}</td>
                                    <td className="py-3 px-4 font-semibold">{payment.amount} {payment.currency}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${payment.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {payment.status === 'Success' ? 'ناجحة' : 'فاشلة'}
                                        </span>
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

export default ManagePayments;