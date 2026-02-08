
import React, { useState, useEffect } from 'react';
import { Course, Currency, Language } from '../types';

interface PaymentPageProps {
    course: Course;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
    onEnroll: (course: Course, status: 'Success' | 'Pending', details?: { orderId?: string; transactionId?: string; paymentMethod: 'Credit Card' | 'CliQ' }) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    if (!course) return <div className="py-20 text-center font-bold">Course not found</div>;

    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // تفاصيل الدفع (Production)
    const MERCHANT_ID = "9547143225EP";
    const ORDER_ID = `ORD-${Date.now().toString().slice(-8)}`;
    const AMOUNT = (course.priceJod || course.price || 0).toString();

    useEffect(() => {
        const handleError = (e: any) => {
            setIsProcessing(false);
            setError("حدث خطأ في الاتصال بالبنك. يرجى المحاولة مرة أخرى.");
        };
        const handleCancel = () => {
            setIsProcessing(false);
            setError("تم إلغاء عملية الدفع من قبل المستخدم.");
        };

        window.addEventListener('payment-error', handleError);
        window.addEventListener('payment-cancel', handleCancel);
        
        return () => {
            window.removeEventListener('payment-error', handleError);
            window.removeEventListener('payment-cancel', handleCancel);
        };
    }, []);

    const handleStartPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'cliq') {
            // منطق الدفع عبر كليك يظل كما هو (إرسال طلب تفعيل معلق للمسؤول)
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
            return;
        }

        // منطق الدفع بالبطاقة البنكية
        setIsProcessing(true);
        const win = window as any;

        if (win.Checkout) {
            try {
                // ملاحظة: الـ SESSION ID يجب أن يتم إنتاجه من السيرفر الخاص بك (Backend) 
                // لحماية بيانات الـ API Password. هنا نستخدم الهيكل المطلوب للتحويل.
                win.Checkout.configure({
                    session: {
                        id: 'SESSION0002009503206N5848500E73' // مثال لهوية الجلسة، يجب أن تكون ديناميكية في المشروع الفعلي
                    },
                    order: {
                        amount: AMOUNT,
                        currency: 'JOD',
                        description: `Payment for ${course.title}`,
                        id: ORDER_ID
                    },
                    interaction: {
                        merchant: {
                            name: 'JoTutor Platform',
                            address: {
                                line1: 'Amman, Jordan'
                            }
                        },
                        displayControl: {
                            billingAddress: 'HIDE',
                            customerEmail: 'HIDE'
                        }
                    }
                });

                // التحويل لصفحة الدفع الخاصة بالبنك
                win.Checkout.showPaymentPage();
            } catch (err) {
                console.error("MPGS Config Error:", err);
                setError("فشل في تهيئة نظام الدفع. يرجى مراجعة الإدارة.");
                setIsProcessing(false);
            }
        } else {
            setError("جاري تحميل بوابة البنك... يرجى المحاولة خلال لحظات.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-blue-900 mb-4">{strings.paymentTitle}</h1>
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-black">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        بيئة إنتاج آمنة (Mastercard Production)
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-black text-blue-900 mb-6 pb-4 border-b">ملخص الطلب</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-24 h-24 rounded-2xl object-cover shadow-md" alt={course.title} />
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-900 leading-tight mb-2">{course.title}</h3>
                                    <p className="text-xs text-gray-500 font-bold">{course.category}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-bold">معرف الطلب:</span>
                                    <span className="text-blue-900 font-mono font-black">{ORDER_ID}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-dashed">
                                    <span className="text-blue-900 font-black">الإجمالي:</span>
                                    <span className="text-2xl font-black text-green-600">{AMOUNT} JOD</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                جميع المعاملات مشفرة وتتم عبر بوابة البنك مباشرة.
                            </div>
                        </div>
                    </div>

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-7">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="text-xl font-black text-blue-900 mb-8">اختر وسيلة الدفع</h2>
                            
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <span className="text-4xl">💳</span>
                                    <span className={`font-black text-sm ${paymentMethod === 'visa' ? 'text-green-700' : 'text-gray-400'}`}>بطاقة بنكية</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <span className="text-4xl">📱</span>
                                    <span className={`font-black text-sm ${paymentMethod === 'cliq' ? 'text-green-700' : 'text-gray-400'}`}>كليك (CliQ)</span>
                                </button>
                            </div>

                            <form onSubmit={handleStartPayment} className="space-y-6">
                                {paymentMethod === 'visa' ? (
                                    <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center animate-fade-in">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-black text-blue-900 mb-2">الدفع المباشر عبر البنك</h4>
                                        <p className="text-xs text-gray-500 font-bold leading-relaxed px-4">
                                            سيتم فتح بوابة الدفع الآمنة (Hosted Checkout) لإدخال بيانات بطاقتك.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-8 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-100 text-center animate-fade-in">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-xl font-black">
                                            Q
                                        </div>
                                        <h4 className="font-black text-blue-900 mb-2">تفعيل عبر كليك / واتساب</h4>
                                        <p className="text-xs text-blue-700 font-bold leading-relaxed px-4">
                                            قم بتحويل المبلغ للاسم المستعار المعتمد، ثم اطلب التفعيل من المسؤول.
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-black border border-red-100 flex items-center gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98] disabled:bg-gray-300 disabled:shadow-none text-xl flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                            جاري التحويل...
                                        </>
                                    ) : (
                                        paymentMethod === 'visa' ? `دفع ${AMOUNT} JOD بآمان` : "تأكيد طلب التفعيل"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
