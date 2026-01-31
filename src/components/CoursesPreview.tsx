
import React from 'react';
import { Course, Currency, Page, HomepageContent } from '../types';
import CourseCard from './CourseCard';

interface CoursesPreviewProps {
    courses: Course[];
    onSelectCourse: (id: string) => void;
    onNavigate: (page: Page) => void;
    currency: Currency;
    exchangeRate: number;
    content: HomepageContent;
    strings: { [key: string]: string };
}

const CoursesPreview: React.FC<CoursesPreviewProps> = ({ courses, onSelectCourse, onNavigate, currency, exchangeRate, content, strings }) => {
    // Filter strictly for courses marked as 'isFeatured'.
    // If no courses are featured, we can either show nothing or fallback to the first 4.
    // Let's fallback to the most recent 4 (assumed to be at the top of the list) if nothing is featured, 
    // to ensure the section isn't empty for new installs.
    const featuredCourses = courses.filter(c => c.isFeatured);
    
    const coursesToShow = featuredCourses.length > 0 
        ? featuredCourses.slice(0, 4) 
        : courses.slice(0, 4);

    return (
        <section id="courses-preview" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-blue-900">{content?.coursesPreviewTitle || strings.coursesPreviewTitle}</h2>
                    <p className="mt-4 text-lg text-gray-600">{content?.coursesPreviewSubtitle || strings.coursesPreviewSubtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coursesToShow.map(course => (
                         <CourseCard 
                            key={course.id} 
                            course={course} 
                            onSelect={() => onSelectCourse(course.id)} 
                            currency={currency} 
                            exchangeRate={exchangeRate} 
                            strings={strings} 
                        />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <button onClick={() => onNavigate('courses')} className="bg-green-500 text-white font-bold text-lg py-3 px-8 rounded-full hover:bg-green-600 transition-transform duration-300 transform hover:scale-105 shadow-xl">
                        {content?.discoverMoreCourses || strings.discoverMoreCourses}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CoursesPreview;
