
import React from 'react';

interface WelcomeModalProps {
    onStartChat: () => void;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartChat, onClose }) => {
    const mrPincelImage = "https://i.ibb.co/sd7GkLLT/image-removebg-preview.png";

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
            {/* الخلفية المعتمة */}
            <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-md" onClick={onClose}></div>

            {/* محتوى النافذة - تم إزالة overflow-hidden للسماح ببروز الأيقونة */}
            <div className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-lg p-6 sm:p-10 text-center transform transition-all animate-fade-in-up border-[6px] border-green-500 my-16">
                {/* زر الإغلاق المميز */}
                <button 
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-white text-gray-400 hover:text-red-500 transition-all p-2 rounded-full shadow-lg border-2 border-gray-100 z-50 group hover:rotate-90"
                    aria-label="إغلاق"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* حاوية الأيقونة - تم تعديلها لضمان عدم القص */}
                <div className="absolute -top-20 sm:-top-24 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full border-[6px] border-green-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <img 
                            src={mrPincelImage} 
                            alt="Mr. Pincel" 
                            className="w-24 h-24 sm:w-32 sm:h-32 object-contain animate-bounce-slow"
                            style={{ animationDuration: '3s' }}
                        />
                    </div>
                </div>

                {/* النصوص والمعلومات */}
                <div className="mt-12 sm:mt-16 relative z-10">
                    <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black mb-4 uppercase tracking-widest">
                        مرحباً بك في جو توتر
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl font-black text-blue-900 mb-2 leading-tight">
                        أهلاً بك! 👋
                    </h3>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-6">
                        معك المساعد الذكي <span className="text-blue-900 underline decoration-green-500 underline-offset-4">Mr.Pincel</span>
                    </h2>
                    
                    <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-8 border border-gray-100 shadow-inner">
                        <p className="text-gray-600 text-sm sm:text-lg leading-relaxed font-medium">
                            أنا هنا لأجعل رحلتك التعليمية أسهل. يمكنني مساعدتك في اختيار أفضل الدورات والمعلمين بناءً على مستواك واحتياجاتك الخاصة.
                        </p>
                    </div>

                    {/* الأزرار */}
                    <div className="space-y-4">
                        <button 
                            onClick={onStartChat}
                            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg sm:text-xl font-black py-4 px-8 rounded-2xl shadow-[0_10px_20px_rgba(132,188,53,0.3)] hover:shadow-[0_15px_30px_rgba(132,188,53,0.4)] transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center gap-3 group"
                        >
                            <span>ابدأ مع Mr.Pincel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </button>

                        <button 
                            onClick={onClose}
                            className="w-full text-gray-400 hover:text-blue-900 font-bold text-sm sm:text-base transition-colors py-2 flex items-center justify-center gap-2"
                        >
                            دخول مباشر للموقع
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* زخرفة خلفية بسيطة */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none opacity-5">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500 rounded-full"></div>
                    <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-500 rounded-full"></div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
            ` }} />
        </div>
    );
};

export default WelcomeModal;
