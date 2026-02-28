
import React, { useState, useCallback } from 'react';
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
        PaymentSession: any;
    }
}

const PaymentPage: React.FC<PaymentPageProps> = ({ course, onEnroll }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [gatewayError, setGatewayError] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'visa' | 'cliq'>('visa');
    const [paymentReceipt, setPaymentReceipt] = useState<any>(null);
    const [paymentStep, setPaymentStep] = useState<string>('');
    const [debugLogs, setDebugLogs] = useState<string[]>([]);
    const [sessionReady, setSessionReady] = useState(false);
    const [showOTPFrame, setShowOTPFrame] = useState(false);

    const log = useCallback((msg: string) => {
        const time = new Date().toLocaleTimeString();
        const entry = `[${time}] ${msg}`;
        console.log(entry);
        setDebugLogs(prev => [...prev, entry]);
    }, []);

    const generateOrderId = () => `JOT-${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`;

    /** Write HTML into an iframe via document.write (needed for auto-submitting forms with scripts) */
    const writeToIframe = (iframeId: string, html: string) => {
        const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
        if (!iframe) return;
        const doc = iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(html);
            doc.close();
        }
    };

    // ===========================
    // STEP 1: Create session + configure hosted fields
    // ===========================
    const initializePaymentSession = async () => {
        const orderId = generateOrderId();
        const amount = course.priceJod || course.price || 1;

        try {
            setIsLoading(true);
            setGatewayError(null);
            log(`🚀 Creating session: orderId=${orderId}, amount=${amount} JOD`);

            const resp = await fetch('/api/payment/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency: 'JOD', orderId })
            });
            const data = await resp.json();
            if (!resp.ok) throw new Error(JSON.stringify(data));

            const { sessionId } = data;
            log(`✅ Session created: ${sessionId}`);

            if (!window.PaymentSession) throw new Error('PaymentSession library not loaded');

            log('⏳ Configuring hosted payment fields...');
            window.PaymentSession.configure({
                session: sessionId,
                fields: {
                    card: {
                        number: "#card-number",
                        securityCode: "#security-code",
                        expiryMonth: "#expiry-month",
                        expiryYear: "#expiry-year",
                        nameOnCard: "#cardholder-name"
                    }
                },
                frameEmbeddingMitigation: ["javascript"],
                callbacks: {
                    initialized: function (response: any) {
                        log(`✅ Hosted fields initialized: ${JSON.stringify(response)}`);
                        setSessionReady(true);
                        setIsLoading(false);
                    },
                    formSessionUpdate: function (response: any) {
                        log(`📋 Form session update: status=${response.status}`);
                        if (response.status === "ok") {
                            log('✅ Card details tokenized');
                            handle3DSAndPay(orderId, sessionId, amount);
                        } else if (response.status === "fields_in_error") {
                            setIsLoading(false);
                            const errorFields = Object.keys(response.errors || {}).join(', ');
                            setGatewayError(`خطأ في حقول البطاقة: ${errorFields}`);
                            log(`❌ Card validation error: ${errorFields}`);
                        } else {
                            setIsLoading(false);
                            setGatewayError('خطأ في النظام. يرجى المحاولة مرة أخرى.');
                            log(`❌ System error during tokenization`);
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
        } catch (err: any) {
            setIsLoading(false);
            log(`💥 Error: ${err.message}`);
            setGatewayError(err.message);
        }
    };

    // ===========================
    // STEP 2: Tokenize card
    // ===========================
    const handleSubmitPayment = () => {
        if (!sessionReady) return;
        setIsLoading(true);
        setGatewayError(null);
        setPaymentStep('جاري التحقق من بيانات البطاقة...');
        log('📤 Submitting card for tokenization...');
        window.PaymentSession.updateSessionFromForm('card');
    };

    // ===========================
    // STEP 3: 3DS flow via server-side API calls
    // Hidden iframe for device fingerprinting, visible iframe for OTP
    // ===========================
    const handle3DSAndPay = async (orderId: string, sid: string, amount: number) => {
        try {
            setPaymentStep('جاري المصادقة الأمنية 3DS...');
            const authTransId = `auth-${Date.now()}`;

            // ---- 3a: INITIATE_AUTHENTICATION (device fingerprinting - HIDDEN iframe) ----
            log('🔐 Step 1: INITIATE_AUTHENTICATION (background device fingerprinting)...');
            const initResp = await fetch('/api/payment/initiate-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, transactionId: authTransId, sessionId: sid, currency: 'JOD' })
            });
            const initData = await initResp.json();
            log(`📋 InitAuth response: result=${initData.result}, redirectVersion=${initData.authentication?.redirect?.version}`);

            if (initData.result === 'ERROR') {
                throw new Error(`3DS Init failed: ${initData.error?.explanation || JSON.stringify(initData.error)}`);
            }

            // Inject into HIDDEN iframe and wait for device fingerprinting (~3 sec)
            const initHtml = initData.authentication?.redirect?.html;
            if (initHtml) {
                log('📱 Injecting device fingerprinting into hidden iframe...');
                writeToIframe('hidden-3ds-frame', initHtml);
                // Give device fingerprinting time to complete
                await new Promise(r => setTimeout(r, 3000));
            }

            // ---- 3b: AUTHENTICATE_PAYER (OTP challenge - VISIBLE iframe) ----
            log('🔐 Step 2: AUTHENTICATE_PAYER (OTP challenge)...');
            setPaymentStep('يرجى إكمال التحقق من البنك...');

            const authResp = await fetch('/api/payment/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    transactionId: authTransId,
                    sessionId: sid,
                    amount,
                    currency: 'JOD',
                    browserDetails: {
                        javaEnabled: navigator.javaEnabled?.() || false,
                        language: navigator.language,
                        screenHeight: screen.height,
                        screenWidth: screen.width,
                        timeZone: new Date().getTimezoneOffset(),
                        colorDepth: screen.colorDepth,
                        returnUrl: window.location.origin + '/api/payment/3ds-callback'
                    }
                })
            });
            const authData = await authResp.json();
            log(`📋 Auth response: result=${authData.result}, payerInteraction=${authData.authentication?.payerInteraction}`);

            if (authData.result === 'ERROR') {
                throw new Error(`3DS Auth failed: ${authData.error?.explanation || JSON.stringify(authData.error)}`);
            }

            const otpHtml = authData.authentication?.redirect?.html;

            // No challenge needed (frictionless) — only if payerInteraction explicitly says NOT_REQUIRED
            if (!otpHtml && authData.authentication?.payerInteraction === 'NOT_REQUIRED') {
                log('✅ Frictionless auth - no OTP needed, proceeding to PAY...');
                await executePayment(orderId, sid, amount, authTransId);
                return;
            }

            // Challenge needed — open OTP in a POPUP window to bypass bank X-Frame-Options
            log('🌐 OTP challenge required - opening popup window...');
            setShowOTPFrame(true); // Show overlay guiding the user to look at popup

            // Open a popup for the bank's OTP challenge
            const popup = window.open('', 'ThreeDS_Challenge', 'width=520,height=620,scrollbars=yes,resizable=yes,left=200,top=100');
            if (!popup) {
                // Popup blocked — fall back to iframe
                log('⚠️ Popup blocked, attempting iframe fallback...');
                await new Promise(r => setTimeout(r, 200));
                writeToIframe('otp-3ds-frame', otpHtml);
            } else {
                popup.document.open();
                popup.document.write(otpHtml);
                popup.document.close();
            }

            // Listen for completion message from our /api/payment/3ds-callback
            // The callback posts to window.opener (if popup) or window.top/parent (if iframe)
            await new Promise<void>((resolve, reject) => {
                const maxWait = setTimeout(() => {
                    reject(new Error('انتهت مهلة التحقق من البنك'));
                }, 5 * 60 * 1000); // 5 minutes timeout

                const messageHandler = (event: MessageEvent) => {
                    if (event.data === '3ds_challenge_complete') {
                        log('📥 3DS challenge complete signal received!');
                        clearTimeout(maxWait);
                        window.removeEventListener('message', messageHandler);
                        setShowOTPFrame(false);
                        try { popup?.close(); } catch (e) { /* ignore */ }
                        resolve();
                    }
                };
                window.addEventListener('message', messageHandler);
            });

            // Give gateway a moment then poll to confirm authentication is complete
            log('⏳ Confirming 3DS authentication status...');
            let authConfirmed = false;
            for (let attempt = 1; attempt <= 12; attempt++) {
                await new Promise(r => setTimeout(r, 2500));
                try {
                    const statusResp = await fetch(`/api/payment/order-status/${orderId}`);
                    const statusText = await statusResp.text();
                    const statusData = JSON.parse(statusText);
                    const authStatus = statusData.authenticationStatus;
                    log(`🔍 Poll ${attempt}: authStatus=${authStatus}, orderStatus=${statusData.status}`);
                    if (authStatus === 'AUTHENTICATION_SUCCESSFUL') {
                        authConfirmed = true;
                        break;
                    } else if (authStatus === 'AUTHENTICATION_UNSUCCESSFUL' || authStatus === 'AUTHENTICATION_FAILED') {
                        throw new Error('فشل التحقق من الهوية. يرجى المحاولة مجددًا.');
                    }
                } catch (pollErr: any) {
                    if (pollErr.message.includes('فشل')) throw pollErr;
                    log(`⚠️ Poll error (continuing): ${pollErr.message}`);
                }
            }
            if (!authConfirmed) {
                throw new Error('لم يتم تأكيد المصادقة في الوقت المناسب');
            }
            await executePayment(orderId, sid, amount, authTransId);

        } catch (err: any) {
            setIsLoading(false);
            setShowOTPFrame(false);
            log(`💥 Error in 3DS/Pay: ${err.message}`);
            setGatewayError(err.message);
        }
    };

    // ===========================
    // STEP 4: Server-side PAY
    // ===========================
    const executePayment = async (orderId: string, sid: string, amount: number, authTransId: string) => {
        try {
            setPaymentStep('جاري تنفيذ الدفع...');
            log('💳 Calling PAY API...');

            const resp = await fetch('/api/payment/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, sessionId: sid, amount, currency: 'JOD', authTransactionId: authTransId })
            });
            const data = await resp.json();
            log(`📋 PAY Response: ${JSON.stringify(data)}`);

            if (data.success) {
                log('🎉 PAYMENT SUCCESSFUL!');
                setPaymentReceipt({ orderId, amount, status: data.status, transactionId: data.transactionId });
                onEnroll(course, 'Success', { transactionId: data.transactionId, orderId });
            } else {
                throw new Error(`فشل الدفع: ${data.gatewayCode || data.error?.explanation || JSON.stringify(data.error)}`);
            }
        } catch (err: any) {
            log(`💥 Payment error: ${err.message}`);
            setGatewayError(err.message);
        } finally {
            setIsLoading(false);
            setPaymentStep('');
        }
    };

    const handleConfirmPayment = () => {
        if (paymentMethod === 'visa') {
            setShowCardForm(true);
            initializePaymentSession();
        }
    };

    // ===========================
    // SUCCESS RECEIPT
    // ===========================
    if (paymentReceipt) {
        return (
            <div className="py-12 bg-gray-50 min-h-screen animate-fade-in">
                <div className="container mx-auto px-4 max-w-lg">
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
                        <h2 className="text-3xl font-black text-green-600 mb-2">تمت العملية بنجاح!</h2>
                        <p className="text-gray-500 mb-8">تم خصم المبلغ وتسجيلك في الدورة</p>
                        <div className="space-y-3 bg-gray-50 p-6 rounded-2xl text-sm text-right">
                            <div className="flex justify-between"><span className="text-gray-400">المبلغ</span><span className="font-black text-blue-900">{paymentReceipt.amount} JOD</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">رقم الطلب</span><span className="font-black text-blue-900">{paymentReceipt.orderId}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">رقم العملية</span><span className="font-black text-blue-900">{paymentReceipt.transactionId}</span></div>
                            <div className="flex justify-between"><span className="text-gray-400">الحالة</span><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">✅ مكتمل</span></div>
                        </div>
                        <button onClick={() => window.location.href = '/dashboard'} className="w-full py-5 rounded-2xl font-black text-white bg-blue-900 hover:bg-blue-800 shadow-xl transition-all mt-6">
                            الانتقال للوحة التحكم
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gray-50 min-h-screen animate-fade-in">
            {/* HIDDEN iframes - always in DOM */}
            <iframe
                id="hidden-3ds-frame"
                title="3DS Device Fingerprint"
                style={{ display: 'none', width: 0, height: 0, border: 'none' }}
            />

            {/* OTP Challenge Overlay */}
            {showOTPFrame && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-4">
                        <div className="bg-blue-900 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-black text-sm uppercase tracking-wider">التحقق من الهوية البنكية</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-green-400 text-xs font-bold">SECURE</span>
                            </div>
                        </div>
                        <iframe
                            id="otp-3ds-frame"
                            title="3DS OTP Challenge"
                            style={{ width: '100%', height: '450px', border: 'none', display: 'block' }}
                        />
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-blue-900 mb-2 tracking-tighter uppercase">بوابة الدفع البنكية</h1>
                    <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                        نظام دفع فعلي مشفر
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Invoice */}
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
                                <div className="text-4xl font-black text-blue-900">{course.priceJod || course.price} <small className="text-xs font-bold">JOD</small></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-6 opacity-30 px-6 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                        </div>
                    </div>

                    {/* Main Payment Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-gray-100 min-h-[500px] flex flex-col">
                            {!showCardForm ? (
                                <div className="flex-1 flex flex-col items-center justify-center animate-fade-in py-6">
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
                                        <button onClick={() => setPaymentMethod('visa')} className={`flex flex-col items-center gap-3 p-8 rounded-[2.5rem] border-2 transition-all ${paymentMethod === 'visa' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-50 bg-gray-50/20'}`}>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${paymentMethod === 'visa' ? 'bg-blue-600 text-white shadow-xl scale-110' : 'bg-white text-gray-400 border shadow-sm'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                            </div>
                                            <span className={`font-black text-[10px] uppercase tracking-widest ${paymentMethod === 'visa' ? 'text-blue-900' : 'text-gray-400'}`}>البطاقة البنكية</span>
                                        </button>
                                        <button onClick={() => setPaymentMethod('cliq')} className={`flex flex-col items-center gap-3 p-8 rounded-[2.5rem] border-2 transition-all ${paymentMethod === 'cliq' ? 'border-green-600 bg-green-50/30' : 'border-gray-50 bg-gray-50/20'}`}>
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${paymentMethod === 'cliq' ? 'bg-green-600 text-white shadow-xl scale-110' : 'bg-white text-gray-400 border shadow-sm'}`}>
                                                <span className="font-black text-xl italic">Q</span>
                                            </div>
                                            <span className={`font-black text-[10px] uppercase tracking-widest ${paymentMethod === 'cliq' ? 'text-green-900' : 'text-gray-400'}`}>تحويل CliQ</span>
                                        </button>
                                    </div>
                                    <button onClick={handleConfirmPayment} disabled={isLoading} className="w-full max-w-sm py-5 rounded-2xl font-black text-white bg-blue-900 hover:bg-blue-800 shadow-[0_15px_30px_rgba(0,33,70,0.2)] transition-all transform active:scale-95 text-lg flex items-center justify-center gap-3">
                                        {isLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "بدء الاتصال بالبنك"}
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <button onClick={() => { setShowCardForm(false); setSessionReady(false); setGatewayError(null); setPaymentStep(''); }} className="text-blue-600 font-black text-xs flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-full transition-all">&larr; رجوع</button>
                                        <div className="bg-gray-100 text-[9px] font-black text-gray-500 px-4 py-1.5 rounded-full border uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                            Secure Payment
                                        </div>
                                    </div>

                                    {/* Card Hosted Fields */}
                                    <div className="flex-1 space-y-5">
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">اسم حامل البطاقة</label>
                                            <input type="text" id="cardholder-name" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors bg-gray-50" readOnly placeholder="Cardholder Name" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">رقم البطاقة</label>
                                            <input type="text" id="card-number" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors bg-gray-50" readOnly placeholder="Card Number" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">الشهر</label>
                                                <input type="text" id="expiry-month" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-center" readOnly placeholder="MM" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">السنة</label>
                                                <input type="text" id="expiry-year" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-center" readOnly placeholder="YY" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">CVV</label>
                                                <input type="text" id="security-code" className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 text-center" readOnly placeholder="CVV" />
                                            </div>
                                        </div>

                                        {paymentStep && (
                                            <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                                {paymentStep}
                                            </div>
                                        )}

                                        {gatewayError && (
                                            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-bold">
                                                ⚠️ {gatewayError}
                                                <button onClick={() => { setGatewayError(null); setIsLoading(false); setPaymentStep(''); }} className="block text-xs mt-1 underline">حاول مجددًا</button>
                                            </div>
                                        )}

                                        <button onClick={handleSubmitPayment} disabled={isLoading || !sessionReady} className={`w-full py-4 rounded-2xl font-black text-white shadow-xl transition-all text-lg flex items-center justify-center gap-3 mt-4 ${isLoading || !sessionReady ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 active:scale-95'}`}>
                                            {isLoading ? (
                                                <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>{paymentStep || 'جاري المعالجة...'}</>
                                            ) : !sessionReady ? 'جاري تحميل نموذج الدفع...' : `ادفع ${course.priceJod || course.price} دينار`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Debug Panel */}
                {debugLogs.length > 0 && (
                    <div className="mt-8 bg-gray-900 text-green-400 p-6 rounded-2xl shadow-xl max-w-6xl mx-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-xs uppercase tracking-widest text-green-300">🔧 Debug Console</h3>
                            <button onClick={() => setDebugLogs([])} className="text-xs text-gray-500 hover:text-red-400 font-bold">Clear</button>
                        </div>
                        <div className="space-y-1 font-mono text-[11px] max-h-[400px] overflow-y-auto">
                            {debugLogs.map((logEntry, i) => (
                                <div key={i} className={`py-1 border-b border-gray-800 ${logEntry.includes('❌') || logEntry.includes('💥') ? 'text-red-400' : logEntry.includes('✅') || logEntry.includes('🎉') ? 'text-green-400' : 'text-gray-300'}`}>
                                    {logEntry}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
