
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

declare global {
    interface Window {
        Checkout: any;
        reactPaymentHandler: (status: string, data?: any) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, strings, onEnroll }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [error, setError] = useState<string | null>(null);

    // معرف التاجر الحقيقي من الصورة
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // جسر التواصل لاستقبال نتائج الدفع من الدوال العالمية في index.html
        window.reactPaymentHandler = (status, data) => {
            if (status === 'error') {
                setError("حدث خطأ أثناء الاتصال بالبنك. يرجى المحاولة مرة أخرى.");
                setIsInitializing(false);
            } else if (status === 'cancel') {
                setError("تم إلغاء عملية الدفع.");
                setIsInitializing(false);
            } else if (status === 'complete') {
                onEnroll(course, 'Success', {
                    paymentMethod: 'Credit Card',
                    transactionId: data.resultIndicator,
                    sessionVersion: data.sessionVersion,
                    orderId: `ORD-${Date.now().toString().slice(-6)}`
                });
                setIsInitializing(false);
            }
        };

        return () => {
            // @ts-ignore
            window.reactPaymentHandler = null;
        };
    }, [course, onEnroll]);

    const handleStartMastercardPayment = () => {
        if (!window.Checkout) {
            setError("عذراً، نظام الدفع غير جاهز حالياً. يرجى تحديث الصفحة.");
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            // تنفيذ الإعدادات كما في الكود الذي زودتني به
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price || 1,
                    currency: 'JOD',
                    description: course.title,
                    id: `JOT-${Date.now()}`
                },
                session: {
                    // ملاحظة: هذا الـ ID هو مثال، في النظام الحقيقي يجب إنتاجه من السيرفر لكل عملية
                    id: 'SESSION0002009503206N5848500E73' 
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

            // فتح صفحة الدفع فوراً
            console.log("Attempting to show payment page...");
            window.Checkout.showPaymentPage();

            // مؤقت أمان: إذا لم تفتح النافذة خلال 10 ثوانٍ، نعيد الزر لحالته
            setTimeout(() => {
                setIsInitializing(false);
            }, 10000);

        } catch (err) {
            console.error("Checkout configuration error:", err);
            setError("حدث خطأ تقني في إعداد بوابة الدفع.");
            setIsInitializing(false);
        }
    };

    const handleCliQPayment = () => {
        onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen animate-fade-in">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">بوابة الدفع الآمنة</h1>
                    <div className="flex justify-center items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastercard Production Gateway</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b">بيانات الاشتراك</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase mt-1">{course.category}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-900 font-black">السعر النهائي:</span>
                                    <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-10 bg-gray-50 p-2 rounded-2xl">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-400'}`}
                                >
                                    💳 بطاقة فيزا / ماستر
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-400'}`}
                                >
                                    📱 تحويل CliQ
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="py-12 text-center">
                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner animate-pulse">🔒</div>
                                    <h3 className="text-2xl font-black text-blue-900 mb-4">دفع آمن بنسبة 100%</h3>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto mb-10 text-sm leading-relaxed">
                                        عند الضغط على الزر أدناه، ستفتح نافذة مشفرة تابعة للبنك لإدخال بيانات بطاقتك بأمان.
                                    </p>

                                    {error && (
                                        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 animate-bounce">
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
                                                تأكيد الدفع {course.priceJod || course.price} JOD
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                            </>
                                        )}
                                    </button>
                                    
                                    <p className="mt-6 text-[10px] text-gray-400 font-bold">في حال عدم ظهور النافذة، يرجى التأكد من السماح بظهور النوافذ المنبثقة (Pop-ups) في متصفحك.</p>
                                </div>
                            ) : (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">تحويل مباشر عبر كليك</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto mb-8">حول المبلغ للاسم (JOTUTOR) من تطبيق بنكك، ثم اضغط تفعيل.</p>
                                    <button onClick={handleCliQPayment} className="bg-blue-900 text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-blue-800 transition-all">تأكيد التحويل وطلب التفعيل</button>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t flex flex-col items-center gap-4 opacity-50">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">تشفير بنكي معتمد SSL</p>
                                <div className="flex gap-8 grayscale">
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
