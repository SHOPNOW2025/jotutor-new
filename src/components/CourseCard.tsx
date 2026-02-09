
import React from 'react';
import { Course, Currency } from '../types';

interface CourseCardProps {
    course: Course;
    onSelect: () => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, currency, strings }) => {
    if (!course) return null;
    const isEn = document.documentElement.lang === 'en';

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
    
    // تحديد الصورة بناءً على اللغة
    const displayImage = (isEn && course.imageUrl_en) ? course.imageUrl_en : course.imageUrl;

    return (
        <div onClick={onSelect} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full flex flex-col">
            <img src={displayImage || 'https://via.placeholder.com/400x225?text=No+Image'} alt={isEn ? course.title_en : course.title} className="w-full h-48 object-cover"/>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {isEn ? (course.category_en || course.category) : course.category}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2 h-14">
                    {isEn ? (course.title_en || course.title) : course.title}
                </h3>
                
                <p className="text-gray-500 text-sm mb-2">
                    <span className="font-semibold">{strings.by || 'بواسطة'}: </span> 
                    {isEn ? (course.includedSubjects_en || course.category_en || course.category) : (course.includedSubjects || course.category)}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {course.sessionCount ? (
                        <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-sm font-bold shadow-sm">
                            {course.sessionCount} {strings.sessions || 'حصص'}
                        </span>
                    ) : null}
                    {course.totalHours ? (
                        <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-sm font-bold shadow-sm">
                            {course.totalHours} {strings.hours || 'ساعة'}
                        </span>
                    ) : null}
                </div>

                <div className="mt-auto flex justify-between items-center border-t pt-3">
                    <span className="text-xl font-bold text-blue-900">{currencySymbol}{displayPrice}</span>
                    <span className="text-sm text-gray-600">{isEn ? (course.duration_en || course.duration) : course.duration}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
