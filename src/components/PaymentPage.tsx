
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

// تعريف كائن Checkout عالمياً لتجنب أخطاء Typescript
declare global {
    interface Window {
        Checkout: any;
        reactPaymentHandler: (status: string, data?: any) => void;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, currency, strings, onEnroll }) => {
    const [isInitializing, setIsInitializing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');

    // بيانات التاجر الحقيقية من الصورة
    const MERCHANT_ID = "9547143225EP";

    useEffect(() => {
        // إنشاء جسر تواصل بين الدوال العالمية (index.html) وهذا المكون
        window.reactPaymentHandler = (status, data) => {
            if (status === 'error') {
                setError("حدث خطأ أثناء معالجة الدفع بالبطاقة. يرجى المحاولة مرة أخرى.");
                setIsInitializing(false);
            } else if (status === 'cancel') {
                setError("تم إلغاء عملية الدفع.");
                setIsInitializing(false);
            } else if (status === 'complete') {
                // النجاح الحقيقي
                onEnroll(course, 'Success', {
                    paymentMethod: 'Credit Card',
                    transactionId: data.resultIndicator,
                    sessionVersion: data.sessionVersion,
                    orderId: `ORD-${Date.now().toString().slice(-6)}`
                });
                setIsInitializing(false);
            }
        };

        return () => {
            // تنظيف الجسر عند الخروج
            // @ts-ignore
            window.reactPaymentHandler = null;
        };
    }, [course, onEnroll]);

    const handleMastercardPayment = () => {
        if (!window.Checkout) {
            setError("عذراً، نظام الدفع غير متاح حالياً. يرجى تحديث الصفحة.");
            return;
        }

        setIsInitializing(true);
        setError(null);

        try {
            // تهيئة الجلسة (ملاحظة: في الإنتاج، الـ session id يجب أن يأتي من سيرفرك)
            // نستخدم المعرف المزود في الكود كمثال
            window.Checkout.configure({
                merchant: MERCHANT_ID,
                order: {
                    amount: () => course.priceJod || course.price || 0,
                    currency: 'JOD',
                    description: course.title,
                    id: `JOT-${Date.now()}`
                },
                session: {
                    id: 'SESSION0002009503206N5848500E73'
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

            // فتح صفحة الدفع
            window.Checkout.showPaymentPage();
        } catch (err) {
            console.error("Mastercard Config Error:", err);
            setError("حدث خطأ تقني في إعداد بوابة الدفع.");
            setIsInitializing(false);
        }
    };

    const handleCliQPayment = () => {
        // دفع كليك يبقى يدوياً للمراجعة من الأدمن
        onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen animate-fade-in">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">بوابة الدفع الآمنة</h1>
                    <p className="text-gray-500 font-bold">يرجى اختيار وسيلة الدفع المناسبة لإتمام اشتراكك في: <span className="text-green-600">{course.title}</span></p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ملخص الدورة */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b">فاتورة الاشتراك</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-md" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight mb-1">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">{course.category}</p>
                                </div>
                            </div>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                                <div className="flex justify-between text-sm font-bold text-gray-500">
                                    <span>قيمة الدورة:</span>
                                    <span>{course.priceJod || course.price} JOD</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-500">
                                    <span>رسوم الخدمة:</span>
                                    <span className="text-green-600">مجاناً</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-blue-900 font-black">الإجمالي:</span>
                                    <span className="text-2xl font-black text-blue-900">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* خيارات الدفع */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 h-full">
                            <div className="flex gap-4 mb-10">
                                <button 
                                    onClick={() => setPaymentMethod('visa')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${paymentMethod === 'visa' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                                >
                                    <div className="flex gap-2">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                                    </div>
                                    <span className="font-black text-xs text-blue-900 uppercase tracking-widest">بطاقة بنكية</span>
                                </button>
                                <button 
                                    onClick={() => setPaymentMethod('cliq')}
                                    className={`flex-1 flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all ${paymentMethod === 'cliq' ? 'border-green-600 bg-green-50/50' : 'border-gray-100 bg-white hover:border-green-200'}`}
                                >
                                    <div className="w-12 h-6 bg-blue-900 rounded flex items-center justify-center text-[10px] text-white font-black italic">CliQ</div>
                                    <span className="font-black text-xs text-blue-900 uppercase tracking-widest">تحويل كليك</span>
                                </button>
                            </div>

                            {paymentMethod === 'visa' ? (
                                <div className="py-8 text-center space-y-8 animate-fade-in">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-black text-blue-900 mb-4">دفع آمن عبر Mastercard Gateway</h3>
                                        <p className="text-sm text-gray-500 font-bold leading-relaxed mb-8">
                                            سيتم توجيهك الآن إلى صفحة الدفع الآمنة الخاصة بالبنك لإتمام العملية. معلومات بطاقتك مشفرة ولا يتم تخزينها لدينا.
                                        </p>

                                        {error && (
                                            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black border border-red-100 animate-bounce">
                                                ⚠️ {error}
                                            </div>
                                        )}

                                        <button 
                                            onClick={handleMastercardPayment}
                                            disabled={isInitializing}
                                            className="w-full bg-blue-900 text-white font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(0,21,46,0.2)] hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 transform active:scale-95"
                                        >
                                            {isInitializing ? (
                                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <>
                                                    تأكيد الدفع والاشتراك
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <div className="flex justify-center items-center gap-6 opacity-40 grayscale">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/PCI_DSS_logo.svg" alt="PCI" className="h-6" />
                                    </div>
                                </div>
                            ) : (
                                <div className="py-8 text-center space-y-6 animate-fade-in">
                                     <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner text-2xl font-black">Q</div>
                                     <h3 className="text-xl font-black text-blue-900">التحويل الفوري عبر كليك</h3>
                                     <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 inline-block text-right">
                                         <p className="text-sm font-bold text-gray-600 mb-2">بيانات التحويل:</p>
                                         <div className="space-y-1">
                                             <p className="text-sm font-black text-blue-900">الاسم المستعار: <span className="text-green-600">JOTUTOR</span></p>
                                             <p className="text-xs font-bold text-gray-400">البنك: البنك العربي</p>
                                         </div>
                                     </div>
                                     <p className="text-xs text-gray-400 font-bold max-w-xs mx-auto">بعد إتمام التحويل من تطبيق بنكك، اضغط على الزر أدناه وسنقوم بتفعيل دورتك خلال 24 ساعة.</p>
                                     <button 
                                        onClick={handleCliQPayment}
                                        className="w-full max-w-xs bg-green-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-700 transition-all transform active:scale-95"
                                     >
                                         أتممت التحويل، اطلب التفعيل
                                     </button>
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
