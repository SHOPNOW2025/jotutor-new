
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
        handlePaymentError: (error: any) => void;
        handlePaymentCancel: () => void;
        handlePaymentComplete: (resultIndicator: string, sessionVersion: string) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, strings, onEnroll }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [error, setError] = useState<string | null>(null);

    // معرف التاجر من الصورة
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // ربط الدوال العالمية بـ logic الخاص بـ React
        window.handlePaymentError = (err) => {
            console.error("React received error:", err);
            setError("حدث خطأ في بوابة الدفع. يرجى المحاولة مرة أخرى.");
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
                orderId: `JOT-${Date.now().toString().slice(-6)}`
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
            setError("لم يتم تحميل مكتبة الدفع بعد، يرجى تحديث الصفحة.");
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            // تنفيذ كود التهيئة كما في المثال المزود
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price || 1,
                    currency: 'JOD',
                    description: course.title,
                    id: `ORD-${Date.now()}`
                },
                session: {
                    // ملاحظة: هذا الـ ID هو مثال، في الإنتاج يجب جلبه من السيرفر لكل عملية
                    id: 'SESSION0002009503206N5848500E73' 
                },
                interaction: {
                    merchant: {
                        name: 'JoTutor Platform',
                        address: { line1: 'Jordan, Amman' }
                    }
                }
            });

            // فتح صفحة الدفع فوراً
            window.Checkout.showPaymentPage();

            // فك حالة التحميل بعد فترة بسيطة للسماح بإعادة المحاولة إذا فشل الفتح
            setTimeout(() => setIsInitializing(false), 5000);

        } catch (err) {
            console.error("Config error:", err);
            setError("خطأ في تهيئة بوابة الدفع.");
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
                    <h1 className="text-3xl font-black text-blue-900 mb-2">إتمام الدفع الآمن</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mastercard Production Gateway</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ملخص */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
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
                                    <span className="text-blue-900 font-black">السعر الإجمالي:</span>
                                    <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* البوابة */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
                                <button onClick={() => setPaymentMethod('visa')} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-400'}`}>💳 بطاقة بنكية</button>
                                <button onClick={() => setPaymentMethod('cliq')} className={`flex-1 py-4 rounded-xl font-black text-xs transition-all ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-lg' : 'text-gray-400'}`}>📱 تطبيق CliQ</button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="py-12 text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl shadow-inner">🔒</div>
                                    <h3 className="text-2xl font-black text-blue-900 mb-4">بوابة Mastercard</h3>
                                    <p className="text-gray-500 font-bold max-w-sm mx-auto mb-10 text-sm">سيتم فتح صفحة الدفع الرسمية التابعة لماستركارد لإدخال بيانات بطاقتك بأمان تام.</p>

                                    {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100">⚠️ {error}</div>}

                                    <button 
                                        onClick={handleStartMastercardPayment}
                                        disabled={isInitializing}
                                        className="w-full max-w-sm bg-blue-900 text-white font-black py-5 rounded-2xl shadow-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-4 mx-auto disabled:bg-gray-300"
                                    >
                                        {isInitializing ? "جاري فتح النافذة..." : `دفع ${course.priceJod || course.price} JOD الآن`}
                                    </button>
                                </div>
                            ) : (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع عبر CliQ</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto mb-8">يرجى التحويل للاسم (JOTUTOR) ثم طلب التفعيل.</p>
                                    <button onClick={handleCliQPayment} className="bg-blue-900 text-white font-black py-4 px-12 rounded-2xl">إرسال طلب التفعيل</button>
                                </div>
                            )}

                            <div className="mt-12 pt-8 border-t flex flex-col items-center gap-4 opacity-40">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">تشفير SSL 256-Bit معتمد</p>
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
