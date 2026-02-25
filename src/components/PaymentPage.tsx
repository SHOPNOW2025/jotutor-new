
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

const PaymentPage: React.FC<PaymentPageProps> = ({ course, onEnroll }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [gatewayError, setGatewayError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [successIndicator, setSuccessIndicator] = useState<string | null>(null);
    const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
    const [checkoutReady, setCheckoutReady] = useState(false);
    const [sessionData, setSessionData] = useState<{sessionId: string, merchantId: string} | null>(null);
    
    const embedRef = useRef<HTMLDivElement>(null);

    // Handle checkout initialization when state is ready
    useEffect(() => {
        if (showCardForm && sessionData && checkoutReady && !isLoading && !gatewayError) {
            const timer = setTimeout(() => {
                if (window.Checkout && sessionData) {
                    console.log("Initializing Mastercard Checkout with Session:", sessionData.sessionId);
                    try {
                        console.log("Current Origin (Must be whitelisted in Mastercard Portal):", window.location.origin);
                        
                        // Re-add order details since they are no longer in the server-side session creation
                        window.Checkout.configure({
                            session: { id: sessionData.sessionId },
                            order: {
                                amount: (course.priceJod || course.price || 0).toFixed(2),
                                currency: 'JOD',
                                description: course.title,
                                id: currentOrderId
                            }
                        });
                        
                        console.log("Calling showEmbeddedPage...");
                        const target = document.querySelector('#embed-target');
                        if (target) {
                            if (typeof window.Checkout.showEmbeddedPage === 'function') {
                                window.Checkout.showEmbeddedPage('#embed-target');
                            } else {
                                console.warn("showEmbeddedPage not found, falling back to showPaymentPage");
                                window.Checkout.showPaymentPage();
                            }
                        }
                    } catch (e) {
                        console.error("Checkout Configuration Error:", e);
                        setGatewayError("حدث خطأ أثناء تهيئة بوابة الدفع.");
                    }
                } else {
                    console.warn("Mastercard Checkout or Session Data missing when trying to configure.");
                }
            }, 50); // Minimal delay for DOM paint
            return () => clearTimeout(timer);
        }
    }, [showCardForm, sessionData, checkoutReady, isLoading, gatewayError]);

    useEffect(() => {
        window.reactPaymentHandler = async (status, data) => {
            console.log("Gateway Response:", status, data);
            
            if (status === 'complete') {
                setIsLoading(true);
                try {
                    // Step 5: Verify the payment on our server using resultIndicator AND successIndicator
                    const verifyResponse = await fetch(`/api/payment/verify?orderId=${currentOrderId}&resultIndicator=${data?.resultIndicator}&successIndicator=${successIndicator}`);
                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        setPaymentReceipt(verifyData);
                        onEnroll(course, 'Success', {
                            paymentMethod: 'Credit Card',
                            transactionId: verifyData.transactionId || data?.resultIndicator,
                            orderId: currentOrderId,
                            amount: verifyData.amount,
                            currency: verifyData.currency
                        });
                    } else {
                        setGatewayError(verifyData.error || "فشل التحقق من الدفع. يرجى التواصل مع الدعم الفني.");
                    }
                } catch (err) {
                    setGatewayError("حدث خطأ أثناء التحقق من الدفع.");
                } finally {
                    setIsLoading(false);
                }
            } else if (status === 'error') {
                setIsLoading(false);
                setGatewayError("فشلت عملية الدفع البنكية. يرجى التحقق من الرصيد أو بيانات البطاقة.");
            } else if (status === 'cancel') {
                setIsLoading(false);
                setShowCardForm(false);
                setCheckoutReady(false);
                setSessionData(null);
            }
        };

        return () => { 
            // @ts-ignore
            window.reactPaymentHandler = null; 
        };
    }, [course, onEnroll, currentOrderId, successIndicator]);

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
        setCheckoutReady(false);

        if (!window.Checkout) {
            setGatewayError("فشل تحميل مكتبة البنك. يرجى تحديث الصفحة.");
            setIsLoading(false);
            return;
        }

        try {
            const orderId = `JOT-${Date.now().toString().slice(-8)}`;
            setCurrentOrderId(orderId);

            // Step 1: Fetch a fresh session ID and successIndicator from our backend
            const sessionResponse = await fetch('/api/payment/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: course.priceJod || course.price || 0,
                    currency: 'JOD',
                    orderId: orderId
                })
            });
            
            if (!sessionResponse.ok) {
                const errorData = await sessionResponse.json();
                const details = errorData.details ? `: ${JSON.stringify(errorData.details)}` : "";
                throw new Error(`${errorData.error}${details}`);
            }
            
            const { sessionId, merchantId, successIndicator: indicator } = await sessionResponse.json();
            setSuccessIndicator(indicator);
            setSessionData({ sessionId, merchantId });
            
            // Now show the form container
            setShowCardForm(true);
            setCheckoutReady(true);
            setIsLoading(false);
        } catch (err) {
            setGatewayError("حدث خطأ في الاتصال بخوادم Mastercard." + err);
            setIsLoading(false);
        }
    };

    if (paymentReceipt) {
        return (
            <div className="py-12 bg-gray-50 min-h-screen flex items-center justify-center animate-fade-in">
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 max-w-md w-full text-center">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">
                        ✓
                    </div>
                    <h1 className="text-3xl font-black text-blue-900 mb-4 tracking-tighter uppercase">تم الدفع بنجاح</h1>
                    <p className="text-gray-500 font-bold mb-8">لقد تم تفعيل اشتراكك في الدورة بنجاح. يمكنك الآن البدء بالتعلم.</p>
                    
                    <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-right space-y-3 mb-8">
                        <div className="flex justify-between text-xs font-black text-gray-400 uppercase">
                            <span>{paymentReceipt.transactionId}</span>
                            <span>رقم العملية</span>
                        </div>
                        <div className="flex justify-between text-xs font-black text-gray-400 uppercase">
                            <span>{currentOrderId}</span>
                            <span>رقم الطلب</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between text-blue-900 font-black">
                            <span>{paymentReceipt.amount} {paymentReceipt.currency}</span>
                            <span>المبلغ المدفوع</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full py-5 rounded-2xl font-black text-white bg-blue-900 hover:bg-blue-800 shadow-xl transition-all"
                    >
                        الانتقال للوحة التحكم
                    </button>
                </div>
            </div>
        );
    }

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
                                        
                                        {/* Manual trigger buttons as per user request */}
                                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-10">
                                            <button 
                                                onClick={() => window.Checkout.showEmbeddedPage('#embed-target')}
                                                className="flex-1 py-2 bg-blue-900 text-white text-[10px] font-black rounded-lg shadow-lg hover:bg-blue-800 transition-all uppercase tracking-tighter"
                                            >
                                                Pay with Embedded Page
                                            </button>
                                            <button 
                                                onClick={() => window.Checkout.showPaymentPage()}
                                                className="flex-1 py-2 bg-gray-800 text-white text-[10px] font-black rounded-lg shadow-lg hover:bg-gray-700 transition-all uppercase tracking-tighter"
                                            >
                                                Pay with Payment Page
                                            </button>
                                        </div>

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
