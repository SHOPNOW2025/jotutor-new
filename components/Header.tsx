
import React from 'react';
// Fix: Corrected import path for types.
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
    strings: { [key: string]: string };
}

const Header: React.FC<HeaderProps> = ({ 
    onNavigate, onLoginClick, onSignupClick, isLoggedIn, isAdmin, username, onLogout, 
    currency, onCurrencyChange, language, onLanguageChange, isTranslating, strings 
}) => {
    const navLinks = [
        { label: strings.navHome, page: 'home' as Page },
        { label: strings.navTeachers, page: 'teachers' as Page },
        { label: strings.navCourses, page: 'courses' as Page },
        { label: strings.navVideos, page: 'videos' as Page },
        { label: strings.navBlog, page: 'blog' as Page },
        { label: strings.navAbout, page: 'about' as Page },
        { label: strings.navContact, page: 'contact' as Page },
    ];
    
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-2 flex justify-between items-center">
                <button onClick={() => onNavigate('home')} className="flex items-center space-x-2 space-x-reverse">
                    <img src="https://i.ibb.co/XxGsLR3D/15.png" alt="JoTutor Logo" className="h-14 w-auto" />
                </button>
                <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
                    {navLinks.map(link => (
                        <button key={link.page} onClick={() => onNavigate(link.page)} className="text-gray-600 hover:text-green-500 font-semibold transition-colors">
                            {link.label}
                        </button>
                    ))}
                </nav>
                <div className="flex items-center space-x-3 space-x-reverse">
                    <button 
                        onClick={onLanguageChange} 
                        disabled={isTranslating}
                        className="border border-gray-300 rounded-full w-10 h-10 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {language === 'ar' ? 'EN' : 'AR'}
                    </button>
                     <button onClick={onCurrencyChange} className="border border-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2 space-x-reverse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                        <span>{currency}</span>
                    </button>
                    {isLoggedIn ? (
                        <>
                           <span className="font-semibold text-blue-900 hidden md:inline">{strings.welcome}, {username}</span>
                           <button onClick={() => onNavigate(isAdmin ? 'admin-dashboard' : 'dashboard')} className="bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition-colors text-sm">
                                {strings.dashboard}
                           </button>
                           <button onClick={onLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition-colors text-sm">
                                {strings.logout}
                           </button>
                        </>
                    ) : (
                        <>
                            <button onClick={onLoginClick} className="text-green-500 font-bold hover:text-green-600 transition-colors">
                                {strings.login}
                            </button>
                            <button onClick={onSignupClick} className="bg-green-500 text-white font-bold py-2 px-6 rounded-full hover:bg-green-600 transition-colors">
                                {strings.signup}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;