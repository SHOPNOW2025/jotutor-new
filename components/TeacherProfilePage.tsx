import React from 'react';
// Fix: Corrected import path for types.
import { Teacher, Language } from '../types';

interface TeacherProfilePageProps {
    teacher: Teacher;
    strings: { [key: string]: string };
    language: Language;
}

const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({ teacher, strings }) => {

    return (
        <div className="py-12 bg-gray-100">
            <div className="container mx-auto px-6">
                <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Avatar and Basic Info */}
                        <div className="md:col-span-1 text-center">
                            <img src={teacher.avatarUrl} alt={teacher.name} className="w-48 h-48 rounded-full mx-auto object-cover border-4 border-green-400" />
                            <h1 className="text-3xl font-bold text-blue-900 mt-6">{teacher.name}</h1>
                            <p className="text-gray-600 mt-2">{teacher.level} ・ {teacher.experience} {strings.yearsExperience}</p>
                            <div className="flex justify-center items-center mt-4">
                                <span className="text-yellow-400 text-2xl">★</span>
                                <span className="font-bold text-xl ml-2">{teacher.rating}</span>
                                <span className="text-gray-500 text-lg ml-1">({teacher.reviews} مراجعة)</span>
                            </div>
                        </div>

                        {/* Right Column: Details */}
                        <div className="md:col-span-2">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-blue-900 border-b-2 border-green-200 pb-2 mb-4">نبذة عني</h2>
                                <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
                            </div>
                             <div className="mb-8">
                                <h2 className="text-2xl font-bold text-blue-900 border-b-2 border-green-200 pb-2 mb-4">التخصصات</h2>
                                <div className="flex flex-wrap gap-3">
                                    {teacher.specialties.map(spec => (
                                        <span key={spec} className="bg-green-100 text-green-800 text-md font-semibold px-4 py-1 rounded-full">{spec}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-blue-900 border-b-2 border-green-200 pb-2 mb-4">المؤهلات والشهادات</h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {teacher.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfilePage;
