
import React from 'react';

const WalletView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">المحفظة</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center bg-green-50 p-6 rounded-lg">
            <div>
                <p className="text-sm font-medium text-gray-500">الرصيد الحالي</p>
                <p className="text-3xl font-bold text-green-600">0.00 د.أ</p>
            </div>
            <button className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600">
                إضافة رصيد
            </button>
        </div>
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700">سجل المعاملات</h2>
            <div className="mt-4 border-t pt-4">
                <p className="text-gray-500 text-center py-8">لا يوجد معاملات لعرضها.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
