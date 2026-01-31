import React from 'react';

const AIAssistantView: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">المساعد الذكي</h1>
      <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px] flex flex-col">
        <div className="flex-grow mb-4 p-4 bg-gray-50 rounded-md overflow-y-auto">
            {/* Chat history would go here */}
            <div className="text-center text-gray-500 py-16">
                <p>مرحباً! أنا مساعدك الذكي.</p>
                <p>كيف يمكنني مساعدتك اليوم في واجباتك؟</p>
            </div>
        </div>
        <div className="flex">
            <input 
                type="text" 
                placeholder="اسأل عن أي شيء..." 
                className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-green-500 focus:border-green-500"
            />
            <button className="bg-blue-900 text-white font-bold py-3 px-6 rounded-r-md hover:bg-blue-800">
                إرسال
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantView;
