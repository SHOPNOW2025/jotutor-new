
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
    const [timeLeft, setTimeLeft] = useState(30);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [error, setError] = useState<string | null>(null);

    // مؤقت المعالجة الوهمي
    useEffect(() => {
        let timer: any;
        if (isProcessing && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isProcessing && timeLeft === 0) {
            // عند انتهاء الـ 30 ثانية
            handleFinalizePayment();
        }
        return () => clearInterval(timer);
    }, [isProcessing, timeLeft]);

    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
            return;
        }

        if (cardNumber.replace(/\s/g, '').length < 16) {
            setError("رقم البطاقة غير مكتمل.");
            return;
        }

        setIsProcessing(true);
        setTimeLeft(30);
    };

    const handleFinalizePayment = () => {
        onEnroll(course, 'Success', { 
            paymentMethod: 'Credit Card',
            orderId: `ORD-${Date.now().toString().slice(-6)}`,
            transactionId: `SIM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        });
        setIsProcessing(false);
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length > 0) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    if (isProcessing) {
        return (
            <div className="py-20 bg-white min-h-screen flex flex-col items-center justify-center animate-fade-in px-4">
                <div className="w-full max-w-md text-center">
                    <div className="relative mb-12 flex justify-center">
                        {/* انيميشن التحميل */}
                        <div className="w-32 h-32 border-4 border-gray-100 border-t-green-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-black text-blue-900">{timeLeft}</span>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-blue-900 mb-4">جاري معالجة الدفع...</h2>
                    <p className="text-gray-500 font-bold mb-8 leading-relaxed">
                        يرجى عدم إغلاق الصفحة أو الضغط على زر الرجوع. نحن نتواصل مع البنك لتأمين عملية السحب الخاصة بك.
                    </p>
                    
                    <div className="space-y-3">
                        <div className={`h-2 bg-gray-100 rounded-full overflow-hidden`}>
                            <div 
                                className="h-full bg-green-500 transition-all duration-1000 ease-linear" 
                                style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span>جاري التشفير</span>
                            <span>{Math.round(((30 - timeLeft) / 30) * 100)}%</span>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <div className="flex items-center gap-4 text-right">
                            <div className="text-2xl">🔒</div>
                            <div className="text-[11px] text-blue-800 font-bold leading-relaxed">
                                هذه العملية محمية بواسطة معايير الأمان العالمية (PCI-DSS). يتم تشفير بياناتك باستخدام بروتوكول SSL بقوة 256-بت.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">{strings.paymentTitle}</h1>
                    <div className="flex justify-center items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">بوابة دفع جو توتر الآمنة</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b text-lg">ملخص الطلب</h2>
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
                    </div>

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
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">اسم حامل البطاقة</label>
                                        <input 
                                            type="text" 
                                            value={cardHolder}
                                            onChange={(e) => setCardHolder(e.target.value)}
                                            className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all" 
                                            placeholder="John Doe" 
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">رقم البطاقة</label>
                                        <input 
                                            type="text" 
                                            maxLength={19}
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all" 
                                            placeholder="0000 0000 0000 0000" 
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">تاريخ الانتهاء</label>
                                            <input type="text" placeholder="MM/YY" className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-green-500" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">الرمز (CVV)</label>
                                            <input type="password" maxLength={3} placeholder="***" className="w-full p-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-green-500" required />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black border border-red-100 flex items-center gap-3">
                                            <span className="text-lg">⚠️</span> {error}
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-blue-800 transition-all active:scale-[0.98] text-lg flex items-center justify-center gap-3 mt-8"
                                    >
                                        `تأكيد ودفع ${course.priceJod || course.price} JOD`
                                    </button>
                                </form>
                            ) : (
                                <div className="py-10 text-center animate-fade-in">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-inner">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع المباشر عبر CliQ</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                        يرجى تحويل المبلغ للاسم المستعار (JOTUTOR) ثم الضغط على الزر أدناه ليقوم فريقنا بمراجعة العملية وتفعيل الدورة في حسابك يدوياً.
                                    </p>
                                    <button 
                                        onClick={handleConfirmPayment}
                                        className="mt-8 bg-blue-900 text-white font-black py-3 px-10 rounded-2xl shadow-lg hover:bg-blue-800 transition-all"
                                    >
                                        إرسال طلب التفعيل
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
