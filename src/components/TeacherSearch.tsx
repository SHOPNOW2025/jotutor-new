import React, { useState } from 'react';
import { Teacher, Language, HomepageContent } from '../types';
import TeacherCard from './TeacherCard';

interface TeacherSearchProps {
    teachers: Teacher[];
    subjects: string[];
    onSelectTeacher: (id: string) => void;
    isHomePageVersion?: boolean;
    content: HomepageContent;
    strings: { [key: string]: string };
    language: Language;
}

const TeacherSearch: React.FC<TeacherSearchProps> = ({ teachers, subjects, onSelectTeacher, isHomePageVersion, content, strings, language }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('الكل');

    const filteredTeachers = teachers.filter(teacher => {
        const nameMatch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase());
        const subjectMatch = selectedSubject === 'الكل' || teacher.specialties.includes(selectedSubject);
        return nameMatch && subjectMatch;
    });

    const teachersToShow = isHomePageVersion ? filteredTeachers.slice(0, 4) : filteredTeachers;

    return (
        <section id="teachers" className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-blue-900">{content?.teacherSearchTitle || strings.teacherSearchTitle}</h2>
                    <p className="mt-4 text-lg text-gray-600">{content?.teacherSearchSubtitle || strings.teacherSearchSubtitle}</p>
                </div>

                {!isHomePageVersion && (
                     <div className="max-w-3xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-md">
                        <input
                            type="text"
                            placeholder={strings.searchByName}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                        <select
                            value={selectedSubject}
                            onChange={e => setSelectedSubject(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="الكل">{strings.allSubjects}</option>
                            {subjects.map(subject => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                )}
               
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teachersToShow.map(teacher => (
                        <TeacherCard key={teacher.id} teacher={teacher} onSelect={onSelectTeacher} strings={strings} language={language} isHomePageVersion={isHomePageVersion} />
                    ))}
                </div>

                {isHomePageVersion && (
                     <div className="text-center mt-12">
                        <button onClick={() => alert('Navigate to all teachers page!')} className="bg-green-500 text-white font-bold text-lg py-3 px-8 rounded-full hover:bg-green-600 transition-transform duration-300 transform hover:scale-105 shadow-xl">
                            {content?.discoverMoreTeachers || strings.discoverMoreTeachers}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TeacherSearch;
