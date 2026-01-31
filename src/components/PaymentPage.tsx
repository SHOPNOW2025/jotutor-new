
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
    if (!course) return <div className="py-20 text-center">Course not found</div>;

    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // المعلومات المطلوبة من العميل/الصورة
    const MERCHANT_ID = 'test12122024';
    const ORDER_ID = `test${Date.now().toString().slice(-8)}`; 
    const ORDER_AMOUNT = (course.priceJod || course.price || 77).toString();
    const ORDER_CURRENCY = 'JOD';
    const ORDER_REFERENCE = `15${ORDER_ID}`;

    useEffect(() => {
        const handleError = (e: any) => {
            setIsProcessing(false);
            setError("حدث خطأ أثناء الاتصال بالبنك. تأكد من اتصالك بالإنترنت.");
        };
        const handleCancel = () => {
            setIsProcessing(false);
            setError("تم إلغاء عملية الدفع من قبلك.");
        };

        window.addEventListener('mpgs-payment-error', handleError);
        window.addEventListener('mpgs-payment-cancel', handleCancel);
        return () => {
            window.removeEventListener('mpgs-payment-error', handleError);
            window.removeEventListener('mpgs-payment-cancel', handleCancel);
        };
    }, []);

    const handleConfirmPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
        } else {
            setIsProcessing(true);
            const win = window as any;

            if (win.Checkout) {
                try {
                    // ملاحظة: في بيئة الإنتاج يتم جلب session id من السيرفر
                    // هنا نستخدم المعلومات المزودة في المثال لتفعيل واجهة الدفع
                    const sessionId = 'SESSION0002493905223M27654405J4';

                    win.Checkout.configure({
                        merchant: MERCHANT_ID,
                        order: {
                            id: ORDER_ID,
                            amount: ORDER_AMOUNT,
                            currency: ORDER_CURRENCY,
                            reference: ORDER_REFERENCE,
                            description: "order payment "
                        },
                        session: {
                            id: sessionId
                        },
                        interaction: {
                            merchant: {
                                name: "Network International / JoTutor"
                            },
                            displayControl: {
                                billingAddress: 'HIDE',
                                customerEmail: 'HIDE'
                            }
                        }
                    });

                    // تفعيل صفحة الدفع
                    win.Checkout.showPaymentPage();
                    
                } catch (err) {
                    console.error("Checkout Config Error", err);
                    setError("تعذر بدء جلسة الدفع.");
                    setIsProcessing(false);
                }
            } else {
                setError("جاري تحميل مكتبة البنك... يرجى الانتظار ثانية.");
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-10">
                    <div className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-xs font-black mb-4">
                        بوابة دفع آمنة: {MERCHANT_ID}
                    </div>
                    <h1 className="text-3xl font-black text-blue-900 mb-2">{strings.paymentTitle}</h1>
                    <p className="text-gray-500 font-bold">رقم الطلب المقترح: {ORDER_ID}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ملخص الفاتورة */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="font-black text-blue-900 mb-6 border-b pb-4">تفاصيل الطلب</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold">المنتج:</span>
                                    <span className="text-blue-900 font-black truncate max-w-[150px]">{course.title}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold">المرجع:</span>
                                    <span className="text-blue-900 font-black">{ORDER_REFERENCE}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-dashed">
                                    <span className="text-gray-600 font-black">الإجمالي:</span>
                                    <span className="text-2xl font-black text-green-600">{ORDER_AMOUNT} JOD</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3">
                                <span className="text-2xl">🔒</span>
                                <p className="text-[10px] text-blue-700 font-bold leading-tight">
                                    سيتم توجيهك لصفحة الدفع الآمنة الخاصة بـ Network International لإتمام العملية بآمان تام.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                            <div className="flex gap-4 mb-8">
                                <button 
                                    onClick={() => setPaymentMethod('visa')} 
                                    className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-sm flex flex-col items-center gap-2 ${paymentMethod === 'visa' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <span className="text-3xl">💳</span> بطاقة بنكية
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')} 
                                    className={`flex-1 py-5 rounded-2xl border-2 transition-all font-black text-sm flex flex-col items-center gap-2 ${paymentMethod === 'cliq' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}
                                >
                                    <span className="text-3xl">📱</span> كليك / CliQ
                                </button>
                            </div>

                            <form onSubmit={handleConfirmPayment} className="space-y-6">
                                {paymentMethod === 'visa' ? (
                                    <div className="p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-center animate-fade-in">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-green-500">
                                            <span className="text-3xl">💳</span>
                                        </div>
                                        <h4 className="font-black text-blue-900 mb-2">الدفع الآمن عبر البنك</h4>
                                        <p className="text-sm text-gray-500 font-bold leading-relaxed max-w-sm mx-auto">
                                            عند الضغط على الزر، ستفتح نافذة دفع آمنة مشفرة تابعة للبنك مباشرة لحماية بيانات بطاقتك.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50 p-10 rounded-3xl border-2 border-dashed border-blue-200 text-center animate-fade-in">
                                        <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">📱</div>
                                        <h4 className="font-black text-blue-900 mb-2">الدفع عبر تطبيق CliQ</h4>
                                        <p className="text-sm text-blue-700 font-bold leading-relaxed max-w-xs mx-auto">
                                            يرجى التحويل إلى الاسم المستعار الخاص بنا، وسنقوم بتفعيل دورتك فور تأكيد الاستلام.
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 flex items-center gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:text-gray-400 text-xl flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                            جاري معالجة الطلب...
                                        </>
                                    ) : (
                                        paymentMethod === 'visa' ? `دفع ${ORDER_AMOUNT} JOD عبر البنك` : "تأكيد الطلب"
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
