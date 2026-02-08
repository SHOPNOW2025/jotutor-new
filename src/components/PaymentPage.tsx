
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

    // ملاحظة للمطور: SESSION ID يجب توليده من السيرفر. 
    // المعرف أدناه هو المعرف الذي زودتني به في طلبك.
    const PRODUCTION_SESSION_ID = 'SESSION0002009503206N5848500E73';
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        const handleGatewayError = (e: any) => {
            setIsProcessing(false);
            console.error("Gateway Error Details:", e.detail);
            setError("عذراً، تعذر الاتصال ببوابة البنك (قد تكون الجلسة منتهية). يرجى مراجعة الإدارة لتحديث مفتاح الدفع.");
        };

        const handleGatewayCancel = () => {
            setIsProcessing(false);
            setError("تم إلغاء عملية الدفع من قبل المستخدم.");
        };

        window.addEventListener('mpgs-gateway-error', handleGatewayError);
        window.addEventListener('mpgs-gateway-cancel', handleGatewayCancel);
        
        return () => {
            window.removeEventListener('mpgs-gateway-error', handleGatewayError);
            window.removeEventListener('mpgs-gateway-cancel', handleGatewayCancel);
        };
    }, []);

    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
            return;
        }

        // بدء عملية الدفع عبر ماستركارد
        setIsProcessing(true);
        const win = window as any;

        if (win.Checkout) {
            try {
                // ضبط الإعدادات كما في الكود الذي أرفقته تماماً
                win.Checkout.configure({
                    merchant: MERCHANT_ID,
                    session: {
                        id: PRODUCTION_SESSION_ID
                    },
                    order: {
                        amount: (course.priceJod || course.price || 0).toString(),
                        currency: 'JOD',
                        description: `JoTutor - ${course.title}`,
                        id: `INV-${Date.now().toString().slice(-6)}`
                    },
                    interaction: {
                        merchant: {
                            name: 'JoTutor Platform'
                        }
                    }
                });

                // استدعاء صفحة الدفع (Hosted Checkout)
                // هذا هو الأمر الذي يفتح نافذة إدخال بيانات البطاقة
                win.Checkout.showPaymentPage();
                
            } catch (err) {
                console.error("Mastercard Configuration Failed:", err);
                setError("فشل في تهيئة نظام الدفع. يرجى المحاولة لاحقاً.");
                setIsProcessing(false);
            }
        } else {
            setError("نظام الدفع غير متاح حالياً، يرجى التأكد من اتصالك بالإنترنت.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-blue-900 mb-4">{strings.paymentTitle}</h1>
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">
                        بوابة دفع بنكية آمنة (Production)
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ملخص الفاتورة */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="text-xl font-black text-blue-900 mb-6 pb-4 border-b">ملخص الطلب</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-20 h-20 rounded-2xl object-cover" alt={course.title} />
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight mb-1">{course.title}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">{course.category}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                                <span className="text-blue-900 font-black">المبلغ الإجمالي:</span>
                                <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
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
                                    <span className={`font-black text-sm ${paymentMethod === 'cliq' ? 'text-green-700' : 'text-gray-400'}`}>تطبيق كليك</span>
                                </button>
                            </div>

                            <form onSubmit={handleConfirmPayment} className="space-y-6">
                                {paymentMethod === 'visa' ? (
                                    <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center animate-fade-in">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="w-10 h-10 object-contain" />
                                        </div>
                                        <h4 className="font-black text-blue-900 mb-2">الدفع المباشر عبر بوابة البنك</h4>
                                        <p className="text-xs text-gray-500 font-bold leading-relaxed px-4">
                                            سيتم فتح نافذة البنك الرسمية لإدخال بيانات بطاقتك بأمان تام.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-8 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-100 text-center animate-fade-in">
                                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-xl font-black">
                                            Q
                                        </div>
                                        <h4 className="font-black text-blue-900 mb-2">الدفع عبر CliQ</h4>
                                        <p className="text-xs text-blue-700 font-bold leading-relaxed px-4">
                                            قم بالتحويل للاسم المستعار المعتمد للمنصة، ثم أرسل إشعاراً للتفعيل.
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-black border border-red-100 flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>فشل في الاتصال بالبنك</span>
                                        </div>
                                        <p className="text-[10px] opacity-80 leading-normal">{error}</p>
                                        <p className="text-[9px] text-gray-400 mt-1 italic">نصيحة: تأكد أن الـ Session ID في الكود لا يزال صالحاً (لم تنتهِ مدته).</p>
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
                                            جاري فتح بوابة البنك...
                                        </>
                                    ) : (
                                        paymentMethod === 'visa' ? "ادفع الآن بآمان" : "تأكيد وإرسال طلب التفعيل"
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
