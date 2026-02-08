
import React from 'react';

interface WelcomeModalProps {
    onStartChat: () => void;
    onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStartChat, onClose }) => {
    const mrPincelImage = "https://i.ibb.co/sd7GkLLT/image-removebg-preview.png";

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto bg-blue-900/40 backdrop-blur-sm">
            {/* الخلفية المعتمة القابلة للنقر للإغلاق */}
            <div className="fixed inset-0 cursor-default" onClick={onClose}></div>

            {/* حاوية النافذة الرئيسية */}
            <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.4)] w-full max-w-lg lg:max-w-xl p-8 sm:p-12 text-center transform transition-all animate-fade-in-up border-[4px] sm:border-[8px] border-green-500 my-20 sm:my-24">
                
                {/* زر الإغلاق العلوي */}
                <button 
                    onClick={onClose}
                    className="absolute -top-3 -right-3 sm:-top-5 sm:-right-5 bg-white text-gray-400 hover:text-red-500 transition-all p-2 sm:p-3 rounded-full shadow-xl border-2 border-gray-100 z-50 group hover:rotate-90"
                    aria-label="إغلاق"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* أيقونة Mr.Pincel العائمة - مع تحسين البروز */}
                <div className="absolute -top-16 sm:-top-24 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="w-32 h-32 sm:w-44 sm:h-44 bg-white rounded-full border-[4px] sm:border-[8px] border-green-500 flex items-center justify-center shadow-2xl relative overflow-visible">
                        <img 
                            src={mrPincelImage} 
                            alt="Mr. Pincel" 
                            className="w-24 h-24 sm:w-36 sm:h-36 object-contain animate-bounce-custom"
                        />
                        {/* هالة مضيئة خلف الأيقونة */}
                        <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping opacity-30"></div>
                    </div>
                </div>

                {/* المحتوى النصي */}
                <div className="mt-12 sm:mt-16 relative z-10">
                    <div className="inline-block bg-green-100 text-green-700 px-5 py-1.5 rounded-full text-xs sm:text-sm font-black mb-5 uppercase tracking-widest shadow-sm">
                        منصة جو توتر ترحب بك
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl font-black text-blue-900 mb-2 leading-tight">
                        أهلاً بك! 👋
                    </h3>
                    
                    <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-8">
                        معك المساعد الذكي <span className="text-blue-900 border-b-4 border-green-500 pb-1">Mr.Pincel</span>
                    </h2>
                    
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-10 border border-gray-100 shadow-inner">
                        <p className="text-gray-600 text-base sm:text-xl leading-relaxed font-medium">
                            يسعدني جداً انضمامك إلينا! أنا هنا لأجعل اختيارك للمستقبل أسهل وأكثر دقة. يمكنني ترشيح المعلمين والدورات التي تناسب أهدافك تماماً.
                        </p>
                    </div>

                    {/* الأزرار التفاعلية */}
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={onStartChat}
                            className="w-full bg-green-500 hover:bg-green-600 text-white text-lg sm:text-2xl font-black py-4 sm:py-5 px-8 rounded-2xl shadow-[0_12px_24px_rgba(132,188,53,0.4)] hover:shadow-[0_18px_36px_rgba(132,188,53,0.5)] transition-all duration-300 transform hover:-translate-y-1.5 flex items-center justify-center gap-4 group"
                        >
                            <span>ابدأ الآن مع Mr.Pincel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </button>

                        <button 
                            onClick={onClose}
                            className="w-full text-gray-400 hover:text-blue-900 font-bold text-sm sm:text-lg transition-colors py-3 flex items-center justify-center gap-2"
                        >
                            تصفح الموقع أولاً
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* زخارف فنية في الزوايا */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none opacity-[0.03]">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-green-500 rounded-full"></div>
                    <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-500 rounded-full"></div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-custom {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.05); }
                }
                .animate-bounce-custom {
                    animation: bounce-custom 2.5s infinite ease-in-out;
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(40px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            ` }} />
        </div>
    );
};

export default WelcomeModal;
