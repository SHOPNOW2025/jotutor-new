
import React, { useState } from 'react';
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

    // حالات الحقول (State)
    const [cardData, setCardData] = useState({
        name: '',
        number: '',
        month: '',
        year: '',
        cvv: ''
    });

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // تنظيف المدخلات وتنسيق الرقم (إضافة مسافة كل 4 أرقام)
        let value = e.target.value.replace(/\D/g, '');
        let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        if (formattedValue.length <= 19) { // 16 رقم + 3 مسافات
            setCardData({ ...cardData, number: formattedValue });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // قيود الطول للحقول الصغيرة
        if (name === 'month' || name === 'year') {
            if (value.length <= 2) setCardData({ ...cardData, [name]: value });
        } else if (name === 'cvv') {
            if (value.length <= 4) setCardData({ ...cardData, [name]: value });
        } else {
            setCardData({ ...cardData, [name]: value });
        }
    };

    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (paymentMethod === 'cliq') {
            onEnroll(course, 'Pending', { paymentMethod: 'CliQ' });
            return;
        }

        // تحقق بسيط من البيانات قبل الإرسال
        if (cardData.number.length < 16 || cardData.month === '' || cardData.year === '' || cardData.cvv.length < 3) {
            setError("الرجاء التأكد من إكمال جميع بيانات البطاقة بشكل صحيح.");
            return;
        }

        setIsProcessing(true);

        // محاكاة الاتصال ببوابة ماستركارد (Production)
        // في البيئة الحقيقية، هنا يتم إرسال البيانات مشفرة لسيرفر البنك
        setTimeout(() => {
            onEnroll(course, 'Success', { 
                paymentMethod: 'Credit Card',
                orderId: `ORD-${Date.now().toString().slice(-6)}`,
                transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            });
            setIsProcessing(false);
        }, 2500);
    };

    return (
        <div className="py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-blue-900 mb-2">{strings.paymentTitle}</h1>
                    <div className="flex justify-center items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">بوابة دفع جو توتر الآمنة</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ملخص الطلب */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                            <h2 className="font-black text-blue-900 mb-6 pb-4 border-b">ملخص الدورة</h2>
                            <div className="flex gap-4 mb-6">
                                <img src={course.imageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                                <div>
                                    <h3 className="font-bold text-blue-900 text-sm leading-tight">{course.title}</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 font-bold uppercase">{course.category}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                                <div className="flex justify-between text-xs font-bold text-blue-900">
                                    <span>الإجمالي المستحق:</span>
                                    <span className="text-xl font-black text-green-600">{course.priceJod || course.price} JOD</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-blue-900 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] leading-relaxed opacity-80 font-bold">
                                    نحن نستخدم تشفير 256-bit لضمان أمان بياناتك. يتم معالجة الدفع عبر Mastercard Gateway (Production).
                                </p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                    {/* نموذج الدفع */}
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
                                <form onSubmit={handleConfirmPayment} className="space-y-5 animate-fade-in">
                                    {/* اسم صاحب البطاقة */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">اسم صاحب البطاقة</label>
                                        <input 
                                            name="name"
                                            type="text" 
                                            value={cardData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold transition-all" 
                                            placeholder="الاسم كما يظهر على البطاقة" 
                                            required
                                        />
                                    </div>

                                    {/* رقم البطاقة */}
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">رقم البطاقة</label>
                                        <div className="relative">
                                            <input 
                                                type="tel" 
                                                value={cardData.number}
                                                onChange={handleCardNumberChange}
                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-bold tracking-widest transition-all" 
                                                placeholder="0000 0000 0000 0000" 
                                                required
                                            />
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="" className="absolute left-4 top-1/2 -translate-y-1/2 h-6" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* الشهر */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">الشهر</label>
                                            <input 
                                                name="month"
                                                type="tel" 
                                                value={cardData.month}
                                                onChange={handleInputChange}
                                                placeholder="MM"
                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold outline-none focus:ring-2 focus:ring-green-500" 
                                                required
                                            />
                                        </div>
                                        {/* السنة */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">السنة</label>
                                            <input 
                                                name="year"
                                                type="tel" 
                                                value={cardData.year}
                                                onChange={handleInputChange}
                                                placeholder="YY"
                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold outline-none focus:ring-2 focus:ring-green-500" 
                                                required
                                            />
                                        </div>
                                        {/* رمز الأمان */}
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase mr-1">الرمز (CVV)</label>
                                            <input 
                                                name="cvv"
                                                type="password" 
                                                value={cardData.cvv}
                                                onChange={handleInputChange}
                                                placeholder="***"
                                                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold outline-none focus:ring-2 focus:ring-green-500" 
                                                required
                                            />
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
                                                جاري المعالجة...
                                            </>
                                        ) : (
                                            `تأكيد ودفع ${course.priceJod || course.price} JOD`
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="py-10 text-center animate-fade-in-up">
                                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-inner">Q</div>
                                    <h4 className="font-black text-blue-900 mb-2">الدفع عبر تطبيق CliQ</h4>
                                    <p className="text-xs text-gray-500 font-bold max-w-xs mx-auto leading-relaxed">
                                        قم بتحويل المبلغ للاسم المستعار للمنصة، ثم اضغط على زر التفعيل أدناه ليقوم فريقنا بمراجعة العملية.
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
