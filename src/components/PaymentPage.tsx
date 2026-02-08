
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

    // ملاحظة: يجب جلب SESSION_ID جديد من السيرفر في كل عملية دفع
    const SESSION_ID = 'SESSION0002009503206N5848500E73'; 

    useEffect(() => {
        if (paymentMethod === 'visa' && (window as any).PaymentSession) {
            initPaymentSession();
        }
    }, [paymentMethod]);

    const initPaymentSession = () => {
        const win = window as any;
        win.PaymentSession.configure({
            session: SESSION_ID,
            fields: {
                card: {
                    number: "#card-number",
                    securityCode: "#security-code",
                    expiryMonth: "#expiry-month",
                    expiryYear: "#expiry-year",
                    nameOnCard: "#cardholder-name"
                }
            },
            frameEmbeddingRestriction: "NONE",
            callbacks: {
                initialized: (response: any) => console.log("Session Initialized", response),
                formSessionUpdate: (response: any) => {
                    if (response.status === "ok") {
                        // هنا يتم إرسال معرف الجلسة المحدث للسيرفر الخاص بك لإتمام عملية السحب
                        console.log("Session updated successfully", response.session.id);
                        handleFinalizePayment(response.session.id);
                    } else {
                        setError("تأكد من صحة بيانات البطاقة المدخلة.");
                        setIsProcessing(false);
                    }
                }
            }
        });
    };

    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
            return;
        }

        setIsProcessing(true);
        const win = window as any;
        if (win.PaymentSession) {
            // طلب تحديث الجلسة ببيانات البطاقة التي أدخلها العميل في الحقول
            win.PaymentSession.updateSessionFromForm('card');
        } else {
            setError("حدث خطأ في تحميل نظام الدفع. يرجى تحديث الصفحة.");
            setIsProcessing(false);
        }
    };

    const handleFinalizePayment = (updatedSessionId: string) => {
        // في مشروعك الفعلي، ستقوم هنا بإرسال طلب API للسيرفر لإتمام عملية الدفع (Capture/Authorize)
        // سنحاكي هنا تحويل المستخدم للبنك أو إتمام العملية
        setTimeout(() => {
            onEnroll(course, 'Success', { 
                paymentMethod: 'Credit Card',
                orderId: `ORD-${Date.now()}`,
                transactionId: updatedSessionId
            });
            setIsProcessing(false);
        }, 2000);
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">{strings.paymentTitle}</h1>
                    <div className="flex justify-center items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">بوابة دفع مشفرة وآمنة</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* تفاصيل الفاتورة */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b">ملخص الطلب</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase">{course.category}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-400">السعر:</span>
                                    <span className="text-blue-900">{course.priceJod || course.price} JOD</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">
                                    <span className="text-blue-900 font-black">الإجمالي:</span>
                                    <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="font-black mb-2 flex items-center gap-2">
                                    <span className="text-xl">🛡️</span> حماية مزدوجة
                                </h4>
                                <p className="text-[10px] leading-relaxed opacity-80 font-bold">
                                    نحن لا نقوم بتخزين بيانات بطاقتك. جميع البيانات يتم معالجتها عبر أنظمة بنكية مشفرة متوافقة مع معايير PCI-DSS العالمية.
                                </p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
                        </div>
                    </div>

                    {/* نموذج إدخال البيانات */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-md ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    <span>💳</span> بطاقة بنكية
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-md ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    <span>📱</span> تطبيق كليك
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <form onSubmit={handleConfirmPayment} className="space-y-5 animate-fade-in">
                                    {/* حقل اسم حامل البطاقة */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">اسم حامل البطاقة</label>
                                        <input id="cardholder-name" type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all" placeholder="John Doe" />
                                    </div>

                                    {/* حقل رقم البطاقة (Bank Hosted) */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">رقم البطاقة</label>
                                        <div id="card-number" className="mpgs-field w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus-within:ring-2 focus-within:ring-green-500"></div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {/* الشهر */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">الشهر</label>
                                            <div id="expiry-month" className="mpgs-field w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></div>
                                        </div>
                                        {/* السنة */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">السنة</label>
                                            <div id="expiry-year" className="mpgs-field w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></div>
                                        </div>
                                        {/* كود الأمان */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">CVV</label>
                                            <div id="security-code" className="mpgs-field w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"></div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black border border-red-100 flex items-center gap-2">
                                            <span>⚠️</span> {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 text-lg flex items-center justify-center gap-3 mt-8"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                                جاري التحقق...
                                            </>
                                        ) : (
                                            `دفع ${course.priceJod || course.price} JOD الآن`
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="py-10 text-center animate-fade-in-up">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-inner">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">تفعيل يدوي عبر كليك</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                        قم بتحويل المبلغ للاسم المستعار الخاص بالمنصة، ثم أرسل إشعاراً لفريق الدعم للتفعيل الفوري.
                                    </p>
                                    <button 
                                        onClick={handleConfirmPayment}
                                        className="mt-8 bg-blue-900 text-white font-black py-3 px-10 rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                                    >
                                        إرسال طلب التفعيل
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t flex justify-center gap-6 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
