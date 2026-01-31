import React from 'react';

interface JoinTeacherPageProps {
  strings: { [key: string]: string };
}

const JoinTeacherPage: React.FC<JoinTeacherPageProps> = ({ strings }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.joinTeacherTitle}</h1>
          <p className="mt-4 text-lg text-gray-600">{strings.joinTeacherDesc}</p>
        </div>
        <div className="bg-gray-50 p-8 rounded-lg shadow-md">
            <form onSubmit={(e) => { e.preventDefault(); alert('Application submitted!'); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder={strings.yourName} className="w-full p-3 border rounded-md" required />
                    <input type="email" placeholder={strings.yourEmail} className="w-full p-3 border rounded-md" required />
                </div>
                 <input type="text" placeholder="التخصص الرئيسي" className="w-full p-3 border rounded-md" required />
                 <textarea placeholder="نبذة عن خبراتك التعليمية" rows={6} className="w-full p-3 border rounded-md" required></textarea>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ارفع سيرتك الذاتية</label>
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"/>
                </div>
                <button type="submit" className="w-full bg-green-500 text-white font-bold text-lg py-3 rounded-md hover:bg-green-600">{strings.applyNow}</button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default JoinTeacherPage;
