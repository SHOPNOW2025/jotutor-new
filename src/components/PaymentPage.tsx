
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
    const [isGatewayReady, setIsGatewayReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ملاحظة هامة: الـ Session ID يجب أن يتم توليده في كل عملية دفع جديدة من خلال الـ Backend 
    // المعرف أدناه هو مثال صالح للتجربة. في حال انتهى، يجب توليد واحد جديد عبر طلب API للسيرفر.
    const [sessionId, setSessionId] = useState<string>('SESSION0002443225EP730000000000'); 

    useEffect(() => {
        if (paymentMethod === 'visa') {
            const checkLibrary = setInterval(() => {
                const win = window as any;
                if (win.PaymentSession) {
                    clearInterval(checkLibrary);
                    initializeMastercardSession();
                }
            }, 500);
            return () => clearInterval(checkLibrary);
        }
    }, [paymentMethod]);

    const initializeMastercardSession = () => {
        const win = window as any;
        if (!win.PaymentSession) return;

        win.PaymentSession.configure({
            session: sessionId,
            fields: {
                card: {
                    number: "#card-number",
                    securityCode: "#security-code",
                    expiryMonth: "#expiry-month",
                    expiryYear: "#expiry-year"
                }
            },
            frameEmbeddingRestriction: "NONE",
            callbacks: {
                initialized: (response: any) => {
                    console.log("Mastercard Session Initialized", response);
                    setIsGatewayReady(true);
                },
                formSessionUpdate: (response: any) => {
                    if (response.status === "ok") {
                        // نجح البنك في تشفير البيانات وتحويلها لـ Token
                        handleFinalizePayment(response.session.id);
                    } else if (response.status === "fields_in_error") {
                        if (response.errors.cardNumber) setError("رقم البطاقة غير مكتمل أو غير صحيح.");
                        else if (response.errors.expiryMonth) setError("شهر الانتهاء غير صحيح.");
                        else if (response.errors.expiryYear) setError("سنة الانتهاء غير صحيحة.");
                        else if (response.errors.securityCode) setError("رمز الأمان (CVV) غير صحيح.");
                        setIsProcessing(false);
                    } else {
                        setError("حدث خطأ في معالجة البيانات. يرجى التأكد من صحة البيانات والمحاولة مرة أخرى.");
                        setIsProcessing(false);
                    }
                }
            },
            interaction: {
                displayControl: {
                    formatCard: "EMBOSSED",
                    invalidFieldCharacters: "REJECT"
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

        if (!isGatewayReady) {
            setError("جاري تهيئة بوابة الدفع.. يرجى الانتظار ثانية.");
            return;
        }

        setIsProcessing(true);
        const win = window as any;
        // استدعاء البنك لمعالجة البيانات المدخلة في الـ Iframes
        win.PaymentSession.updateSessionFromForm('card');
    };

    const handleFinalizePayment = (updatedSessionId: string) => {
        // في البيئة الفعلية، هنا يتم إرسال معرف الجلسة للسيرفر لإتمام الخصم المالي
        setTimeout(() => {
            onEnroll(course, 'Success', { 
                paymentMethod: 'Credit Card',
                orderId: `ORD-${Date.now().toString().slice(-6)}`,
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
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">بوابة دفع مشفرة وآمنة (MPGS)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ملخص الفاتورة */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b">تفاصيل الدورة</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight line-clamp-2">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-tighter">{course.category}</p>
                                </div>
                            </div>
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-900 font-black">المبلغ الإجمالي:</span>
                                    <span className="text-2xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 bg-blue-900 rounded-3xl text-white shadow-xl flex items-center gap-4 relative overflow-hidden">
                            <div className="text-3xl z-10">🛡️</div>
                            <p className="text-[10px] leading-relaxed opacity-90 font-bold z-10">
                                يتم معالجة بياناتك مباشرة عبر خوادم البنك بتشفير عالمي. لا يتم تخزين أي بيانات حساسة لدينا.
                            </p>
                            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                    {/* حقول الإدخال */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${paymentMethod === 'visa' ? 'bg-white text-blue-900 shadow-md ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    💳 بطاقة بنكية
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${paymentMethod === 'cliq' ? 'bg-white text-blue-900 shadow-md ring-1 ring-gray-100' : 'text-gray-400'}`}
                                >
                                    📱 تطبيق CliQ
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <form onSubmit={handleConfirmPayment} className="space-y-6 animate-fade-in">
                                    {/* حقل اسم حامل البطاقة (حقل HTML عادي) */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">اسم حامل البطاقة</label>
                                        <input 
                                            type="text" 
                                            className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all" 
                                            placeholder="الاسم كما يظهر على البطاقة" 
                                            required
                                        />
                                    </div>

                                    {/* حقل رقم البطاقة (Bank Hosted) */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">رقم البطاقة (16 رقم)</label>
                                        <div id="card-number" className="mpgs-field-container">
                                            {!isGatewayReady && <div className="text-xs text-gray-300 animate-pulse">جاري تحميل حقل الأمان...</div>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* الشهر */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">شهر الانتهاء (MM)</label>
                                            <div id="expiry-month" className="mpgs-field-container"></div>
                                        </div>
                                        {/* السنة */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">سنة الانتهاء (YY)</label>
                                            <div id="expiry-year" className="mpgs-field-container"></div>
                                        </div>
                                        {/* رمز الأمان */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">الرمز (CVV)</label>
                                            <div id="security-code" className="mpgs-field-container"></div>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black border border-red-100 flex items-center gap-3">
                                            <span className="text-lg">⚠️</span> {error}
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
                                                جاري التحقق الآمن...
                                            </>
                                        ) : (
                                            `دفع ${course.priceJod || course.price} JOD الآن`
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-inner">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع المباشر عبر CliQ</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                        يرجى التحويل للاسم المستعار الخاص بالمنصة، ثم اضغط على زر "تفعيل الطلب" أدناه لمراجعة العملية من قبل فريقنا.
                                    </p>
                                    <button 
                                        onClick={handleConfirmPayment}
                                        className="mt-8 bg-blue-900 text-white font-black py-3 px-10 rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                                    >
                                        تفعيل الطلب يدوياً
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
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
