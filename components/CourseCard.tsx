import React from 'react';
import { Course, Currency } from '../types';

interface CourseCardProps {
    course: Course;
    onSelect: () => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, currency, exchangeRate, strings }) => {
    // Robust price selection logic with safe fallbacks
    let price = 0;
    let currencySymbol = '';

    // Fix: Updated to use price fields from Course type and handle SAR currency correctly.
    if (currency === 'USD') {
        const basePrice = course.priceUsd ?? (course.price ? course.price * (1/exchangeRate) : 0);
        price = (typeof basePrice === 'number' && !isNaN(basePrice)) ? basePrice : 0;
        currencySymbol = strings.usd || '$';
    } else if (currency === 'SAR') {
        const basePrice = course.priceSar ?? (course.price ? course.price * 5.3 : 0);
        price = (typeof basePrice === 'number' && !isNaN(basePrice)) ? basePrice : 0;
        currencySymbol = strings.sar || 'ر.س';
    } else {
        // Default to JOD
        const basePrice = course.priceJod ?? course.price ?? 0;
        price = (typeof basePrice === 'number' && !isNaN(basePrice)) ? basePrice : 0;
        currencySymbol = strings.jod || 'د.أ';
    }

    const displayPrice = price.toFixed(2);

    return (
        <div onClick={onSelect} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer h-full flex flex-col">
            <img src={course.imageUrl || 'https://via.placeholder.com/400x225?text=No+Image'} alt={course.title} className="w-full h-48 object-cover"/>
            <div className="p-6 flex-1 flex flex-col">
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full w-fit">{course.category}</span>
                <h3 className="text-xl font-bold text-blue-900 mt-3 mb-2 h-14 overflow-hidden">{course.title}</h3>
                <p className="text-gray-500 text-sm mb-4">بواسطة: {course.teacher}</p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t">
                    <span className="text-xl font-bold text-blue-900">{currencySymbol}{displayPrice}</span>
                    <span className="text-sm text-gray-600">{course.duration}</span>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;