
import React from 'react';
// Fix: Changed import to read from types.ts to break circular dependency.
import { DashboardView } from '../../types';

interface DashboardNavProps {
    username: string;
    activeView: DashboardView;
    setActiveView: (view: DashboardView) => void;
    onLogout: () => void;
}

const DashboardNav: React.FC<DashboardNavProps> = ({ username, activeView, setActiveView, onLogout }) => {
    const navItems = [
        { id: 'profile', label: 'الملف الشخصي' },
        { id: 'courses', label: 'دوراتي' },
        { id: 'wallet', label: 'المحفظة' },
        { id: 'ai-assistant', label: 'المساعد الذكي' },
    ];

    return (
        <aside className="md:w-64 bg-white p-6 rounded-xl shadow-lg flex-shrink-0 w-full">
            <div className="text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-green-500 mx-auto flex items-center justify-center text-white text-4xl font-bold">
                    {username.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-xl mt-4 text-blue-900">أهلاً، {username}</h3>
            </div>
            <nav className="space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as DashboardView)}
                        className={`w-full text-right p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="font-semibold">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-8 border-t pt-4">
                 <button onClick={onLogout} className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors text-red-500 hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="font-semibold">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardNav;