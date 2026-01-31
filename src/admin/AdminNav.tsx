
import React from 'react';

export type AdminView = 'content' | 'users' | 'teachers' | 'courses' | 'testimonials' | 'blog' | 'heroImages' | 'onboarding' | 'staff' | 'payments' | 'whatsapp-courses';

interface AdminNavProps {
    activeView: AdminView;
    setActiveView: (view: AdminView) => void;
    onLogout: () => void;
    strings: { [key: string]: string };
    isEnglishAdmin?: boolean;
    isSuperAdmin?: boolean;
    onSwitchMode?: () => void;
}

const AdminNav: React.FC<AdminNavProps> = ({ activeView, setActiveView, onLogout, strings, isEnglishAdmin, isSuperAdmin, onSwitchMode }) => {
    let navItems = [
        { id: 'whatsapp-courses', label: strings.adminNavWhatsapp, icon: '💬' },
        { id: 'content', label: strings.adminNavContent },
        { id: 'heroImages', label: strings.adminNavHero },
        { id: 'onboarding', label: strings.adminNavOnboarding },
        { id: 'users', label: strings.adminNavUsers },
        { id: 'staff', label: strings.adminNavStaff },
        { id: 'payments', label: strings.adminNavPayments },
        { id: 'teachers', label: strings.adminNavTeachers },
        { id: 'courses', label: strings.adminNavCourses },
        { id: 'testimonials', label: strings.adminNavTestimonials },
        { id: 'blog', label: strings.adminNavBlog },
    ];

    if (isEnglishAdmin) {
        navItems = [
            { id: 'content', label: 'Content Management (English)' },
            { id: 'heroImages', label: 'Home Banner (English)' },
            { id: 'onboarding', label: 'Onboarding Steps (English)' },
            { id: 'users', label: 'User Management (English)' },
            { id: 'teachers', label: 'Teacher Management (English)' },
            { id: 'courses', label: 'Course Management (English)' },
            { id: 'testimonials', label: 'Testimonials (English)' },
            { id: 'blog', label: 'Blog Management (English)' },
        ];
    }

    return (
        <aside className="md:w-64 bg-white p-6 rounded-xl shadow-lg flex-shrink-0 w-full">
            <div className="text-center mb-8">
                <h3 className="font-bold text-xl mt-4 text-blue-900">
                    {isEnglishAdmin ? 'English Admin Panel' : strings.adminPanelTitle}
                </h3>
            </div>
            <nav className="space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as AdminView)}
                        className={`w-full text-right p-3 rounded-lg transition-colors flex items-center justify-between ${activeView === item.id ? 'bg-blue-900 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="font-semibold">{item.label}</span>
                        {item.icon && <span>{item.icon}</span>}
                    </button>
                ))}
            </nav>
            <div className="mt-8 border-t pt-4 space-y-2">
                 {isSuperAdmin && onSwitchMode && (
                    <button 
                        onClick={onSwitchMode} 
                        className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors bg-orange-50 text-orange-600 hover:bg-orange-100 mb-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-semibold text-sm">
                            {isEnglishAdmin ? 'Back to Super Admin' : 'Switch to English Admin'}
                        </span>
                    </button>
                 )}

                 <button onClick={onLogout} className="w-full flex items-center space-x-3 space-x-reverse p-3 rounded-lg text-right transition-colors text-red-500 hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    <span className="font-semibold">{strings.logout}</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminNav;
