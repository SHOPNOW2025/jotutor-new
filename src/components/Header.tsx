
import React from 'react';
import { Page, Currency, Language } from '../types';

interface HeaderProps {
    onNavigate: (page: Page) => void;
    onLoginClick: () => void;
    onSignupClick: () => void;
    isLoggedIn: boolean;
    isAdmin: boolean;
    username?: string;
    onLogout: () => void;
    currency: Currency;
    onCurrencyChange: () => void;
    language: Language;
    onLanguageChange: () => void;
    isTranslating: boolean;
    onBack?: () => void;
    canGoBack?: boolean;
    strings: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ 
    onNavigate, onLoginClick, onSignupClick, isLoggedIn, isAdmin, username, onLogout, 
    currency, onCurrencyChange, language, onLanguageChange, isTranslating, onBack, canGoBack, strings 
}) => {
    const navLinks = [
        ...(language === 'en' ? [{ label: strings.navHome, page: 'home' as Page }] : []),
        { label: strings.navTeachers, page: 'teachers' as Page },
        { label: strings.navCourses, page: 'courses' as Page },
        { label: strings.navVideos, page: 'videos' as Page },
        { label: strings.navBlog, page: 'blog' as Page },
        { label: strings.navAbout, page: 'about' as Page },
        { label: strings.navContact, page: 'contact' as Page },
    ];
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3">
                <div className="flex justify-between items-center gap-2">
                    {/* الشعار */}
                    <button onClick={() => onNavigate('home')} className="flex items-center shrink-0">
                        <img src="https://i.ibb.co/XxGsLR3D/15.png" alt="JoTutor Logo" className="h-10 sm:h-12 w-auto" />
                    </button>

                    {/* روابط التنقل - تظهر فقط في الشاشات الكبيرة */}
                    <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
                        {navLinks.map(link => (
                            <button 
                                key={link.page} 
                                onClick={() => onNavigate(link.page)} 
                                className="text-gray-600 hover:text-green-500 font-bold transition-colors text-sm whitespace-nowrap"
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    {/* منطقة الإجراءات */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* زر الرجوع - متاح دائماً إذا وجد تاريخ */}
                        {canGoBack && onBack && (
                            <button 
                                onClick={onBack}
                                className="flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200 w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full transition-colors font-bold text-xs shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="hidden sm:inline mr-1">{strings.back}</span>
                            </button>
                        )}

                        {/* زر اللغة */}
                        <button 
                            onClick={onLanguageChange} 
                            disabled={isTranslating}
                            className="border border-gray-300 rounded-full w-8 h-8 sm:w-10 sm:h-10 text-[10px] sm:text-xs font-black text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center shrink-0"
                        >
                            {language === 'ar' ? 'EN' : 'AR'}
                        </button>

                        {/* زر العملة */}
                        <button 
                            onClick={onCurrencyChange} 
                            className="border border-gray-300 rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1 shrink-0"
                        >
                            <span className="text-green-500 hidden sm:inline">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </span>
                            <span>{currency}</span>
                        </button>
                        
                        {/* أزرار الدخول */}
                        <div className="flex items-center gap-2 border-r pr-2 rtl:border-r-0 rtl:border-l rtl:pl-2 border-gray-200">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'dashboard')} className="bg-blue-900 text-white font-bold py-1.5 px-3 sm:px-5 rounded-full text-[10px] sm:text-xs whitespace-nowrap">
                                        {strings.dashboard}
                                    </button>
                                    <button onClick={onLogout} className="bg-red-500 text-white font-bold py-1.5 px-3 sm:px-5 rounded-full text-[10px] sm:text-xs whitespace-nowrap hidden sm:block">
                                        {strings.logout}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <button onClick={onLoginClick} className="text-green-600 font-black text-xs sm:text-sm whitespace-nowrap px-1">
                                        {strings.login}
                                    </button>
                                    <button onClick={onSignupClick} className="bg-green-500 text-white font-black py-1.5 px-3 sm:py-2 sm:px-6 rounded-full text-xs sm:text-sm whitespace-nowrap shadow-sm">
                                        {strings.signup}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {/* قائمة تنقل سريعة للموبايل (اختياري - تظهر أسفل الهيدر) */}
                <div className="lg:hidden flex overflow-x-auto py-2 gap-4 text-[10px] font-bold text-gray-500 scrollbar-hide no-scrollbar">
                    {navLinks.map(link => (
                        <button key={link.page} onClick={() => onNavigate(link.page)} className="whitespace-nowrap px-1">
                            {link.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default Header;
