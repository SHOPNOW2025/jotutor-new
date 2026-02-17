
import React, { useState, useEffect, useRef } from 'react';
import { Course, Currency, Language, SiteContent } from '../types';

interface PaymentPageProps {
    course: Course;
    siteContent: SiteContent;
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

const PaymentPage: React.FC<PaymentPageProps> = ({ course, siteContent, currency, strings, onEnroll }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [gatewayError, setGatewayError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    
    const MERCHANT_ID = "9547143225EP";
    const embedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.reactPaymentHandler = (status, data) => {
            console.log("Gateway Response:", status, data);
            setIsLoading(false);
            
            if (status === 'complete') {
                onEnroll(course, 'Success', {
                    paymentMethod: 'Credit Card',
                    transactionId: data?.resultIndicator,
                    orderId: data?.orderId
                });
            } else if (status === 'error') {
                setGatewayError("فشلت عملية الدفع البنكية. يرجى التحقق من الرصيد أو بيانات البطاقة.");
            } else if (status === 'cancel') {
                setShowCardForm(false);
            }
        };

        return () => { 
            // @ts-ignore
            window.reactPaymentHandler = null; 
        };
    }, [course, onEnroll]);

    const handleConfirmPayment = () => {
        if (paymentMethod === 'visa') {
            initiateRealPayment();
        } else {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
        }
    };

    const initiateRealPayment = async () => {
        setIsLoading(true);
        setGatewayError(null);
        setShowCardForm(true);

        if (!window.Checkout) {
            setGatewayError("فشل تحميل مكتبة البنك. يرجى تحديث الصفحة.");
            setIsLoading(false);
            return;
        }

        try {
            // سحب الجلسة من الأدمن (Firestore)
            const sessionId = siteContent.mastercardSessionId;

            if (!sessionId) {
                setGatewayError("بوابة الدفع غير مهيأة حالياً. يرجى التواصل مع الإدارة.");
                setIsLoading(false);
                return;
            }

            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price || 0,
                    currency: 'JOD',
                    description: course.title,
                    id: `JOT-${Date.now().toString().slice(-8)}`
                },
                session: { id: sessionId },
                interaction: {
                    merchant: { name: 'JoTutor Platform' },
                    displayControl: { billingAddress: 'HIDE', customerEmail: 'HIDE' }
                }
            });

            window.Checkout.showEmbeddedPage('#embed-target');
            
            setTimeout(() => {
                if (embedRef.current && embedRef.current.innerHTML.trim().length < 10) {
                    setGatewayError("جلسة الدفع الحالية منتهية (Expired Session). يرجى العودة والمحاولة مرة أخرى بعد أن يقوم المسؤول بتحديث الجلسة.");
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                }
            }, 4000);

        } catch (err) {
            setGatewayError("حدث خطأ في الاتصال بخوادم Mastercard.");
            setIsLoading(false);
        }
    };

    return (
        <div className="py-12 bg-gray-50 min-h-screen animate-fade-in">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-blue-900 mb-2 tracking-tighter uppercase">بوابة الدفع البنكية</h1>
                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        نظام دفع فعلي مشفر
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full opacity-50"></div>
                            <h2 className="font-black text-blue-900 mb-6 text-sm uppercase tracking-widest border-b pb-4">فاتورة الاشتراك</h2>
                            <div className="flex gap-4 mb-8 relative z-10">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" alt="" />
                                <div className="flex flex-col justify-center">
                                    <h3 className="font-black text-blue-900 text-sm leading-tight line-clamp-2">{course.title}</h3>
                                    <span className="text-[10px] font-black text-green-600 mt-1 uppercase tracking-tighter">{course.category}</span>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 text-center">
                                <p className="text-[10px] font-black text-blue-400 mb-1 uppercase">المبلغ المستحق للدفع</p>
                                <div className="text-4xl font-black text-blue-900">
                                    {course.priceJod || course.price} <small className="text-xs font-bold">JOD</small>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-6 opacity-30 px-6 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-gray-100 min-h-[500px] flex flex-col">
                            {!showCardForm ? (
                                <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-6">
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
                                        <button 
                                            onClick={() => setPaymentMethod('visa')}
                                            className={`flex flex-col items-center gap-3 p-8 rounded-[2.5rem] border-2 transition-all ${paymentMethod === 'visa' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 bg-gray-50/20'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${paymentMethod === 'visa' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-white text-gray-400 border shadow-sm'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            </div>
                                            <span className={`font-black text-[10px] uppercase tracking-widest ${paymentMethod === 'visa' ? 'text-blue-900' : 'text-gray-400'}`}>البطاقة البنكية</span>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('cliq')}
                                            className={`flex flex-col items-center gap-3 p-8 rounded-[2.5rem] border-2 transition-all ${paymentMethod === 'cliq' ? 'border-green-600 bg-green-50/30' : 'border-gray-50 bg-gray-50/20'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${paymentMethod === 'cliq' ? 'bg-green-600 text-white shadow-xl scale-110' : 'bg-white text-gray-400 border shadow-sm'}`}>
                                                <span className="font-black text-xl italic">Q</span>
                                            </div>
                                            <span className={`font-black text-[10px] uppercase tracking-widest ${paymentMethod === 'cliq' ? 'text-green-900' : 'text-gray-400'}`}>تحويل CliQ</span>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handleConfirmPayment}
                                        disabled={isLoading}
                                        className="w-full max-w-sm py-5 rounded-2xl font-black text-white bg-blue-900 hover:bg-blue-800 shadow-[0_15px_30px_rgba(0,33,70,0.2)] transition-all transform active:scale-95 text-lg flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "بدء الاتصال بالبنك"}
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-8">
                                        <button onClick={() => setShowCardForm(false)} className="text-blue-600 font-black text-xs flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-full transition-all">
                                            &larr; رجوع
                                        </button>
                                        <div className="bg-gray-100 text-[9px] font-black text-gray-500 px-4 py-1.5 rounded-full border uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                            Real-Time Payment Terminal
                                        </div>
                                    </div>
                                    <div className="relative flex-1 min-h-[350px] border-2 border-gray-100 rounded-[2.5rem] bg-gray-50/50 p-1 flex flex-col overflow-hidden shadow-inner">
                                        <div id="embed-target" ref={embedRef} className="w-full h-full min-h-[350px]"></div>
                                        {isLoading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-20">
                                                <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                                                <p className="text-sm font-black text-blue-900">جاري الاتصال الآمن بالمصرف...</p>
                                            </div>
                                        )}
                                        {gatewayError && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-8 text-center z-30">
                                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 text-3xl">⚠️</div>
                                                <h4 className="text-red-600 font-black mb-2 text-lg">خطأ في الجلسة</h4>
                                                <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6">{gatewayError}</p>
                                                <button onClick={() => setShowCardForm(false)} className="bg-blue-900 text-white font-black px-8 py-3 rounded-xl shadow-lg">العودة للمحاولة</button>
                                            </div>
                                        )}
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
