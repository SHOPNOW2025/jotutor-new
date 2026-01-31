
import React, { useState, useEffect } from 'react';
import { UserProfile, Course, Currency, Language, DashboardView } from '../types';
import DashboardNav from './dashboard/DashboardNav';
import ProfileView from './dashboard/Profile';
import CoursesView from './dashboard/Courses';
import WalletView from './dashboard/Wallet';
import AIAssistantView from './dashboard/AIAssistant';

interface DashboardProps {
    userProfile: UserProfile;
    onLogout: () => void;
    onUpdateProfile: (updatedProfile: UserProfile) => Promise<boolean>;
    initialView?: DashboardView;
    onViewHandled?: () => void; // Callback to signal that the initial view has been handled
    courses: Course[];
    onSelectCourse: (id: string) => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
    language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    userProfile, 
    onLogout, 
    onUpdateProfile,
    initialView = 'profile',
    onViewHandled,
    courses,
    onSelectCourse,
    currency,
    exchangeRate,
    strings,
    language
}) => {
    const [activeView, setActiveView] = useState<DashboardView>(initialView);

    useEffect(() => {
        // This effect runs once on mount to reset the initial view state in the parent App component.
        // This ensures that subsequent navigation to the dashboard defaults to the profile view.
        if (onViewHandled) {
            onViewHandled();
        }
    }, [onViewHandled]);

    const renderContent = () => {
        switch (activeView) {
            case 'profile':
                return <ProfileView userProfile={userProfile} onUpdate={onUpdateProfile} />;
            case 'courses':
                return <CoursesView 
                            userProfile={userProfile} 
                            allCourses={courses}
                            onSelectCourse={onSelectCourse}
                            currency={currency}
                            exchangeRate={exchangeRate}
                            strings={strings}
                        />;
            case 'wallet':
                return <WalletView />;
            case 'ai-assistant':
                return <AIAssistantView />;
            default:
                return <ProfileView userProfile={userProfile} onUpdate={onUpdateProfile} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <DashboardNav 
                        username={userProfile.username} 
                        activeView={activeView} 
                        setActiveView={setActiveView} 
                        onLogout={onLogout}
                        strings={strings}
                    />
                    <main className="flex-1">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
