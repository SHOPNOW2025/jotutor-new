import React from 'react';
import { Course, Currency, Language } from '../types';

interface PaymentPageProps {
    course: Course;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
    onEnroll: (course: Course) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, exchangeRate, strings, onEnroll }) => {
    if (!course) return <div className="py-20 text-center">Course not found</div>;

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
        const basePrice = course.priceJod ?? course.price ?? 0;
        price = (typeof basePrice === 'number' && !isNaN(basePrice)) ? basePrice : 0;
        currencySymbol = strings.jod || 'د.أ';
    }

    const displayPrice = price.toFixed(2);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        onEnroll(course);
    };

    return (
        <div className="py-20 bg-gray-100">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">{strings.paymentTitle}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Course Summary */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{strings.courseSummary}</h2>
                        <img src={course.imageUrl || 'https://via.placeholder.com/400x225?text=No+Image'} alt={course.title} className="rounded-md mb-4" />
                        <h3 className="font-bold text-lg">{course.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{strings.by} {course.teacher}</p>
                        <div className="border-t pt-4 flex justify-between items-center">
                            <span className="font-semibold">{strings.totalAmount}</span>
                            <span className="text-2xl font-bold text-green-500">{currencySymbol}{displayPrice}</span>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{strings.paymentMethod}</h2>
                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">{strings.cardHolder}</label>
                                <input type="text" className="w-full p-2 border rounded mt-1" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">{strings.cardNumber}</label>
                                <input type="text" placeholder="•••• •••• •••• ••••" className="w-full p-2 border rounded mt-1" required />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">{strings.expiryDate}</label>
                                    <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded mt-1" required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium">{strings.cvv}</label>
                                    <input type="text" placeholder="•••" className="w-full p-2 border rounded mt-1" required />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 mt-4">
                                {strings.confirmPayment}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;