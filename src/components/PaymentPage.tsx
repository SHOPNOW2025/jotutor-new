
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

// تعريف كائن Checkout العالمي الخاص بـ Mastercard
declare global {
    interface Window {
        Checkout: any;
        reactPaymentHandler: (status: string, data?: any) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');

    // بيانات التاجر الحقيقية من الصورة
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // جسر التواصل لمعالجة استجابات البوابة
        window.reactPaymentHandler = (status, data) => {
            setIsLoading(false);
            if (status === 'error') {
                setError("عذراً، فشلت عملية الدفع. يرجى التأكد من بيانات البطاقة أو الرصيد.");
            } else if (status === 'cancel') {
                setError("تم إلغاء العملية.");
                setShowCardForm(false);
            } else if (status === 'complete') {
                onEnroll(course, 'Success', {
                    paymentMethod: 'Credit Card',
                    transactionId: data?.resultIndicator,
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
            startMastercardEmbeddedCheckout();
        } else {
            handleCliQPayment();
        }
    };

    const startMastercardEmbeddedCheckout = () => {
        if (!window.Checkout) {
            setError("جاري تحميل بوابة الدفع الآمنة... يرجى الانتظار ثوانٍ.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setShowCardForm(true);

        try {
            // 1. تهيئة البوابة (Configuration)
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price || 0,
                    currency: 'JOD',
                    description: course.title,
                    id: `JOT-${Date.now().toString().slice(-8)}`
                },
                session: {
                    id: 'SESSION0002009503206N5848500E73' // الـ Session ID الحقيقي
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

            // 2. حقن نموذج إدخال البطاقة داخل الحاوية المحددة في الصفحة
            // سيقوم هذا الكود بإظهار حقول (رقم البطاقة، التاريخ، CVV) داخل الـ div#embed-target
            window.Checkout.showEmbeddedPage('#embed-target');
            
            setIsLoading(false);
        } catch (err) {
            console.error("Mastercard Embedded Error:", err);
            setError("حدث خطأ أثناء تشغيل نموذج الدفع. يرجى المحاولة مرة أخرى.");
            setIsLoading(false);
            setShowCardForm(false);
        }
    };

    const handleCliQPayment = () => {
        onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen animate-fade-in">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-blue-900 mb-3 uppercase tracking-tighter">بوابة الدفع الآمنة</h1>
                    <p className="text-gray-500 font-bold">أنت على وشك الاشتراك في: <span className="text-green-600">{course.title}</span></p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* الفاتورة الجانبية */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b border-gray-50 text-lg uppercase tracking-widest">تفاصيل الدفع</h2>
                            <div className="flex gap-4 mb-8">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight">{course.title}</h3>
                                    <p className="text-[10px] text-green-600 font-black mt-1 uppercase tracking-tighter">{course.category}</p>
                                </div>
                            </div>
                            <div className="space-y-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-900 font-black text-sm uppercase">المبلغ الإجمالي</span>
                                    <span className="text-3xl font-black text-blue-900">{course.priceJod || course.price} <small className="text-xs">JOD</small></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 opacity-40 grayscale px-6">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/PCI_DSS_logo.svg" alt="PCI" className="h-4 self-center" />
                        </div>
                    </div>

                    {/* منطقة الدفع الرئيسية */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-gray-100 min-h-[450px]">
                            
                            {!showCardForm ? (
                                <div className="animate-fade-in">
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
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'cliq' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100'}`}>
                                                <span className="font-black italic text-lg">Q</span>
                                            </div>
                                            <span className={`font-black text-xs uppercase tracking-widest ${paymentMethod === 'cliq' ? 'text-green-900' : 'text-gray-400'}`}>تحويل كليك</span>
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <p className="text-gray-500 font-bold mb-8 leading-relaxed max-w-md mx-auto">
                                            {paymentMethod === 'visa' 
                                              ? "سيتم عرض نموذج إدخال بيانات البطاقة (الرقم، التاريخ، CVV) بشكل آمن مباشرة في الخطوة التالية."
                                              : "قم بالتحويل عبر تطبيق البنك الخاص بك إلى الاسم المستعار JOTUTOR ثم اضغط تأكيد."}
                                        </p>

                                        {error && (
                                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 animate-bounce">
                                                ⚠️ {error}
                                            </div>
                                        )}

                                        <button 
                                            onClick={handleConfirmPayment}
                                            disabled={isLoading}
                                            className={`w-full max-w-sm py-5 rounded-2xl font-black text-white shadow-xl transition-all transform active:scale-95 text-lg ${paymentMethod === 'visa' ? 'bg-blue-900 hover:bg-blue-800 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}
                                        >
                                            {isLoading ? (
                                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            ) : (
                                                paymentMethod === 'visa' ? "بدء إدخال بيانات البطاقة" : "أتممت التحويل، فعّل دورتي"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-8">
                                        <button 
                                            onClick={() => setShowCardForm(false)}
                                            className="text-blue-600 font-bold text-xs flex items-center gap-2 hover:underline"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                            العودة لتغيير الوسيلة
                                        </button>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border">Secure Embedded Terminal</div>
                                    </div>

                                    {/* هذا هو المكان الذي سيظهر فيه رقم البطاقة وتفاصيلها */}
                                    <div id="embed-target" className="min-h-[300px] border-2 border-dashed border-gray-100 rounded-[2rem] p-4 flex flex-col items-center justify-center bg-gray-50/30">
                                        {isLoading && (
                                            <div className="text-center space-y-4">
                                                <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                <p className="text-sm font-bold text-blue-900">جاري تحميل واجهة البنك الآمنة...</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <p className="text-[11px] text-blue-800 font-bold leading-relaxed">
                                            تتم معالجة بياناتك مباشرة عبر خوادم ماستركارد المشفرة. موقع جوتوتر لا يطلع ولا يقوم بتخزين أي معلومات من بطاقتك الائتمانية.
                                        </p>
                                    </div>
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
