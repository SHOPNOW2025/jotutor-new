
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

// تعريف الأنواع لـ TypeScript للتعامل مع مكتبة ماستركارد الخارجية
declare global {
    interface Window {
        Checkout: any;
        errorCallback: (error: any) => void;
        cancelCallback: () => void;
        completeCallback: (resultIndicator: string, sessionVersion: string) => void;
        restoreFormFields: () => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, strings, onEnroll }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [error, setError] = useState<string | null>(null);

    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // 1. تعريف الدوال العالمية المطلوبة من قبل Mastercard SDK
        window.errorCallback = (error: any) => {
            console.error("Mastercard Gateway Error:", error);
            setError("عذراً، فشل الاتصال ببوابة الدفع. يرجى التأكد من بيانات البطاقة أو المحاولة لاحقاً.");
            setIsInitializing(false);
        };

        window.cancelCallback = () => {
            console.log("User cancelled the payment");
            setError("تم إلغاء عملية الدفع من قبل المستخدم.");
            setIsInitializing(false);
        };

        window.completeCallback = (resultIndicator: string, sessionVersion: string) => {
            console.log("Payment completed successfully:", resultIndicator);
            // عند النجاح نرسل البيانات للحفظ
            onEnroll(course, 'Success', {
                paymentMethod: 'Credit Card',
                transactionId: resultIndicator,
                sessionVersion: sessionVersion,
                orderId: `JOT-${Date.now().toString().slice(-6)}`
            });
            setIsInitializing(false);
        };

        window.restoreFormFields = () => {
            console.log("Restoring form fields after redirect");
        };

        // تنظيف الدوال عند مغادرة الصفحة لمنع تسرب الذاكرة
        return () => {
            // @ts-ignore
            delete window.errorCallback;
            // @ts-ignore
            delete window.cancelCallback;
            // @ts-ignore
            delete window.completeCallback;
        };
    }, [course, onEnroll]);

    const handleStartMastercardPayment = () => {
        if (!window.Checkout) {
            setError("فشل تحميل مكتبة الدفع. يرجى تحديث الصفحة.");
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            // 2. تهيئة بوابة الدفع بناءً على كود Mastercard الرسمي ونظام الإنتاج
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price,
                    currency: 'JOD',
                    description: `Subscription: ${course.title}`,
                    id: `ORD-${Date.now()}`
                },
                session: {
                    // ملاحظة: هذا الـ ID هو مثال، في النظام الحقيقي يجب توليده لكل عملية عبر الـ API
                    id: 'SESSION0002009503206N5848500E73' 
                },
                interaction: {
                    merchant: {
                        name: 'JoTutor Platform',
                        address: { line1: 'Jordan, Amman' }
                    },
                    displayControl: {
                        billingAddress: 'OPTIONAL',
                        customerEmail: 'MANDATORY',
                        orderSummary: 'MANDATORY',
                        shipping: 'HIDE'
                    }
                }
            });

            // 3. فتح صفحة الدفع (Lightbox)
            window.Checkout.showPaymentPage();

            // مؤقت أمان: إذا لم تظهر النافذة خلال 10 ثوانٍ، نعيد الزر لحالته الطبيعية
            setTimeout(() => {
                setIsInitializing(false);
            }, 10000);

        } catch (err) {
            console.error("Initialization error:", err);
            setError("حدث خطأ تقني غير متوقع. يرجى المحاولة مرة أخرى.");
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
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">JoTutor Production Gateway</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b text-lg">ملخص الاشتراك</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 font-black uppercase">{course.category}</p>
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

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 py-4 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-3 ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-lg ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    💳 بطاقة بنكية
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 py-4 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-3 ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-lg ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    📱 تطبيق CliQ
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="py-12 text-center">
                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner animate-pulse">🔒</div>
                                    <h3 className="text-2xl font-black text-blue-900 mb-4">إتمام الدفع بالبطاقة</h3>
                                    <p className="text-gray-500 font-bold max-w-md mx-auto mb-10 leading-relaxed text-sm">
                                        سيتم فتح نافذة منبثقة آمنة ومباشرة مع معالج الدفع العالمي (Mastercard). بيانات بطاقتك لا تمر عبر خوادمنا.
                                    </p>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black border border-red-100">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleStartMastercardPayment}
                                        disabled={isInitializing}
                                        className="w-full max-w-sm bg-blue-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-blue-800 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-4 mx-auto disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        {isInitializing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                جاري فتح البوابة...
                                            </>
                                        ) : (
                                            <>
                                                ادفع الآن {course.priceJod || course.price} JOD
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع المباشر عبر CliQ</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                        حول المبلغ للاسم (JOTUTOR) ثم اضغط أدناه. سيقوم الفريق بتفعيل الدورة يدوياً بعد التحقق.
                                    </p>
                                    <button 
                                        onClick={handleCliQPayment}
                                        className="mt-10 bg-blue-900 text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                                    >
                                        تفعيل عبر تطبيق كليك
                                    </button>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t flex flex-col items-center gap-4">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">تشفير SSL 256-Bit مفعل</p>
                                <div className="flex gap-6 opacity-30 grayscale">
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
