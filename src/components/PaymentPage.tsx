
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

// تعريف نافذة Window لـ TypeScript للوصول لـ Checkout
declare global {
    interface Window {
        Checkout: any;
        handlePaymentError: (error: any) => void;
        handlePaymentCancel: () => void;
        handlePaymentComplete: (resultIndicator: string, sessionVersion: string) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, strings, onEnroll }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [error, setError] = useState<string | null>(null);

    // معلومات التاجر من الصورة المزودة
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // ربط الدوال العالمية التي تم تعريفها في index.html بـ logic الخاص بـ React
        window.handlePaymentError = (err) => {
            console.error("Payment failed:", err);
            setError("فشل الاتصال ببوابة الدفع. يرجى التحقق من بياناتك.");
            setIsInitializing(false);
        };

        window.handlePaymentCancel = () => {
            setError("تم إلغاء عملية الدفع.");
            setIsInitializing(false);
        };

        window.handlePaymentComplete = (resultIndicator, sessionVersion) => {
            onEnroll(course, 'Success', {
                paymentMethod: 'Credit Card',
                transactionId: resultIndicator,
                sessionVersion: sessionVersion,
                orderId: `ORD-${Date.now().toString().slice(-6)}`
            });
            setIsInitializing(false);
        };

        return () => {
            // @ts-ignore
            window.handlePaymentError = null;
            // @ts-ignore
            window.handlePaymentCancel = null;
            // @ts-ignore
            window.handlePaymentComplete = null;
        };
    }, [course, onEnroll]);

    const handleStartMastercardPayment = () => {
        if (!window.Checkout) {
            setError("عذراً، لم يتم تحميل مكتبة الدفع البنكية بشكل صحيح. يرجى تحديث الصفحة.");
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            // 1. تهيئة الجلسة بناءً على الكود الذي زودتني به
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                session: {
                    // ملاحظة: في بيئة الإنتاج يجب أن يأتي هذا الـ ID من السيرفر لكل عملية فريدة
                    id: 'SESSION0002009503206N5848500E73' 
                },
                order: {
                    amount: () => course.priceJod || course.price,
                    currency: 'JOD',
                    description: `Subscription: ${course.title}`,
                    id: `JOT-${Date.now()}`
                },
                interaction: {
                    merchant: {
                        name: 'JoTutor Platform',
                        address: { line1: 'Amman, Jordan' }
                    }
                }
            });

            // 2. فتح صفحة الدفع (Lightbox) فوراً
            // هذه هي الخطوة التي تفتح نافذة إدخال بيانات البطاقة
            window.Checkout.showPaymentPage();

            // فك حالة التحميل بعد 8 ثوانٍ للسماح للمستخدم بالمحاولة مجدداً إذا لم تظهر النافذة (مثلاً بسبب Pop-up blocker)
            setTimeout(() => {
                setIsInitializing(false);
            }, 8000);

        } catch (err) {
            console.error("Config execution error:", err);
            setError("حدث خطأ تقني في تهيئة البوابة.");
            setIsInitializing(false);
        }
    };

    const handleCliQPayment = () => {
        onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">الدفع الآمن</h1>
                    <div className="flex justify-center items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Production Ready Gateway</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* الجانب الأيمن: ملخص الدورة */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b">ملخص الدورة</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{course.category}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-900 font-black">الإجمالي:</span>
                                    <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* الجانب الأيسر: خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 min-h-[450px]">
                            <div className="flex gap-4 mb-10 bg-gray-50 p-2 rounded-2xl">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-400'}`}
                                >
                                    💳 بطاقة بنكية
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-400'}`}
                                >
                                    📱 تطبيق كليك (CliQ)
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="py-12 text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner animate-pulse">🔒</div>
                                    <h3 className="text-2xl font-black text-blue-900 mb-4">بوابة ماستركارد العالمية</h3>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                                        سيتم فتح نافذة دفع آمنة مشفرة لإدخال بيانات بطاقتك. جو توتر لا تخزن أي معلومات بنكية.
                                    </p>

                                    {error && (
                                        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleStartMastercardPayment}
                                        disabled={isInitializing}
                                        className="w-full max-w-sm bg-blue-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-4 mx-auto disabled:bg-gray-300"
                                    >
                                        {isInitializing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                جاري فتح نافذة البنك...
                                            </>
                                        ) : (
                                            <>
                                                ادفع {course.priceJod || course.price} JOD الآن
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع المباشر (CliQ)</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto mb-8">يرجى التحويل للاسم المستعار (JOTUTOR) ثم الضغط على الزر أدناه ليتم تفعيل الدورة من قبل الإدارة.</p>
                                    <button 
                                        onClick={handleCliQPayment}
                                        className="bg-blue-900 text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                                    >
                                        أتممت التحويل، اطلب التفعيل
                                    </button>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t flex flex-col items-center gap-4 opacity-40">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">تشفير SSL 256-Bit معتمد من المصرف</p>
                                <div className="flex gap-6">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
