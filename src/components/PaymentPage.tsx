
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
        errorCallback: (error: any) => void;
        cancelCallback: () => void;
        completeCallback: (resultIndicator: string, sessionVersion: string) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [error, setError] = useState<string | null>(null);

    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // تعريف معالجات الرد العالمية الخاصة بماستركارد
        window.errorCallback = (error: any) => {
            console.error("Payment Error:", error);
            setError("حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.");
            setIsInitializing(false);
        };

        window.cancelCallback = () => {
            console.log("Payment Cancelled");
            setError("تم إلغاء عملية الدفع.");
            setIsInitializing(false);
        };

        window.completeCallback = (resultIndicator: string, sessionVersion: string) => {
            console.log("Payment Success:", resultIndicator);
            onEnroll(course, 'Success', {
                paymentMethod: 'Credit Card',
                transactionId: resultIndicator,
                sessionVersion: sessionVersion,
                orderId: `JOT-${Date.now().toString().slice(-6)}`
            });
        };
    }, [course, onEnroll]);

    const handleStartMastercardPayment = async () => {
        setIsInitializing(true);
        setError(null);

        try {
            // ملاحظة: في بيئة الإنتاج الحقيقية، يجب توليد sessionId عبر السيرفر الخاص بك (Backend)
            // لضمان عدم تعرض مفتاح الـ API للسرقة. سنقوم هنا بمحاكاة الخطوة أو استخدام جلسة تجريبية إذا توفرت.
            
            // تهيئة إعدادات ماستركارد
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price,
                    currency: 'JOD',
                    description: `JoTutor: ${course.title}`,
                    id: `ORD-${Date.now()}`
                },
                interaction: {
                    merchant: {
                        name: 'JoTutor Platform',
                        address: { line1: 'Amman, Jordan' }
                    },
                    displayControl: {
                        billingAddress: 'OPTIONAL',
                        customerEmail: 'MANDATORY',
                        orderSummary: 'MANDATORY',
                        shipping: 'HIDE'
                    }
                },
                session: {
                    // سيتم استبدال هذا بـ Session ID حقيقي من السيرفر
                    id: 'SESSION0002009503206N5848500E73' 
                }
            });

            // إظهار صفحة الدفع (Lightbox)
            window.Checkout.showPaymentPage();
            
        } catch (err) {
            setError("فشل الاتصال ببوابة الدفع. تأكد من إعدادات المتصفح.");
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
                    <h1 className="text-3xl font-black text-blue-900 mb-2">بوابة الدفع الآمنة</h1>
                    <div className="flex justify-center items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">التشفير مفعل (SSL 256-bit)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b text-lg">ملخص الطلب</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight line-clamp-2">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 font-black uppercase">{course.category}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-blue-900 font-bold text-xs">سعر الدورة:</span>
                                    <span className="font-black text-blue-900">{course.priceJod || course.price} JOD</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-blue-100">
                                    <span className="text-blue-900 font-black">الإجمالي الصافي:</span>
                                    <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-100 text-[10px] text-yellow-800 font-bold">
                                <span>🛡️</span>
                                <span>سيتم توجيهك الآن لبيئة دفع مشفرة بالكامل تابعة لماستركارد العالمية.</span>
                            </div>
                        </div>
                    </div>

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-10 bg-gray-50 p-2 rounded-2xl">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 py-4 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-3 ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-lg ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    <span className="text-lg">💳</span> بطاقة بنكية (فيزا/ماستركارد)
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 py-4 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-3 ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-lg ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    <span className="text-lg">📱</span> تطبيق CliQ المحافظ
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">🔒</div>
                                    <h3 className="text-2xl font-black text-blue-900 mb-4">جاهز لإتمام العملية؟</h3>
                                    <p className="text-gray-500 font-bold max-w-md mx-auto mb-10 leading-relaxed">
                                        عند الضغط على الزر، سيتم فتح نافذة دفع آمنة (Hosted Checkout) لإدخال بيانات بطاقتك. بياناتك مشفرة ولا يتم تخزينها لدينا.
                                    </p>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100">
                                            ⚠️ {error}
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleStartMastercardPayment}
                                        disabled={isInitializing}
                                        className="w-full max-w-sm bg-blue-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-blue-800 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-4 mx-auto disabled:bg-gray-300"
                                    >
                                        {isInitializing ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                جاري التحضير...
                                            </div>
                                        ) : (
                                            <>
                                                دفع {course.priceJod || course.price} JOD الآن
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع المباشر عبر CliQ</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                        حول المبلغ للاسم المستعار (JOTUTOR) ثم اضغط أدناه. سيقوم الفريق بتفعيل الدورة يدوياً بعد التحقق.
                                    </p>
                                    <button 
                                        onClick={handleCliQPayment}
                                        className="mt-10 bg-blue-900 text-white font-black py-4 px-12 rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                                    >
                                        إرسال طلب تفعيل CliQ
                                    </button>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t flex flex-col items-center gap-6">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">البطاقات المقبولة</p>
                                <div className="flex gap-8 opacity-30 grayscale hover:grayscale-0 transition-all">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-8" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-8" />
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
