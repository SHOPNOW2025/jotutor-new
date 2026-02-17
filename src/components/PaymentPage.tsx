
import React, { useState, useEffect } from 'react';
import { Course, Currency, Language } from '../types';

interface PaymentPageProps {
    course: Course;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
    onEnroll: (course: Course, status: 'Success' | 'Pending', details?: any) => void;
}

// تعريف كائن Checkout عالمياً
declare global {
    interface Window {
        Checkout: any;
        reactPaymentHandler: (status: string, data?: any) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');

    // بيانات التاجر من الصورة
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // جسر التواصل مع الدوال في index.html
        window.reactPaymentHandler = (status, data) => {
            setIsLoading(false);
            if (status === 'error') {
                setError("عذراً، حدث خطأ في الاتصال بالبنك. يرجى المحاولة لاحقاً.");
            } else if (status === 'cancel') {
                setError("تم إلغاء عملية الدفع.");
            } else if (status === 'complete') {
                onEnroll(course, 'Success', {
                    paymentMethod: 'Credit Card',
                    transactionId: data?.resultIndicator || `MC-${Date.now()}`,
                    orderId: `ORD-${Date.now().toString().slice(-6)}`
                });
            }
        };

        return () => {
            // @ts-ignore
            window.reactPaymentHandler = null;
        };
    }, [course, onEnroll]);

    const handleConfirmPayment = () => {
        if (paymentMethod === 'visa') {
            startMastercardCheckout();
        } else {
            handleCliQPayment();
        }
    };

    const startMastercardCheckout = () => {
        if (!window.Checkout) {
            setError("جاري تحميل بوابة الدفع... يرجى الانتظار ثانية.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. تهيئة البوابة باستخدام الكود المطلوب
            window.Checkout.configure({
                merchant: MERCHANT_ID, // إضافة المعرف لضمان الربط
                order: {
                    amount: () => course.priceJod || course.price || 0,
                    currency: 'JOD',
                    description: course.title,
                    id: `JOT-${Date.now().toString().slice(-8)}`
                },
                session: {
                    id: 'SESSION0002009503206N5848500E73' // الـ Session ID الحقيقي المزود منك
                },
                interaction: {
                    merchant: {
                        name: 'JoTutor Platform',
                        address: { line1: 'Amman, Jordan' }
                    },
                    displayControl: {
                        billingAddress: 'HIDE',
                        customerEmail: 'HIDE'
                    }
                }
            });

            // 2. إظهار صفحة الدفع فوراً
            window.Checkout.showPaymentPage();
            
        } catch (err) {
            console.error("Mastercard Error:", err);
            setError("خطأ في تشغيل بوابة الدفع. يرجى مراجعة الإعدادات.");
            setIsLoading(false);
        }
    };

    const handleCliQPayment = () => {
        onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen animate-fade-in">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-blue-900 mb-3">بوابة الدفع الآمنة</h1>
                    <div className="w-20 h-1.5 bg-green-500 mx-auto rounded-full"></div>
                    <p className="mt-4 text-gray-500 font-bold">يرجى إتمام عملية الاشتراك في: <span className="text-blue-900">{course.title}</span></p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ملخص الفاتورة */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-[4rem]"></div>
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b border-gray-50 relative z-10 text-lg">ملخص الاشتراك</h2>
                            
                            <div className="flex gap-4 mb-8">
                                <img src={course.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-white" alt="" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight line-clamp-2">{course.title}</h3>
                                    <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-tighter">{course.category}</p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <span>قيمة الدورة</span>
                                    <span className="text-blue-900">{course.priceJod || course.price} JOD</span>
                                </div>
                                <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                    <span>رسوم الخدمة</span>
                                    <span className="text-green-600">0.00</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-blue-900 font-black text-sm uppercase">المبلغ الإجمالي</span>
                                    <span className="text-3xl font-black text-blue-900">{course.priceJod || course.price} <small className="text-xs">JOD</small></span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900 p-6 rounded-[2.5rem] shadow-xl text-white text-center">
                            <div className="flex justify-center gap-4 opacity-70 mb-4 grayscale brightness-200">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-4" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                            </div>
                            <p className="text-[10px] font-bold text-blue-200 leading-relaxed">
                                جميع المعاملات تتم عبر تشفير 256-bit بمعايير PCI-DSS لضمان أقصى درجات الأمان لبياناتك البنكية.
                            </p>
                        </div>
                    </div>

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-gray-100 min-h-[500px] flex flex-col">
                            <div className="flex gap-4 mb-12">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-8 rounded-[2rem] border-2 transition-all group ${paymentMethod === 'visa' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 hover:border-blue-200'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'visa' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <span className={`font-black text-xs uppercase tracking-widest ${paymentMethod === 'visa' ? 'text-blue-900' : 'text-gray-400'}`}>البطاقة البنكية</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-8 rounded-[2rem] border-2 transition-all group ${paymentMethod === 'cliq' ? 'border-green-600 bg-green-50/30' : 'border-gray-50 hover:border-green-200'}`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'cliq' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-green-100'}`}>
                                        <span className="font-black italic text-lg">Q</span>
                                    </div>
                                    <span className={`font-black text-xs uppercase tracking-widest ${paymentMethod === 'cliq' ? 'text-green-900' : 'text-gray-400'}`}>تحويل كليك</span>
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 animate-fade-in">
                                    <div className="max-w-md w-full">
                                        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-black text-blue-900 mb-4 tracking-tight">نظام الدفع Mastercard Gateway</h3>
                                        <p className="text-gray-500 font-bold leading-relaxed mb-10 text-sm">
                                            عند الضغط على الزر، ستفتح نافذة البنك الآمنة لإتمام العملية. لا نقوم بتخزين أي معلومات تتعلق ببطاقتك في سيرفراتنا.
                                        </p>

                                        {error && (
                                            <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-3xl text-xs font-black border border-red-100 flex items-center gap-3 justify-center animate-bounce">
                                                <span>⚠️ {error}</span>
                                            </div>
                                        )}

                                        <button 
                                            onClick={handleConfirmPayment}
                                            disabled={isLoading}
                                            className="w-full bg-blue-900 text-white font-black py-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,33,70,0.25)] hover:bg-blue-800 transition-all flex items-center justify-center gap-4 disabled:bg-gray-300 transform active:scale-95 text-lg"
                                        >
                                            {isLoading ? (
                                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    تأكيد الدفع والاشتراك
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 animate-fade-in">
                                     <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner text-3xl font-black mb-6">Q</div>
                                     <h3 className="text-2xl font-black text-blue-900 mb-6">الدفع السريع عبر تطبيق بنكك</h3>
                                     <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 inline-block text-right mb-8">
                                         <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">بيانات التحويل</p>
                                         <div className="space-y-2">
                                             <p className="text-lg font-black text-blue-900">الاسم المستعار: <span className="text-green-600 select-all">JOTUTOR</span></p>
                                             <p className="text-xs font-bold text-gray-500">البنك المستلم: البنك العربي (Arab Bank)</p>
                                         </div>
                                     </div>
                                     <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed">بعد إرسال المبلغ من تطبيقك البنكي، اضغط على زر التفعيل وسيقوم فريقنا بمراجعة العملية وتفعيل الدورة لك في أسرع وقت.</p>
                                     <button 
                                        onClick={handleConfirmPayment}
                                        className="w-full max-w-sm bg-green-600 text-white font-black py-5 rounded-[2rem] shadow-xl hover:bg-green-700 transition-all transform active:scale-95 text-lg"
                                     >
                                         تم التحويل، فعّل دورتي
                                     </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
