import React from 'react';
import { Course, Currency, Language } from '../types';

interface CourseProfilePageProps {
    course: Course;
    onBook: (courseId: string) => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
}

const CourseProfilePage: React.FC<CourseProfilePageProps> = ({ course, onBook, currency, strings }) => {
    if (!course) return <div className="py-20 text-center">Course not found</div>;

    let price = 0;
    let currencySymbol = '';

    if (currency === 'USD') {
        price = course.priceUsd ?? (course.price ? course.price * 1.41 : 0);
        currencySymbol = strings.usd || '$';
    } else if (currency === 'SAR') {
        price = course.priceSar ?? (course.price ? course.price * 5.3 : 0);
        currencySymbol = strings.sar || 'ر.س';
    } else {
        price = course.priceJod ?? course.price ?? 0;
        currencySymbol = strings.jod || 'د.أ';
    }

    const safePrice = (typeof price === 'number' && !isNaN(price)) ? price : 0;
    const displayPrice = safePrice.toFixed(2);

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <img src={course.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'} alt={course.title} className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg mb-8" />
                        <h1 className="text-4xl font-extrabold text-blue-900 mb-4">{course.title}</h1>
                        <p className="text-lg text-gray-500 mb-6">{strings.by || 'بواسطة'} {course.includedSubjects || course.category}</p>
                        <div className="prose lg:prose-lg max-w-none text-gray-700">
                           <p>{course.description}</p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md sticky top-28">
                            <p className="text-4xl font-extrabold text-green-500 mb-6">{currencySymbol}{displayPrice}</p>
                            <button onClick={() => onBook(course.id)} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors text-lg">
                                {strings.bookCourse || 'احجز الآن'}
                            </button>
                            <ul className="mt-8 space-y-3 text-gray-700">
                                <li className="flex justify-between"><strong>{strings.courseTeacher || 'المعلم'}:</strong> <span>{course.teacher}</span></li>
                                <li className="flex justify-between"><strong>{strings.courseDuration || 'المدة'}:</strong> <span>{course.duration}</span></li>
                                <li className="flex justify-between"><strong>{strings.courseLevel || 'المستوى'}:</strong> <span>{course.level}</span></li>
                                <li className="flex justify-between"><strong>{strings.subject || 'المادة'}:</strong> <span>{course.category}</span></li>
                                {course.curriculum && <li className="flex justify-between"><strong>المنهاج:</strong> <span>{course.curriculum}</span></li>}
                                {course.sessionCount && <li className="flex justify-between"><strong>{strings.sessions || 'حصص'}:</strong> <span>{course.sessionCount}</span></li>}
                                {course.totalHours && <li className="flex justify-between"><strong>{strings.hours || 'ساعة'}:</strong> <span>{course.totalHours}</span></li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseProfilePage;