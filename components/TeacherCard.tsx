import React from 'react';
// Fix: Corrected import path for types.
import { Teacher, Language } from '../types';

interface TeacherCardProps {
    teacher: Teacher;
    onSelect: (id: string) => void;
    strings: { [key: string]: string };
    language: Language;
    isHomePageVersion?: boolean;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onSelect, strings, language, isHomePageVersion }) => {
    const handleCardClick = () => {
        // On the dedicated teachers page (where there's no button), the whole card is clickable.
        if (!isHomePageVersion) {
            onSelect(teacher.id);
        }
    };

    const containerClasses = "bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300";
    const clickableClasses = !isHomePageVersion ? 'cursor-pointer' : '';

    return (
        <div className={`${containerClasses} ${clickableClasses}`} onClick={handleCardClick}>
            <div className="h-48 w-full overflow-hidden">
                <img src={teacher.avatarUrl} alt={teacher.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{teacher.name}</h3>
                <p className="text-gray-600 mb-4">{teacher.level} ・ {teacher.experience} {strings.yearsExperience}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {teacher.specialties.slice(0, 2).map(spec => (
                        <span key={spec} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{spec}</span>
                    ))}
                </div>
                <div className="flex justify-center items-center mb-4">
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold ml-1">{teacher.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({teacher.reviews})</span>
                    </div>
                </div>
                {isHomePageVersion && (
                    <button onClick={() => onSelect(teacher.id)} className="w-full bg-blue-900 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                        {strings.viewProfile}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TeacherCard;
