
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { arStrings, enStrings } from '../localization';
import { JOD_TO_USD_RATE } from '../constants';
import { 
    Page, Currency, Language, SiteContent, HeroSlide, Teacher, Testimonial, Course, BlogPost, 
    OnboardingOptions, UserProfile, Payment, StaffMember, DashboardView 
} from '../types';

import Header from './Header';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorks from './HowItWorks';
import TeacherSearch from './TeacherSearch';
import TestimonialsSection from './TestimonialsSection';
import CoursesPreview from './CoursesPreview';
import AILessonPlanner from './AILessonPlanner';
import Footer from './Footer';
import AuthModal from './AuthModal';
import OnboardingWizard from './OnboardingWizard';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import TeacherProfilePage from './TeacherProfilePage';
import CourseProfilePage from './CourseProfilePage';
import PaymentPage from './PaymentPage';
import CoursesPage from './CoursesPage';
import VideosPage from './VideosPage';
import ShortPlayerPage from './ShortPlayerPage';
import BlogPage from './BlogPage';
import ArticlePage from './ArticlePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import FAQPage from './FAQPage';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsPage from './TermsPage';
import Chatbot from './Chatbot';
import WelcomeModal from './WelcomeModal';
import PaymentRefundPage from './PaymentRefundPage';

import { initialData } from '../mockData';
import { 
    fetchPublicData,
    fetchAdminData,
    overwriteCollection, 
    updateConfig, 
    auth,
    db,
    onAuthStateChangedListener,
    setDocument
} from '../googleSheetService';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [isEnglishAdmin, setIsEnglishAdmin] = useState<boolean>(false);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [showLangConfirm, setShowLangConfirm] = useState(false);
    const [language, setLanguage] = useState<Language>('ar');
    const [strings, setStrings] = useState(arStrings);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currency, setCurrency] = useState<Currency>('JOD');
    
    // Data State
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>(initialData.teachers);
    const [courses, setCourses] = useState<Course[]>(initialData.courses);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData.blogPosts);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialData.heroSlides);
    const [siteContent, setSiteContent] = useState<SiteContent>(initialData.siteContent);
    const [siteContentEn, setSiteContentEn] = useState<SiteContent>(initialData.siteContent); 
    const [onboardingOptions, setOnboardingOptions] = useState<OnboardingOptions>(initialData.onboardingOptions);
    
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // --- نظام التمرير للأعلى عند تغيير الصفحة (Scroll to Top) ---
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [page, selectedId]);

    const parseHash = useCallback(() => {
        const hash = window.location.hash.replace('#/', '');
        if (!hash) {
            setPage('home');
            setSelectedId(null);
            return;
        }

        const parts = hash.split('/');
        const route = parts[0] as Page;
        const id = parts[1] || null;

        const routeMap: Record<string, Page> = {
            'course': 'course-profile',
            'teacher': 'teacher-profile',
            'article': 'article',
            'short': 'short-player'
        };

        const finalPage = routeMap[route] || route;
        setPage(finalPage as Page);
        setSelectedId(id);
    }, []);

    useEffect(() => {
        window.addEventListener('hashchange', parseHash);
        parseHash();
        return () => window.removeEventListener('hashchange', parseHash);
    }, [parseHash]);

    const handleNavigate = (newPage: Page, id: string | null = null) => {
        const reverseMap: Record<string, string> = {
            'course-profile': 'course',
            'teacher-profile': 'teacher',
            'article': 'article',
            'short-player': 'short'
        };

        const routeName = reverseMap[newPage] || newPage;
        const hash = id ? `#/${routeName}/${id}` : `#/${routeName}`;
        
        if (newPage === 'home') {
            window.location.hash = '#/';
        } else {
            window.location.hash = hash;
        }
    };

    const handleCurrencyChange = () => {
        setCurrency(current => {
            if (current === 'JOD') return 'USD';
            if (current === 'USD') return 'SAR';
            return 'JOD';
        });
    };

    const displayedCourses = useMemo(() => {
        if (language === 'ar') return courses;
        return courses.map(c => ({
            ...c,
            title: c.title_en || c.title,
            description: c.description_en || c.description,
            teacher: c.teacher_en || c.teacher,
            level: c.level_en || c.level,
            category: c.category_en || c.category,
            curriculum: c.curriculum_en || c.curriculum,
            duration: c.duration_en || c.duration,
            includedSubjects: c.includedSubjects_en || c.includedSubjects
        }));
    }, [courses, language]);

    const displayedTeachers = useMemo(() => {
        if (language === 'ar') return teachers;
        return teachers.map(t => ({
            ...t,
            name: t.name_en || t.name,
            level: t.level_en || t.level,
            bio: t.bio_en || t.bio,
            specialties: t.specialties_en || t.specialties,
            qualifications: t.qualifications_en || t.qualifications,
        }));
    }, [teachers, language]);

    const currentSiteContent = useMemo(() => {
        return language === 'en' ? siteContentEn : siteContent;
    }, [language, siteContent, siteContentEn]);

    useEffect(() => {
        const loadData = async () => {
            setIsDataLoading(true);
            const response = await fetchPublicData();
            if(response.success){
                setTeachers(response.data.teachers || []);
                setCourses(response.data.courses || []);
                setTestimonials(response.data.testimonials || []);
                setBlogPosts(response.data.blog || []);
                setHeroSlides(response.data.heroSlides || []);
                if (response.data.config) {
                    if (response.data.config.siteContent) setSiteContent(response.data.config.siteContent);
                    if (response.data.config.siteContentEn) setSiteContentEn(response.data.config.siteContentEn);
                    if (response.data.config.onboardingOptions) setOnboardingOptions(response.data.config.onboardingOptions);
                }
            }
            setIsDataLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (user) {
                setIsLoggedIn(true);
                const email = user.email?.toLowerCase() || '';
                if (email === 'admin@jotutor.com' || email === 'eng@jotutor.com') {
                    setIsAdmin(true);
                    setIsSuperAdmin(email === 'admin@jotutor.com');
                    if (email === 'eng@jotutor.com') {
                        setIsEnglishAdmin(true);
                        setLanguage('en'); setStrings(enStrings);
                    }
                    const response = await fetchAdminData();
                    if(response.success) {
                        setUsers(response.data.Users || []);
                        setStaff(response.data.Staff || []);
                        setPayments(response.data.Payments || []);
                    }
                } else if (db) {
                    const userDoc = await db.collection('users').doc(user.uid).get();
                    if (userDoc.exists) setUserProfile({ ...userDoc.data(), id: user.uid } as UserProfile);
                }
            } else {
                setIsLoggedIn(false); setIsAdmin(false); setUserProfile(null);
            }
            setIsAuthLoading(false);
        });
        return unsubscribe;
    }, []);

    const performLanguageChange = () => {
        const nextLang = language === 'ar' ? 'en' : 'ar';
        setLanguage(nextLang);
        setStrings(nextLang === 'ar' ? arStrings : enStrings);
    };

    const handleSetSiteContent = (newVal: React.SetStateAction<SiteContent>) => {
        if (isEnglishAdmin) {
            const updated = typeof newVal === 'function' ? (newVal as any)(siteContentEn) : newVal;
            setSiteContentEn(updated);
            updateConfig({ siteContentEn: updated }).catch(e => console.error("Error saving EN config:", e));
        } else {
            const updated = typeof newVal === 'function' ? (newVal as any)(siteContent) : newVal;
            setSiteContent(updated);
            updateConfig({ siteContent: updated }).catch(e => console.error("Error saving AR config:", e));
        }
    };

    const handleSetOnboardingOptions = (newVal: React.SetStateAction<OnboardingOptions>) => {
        const updated = typeof newVal === 'function' ? newVal(onboardingOptions) : newVal;
        setOnboardingOptions(updated);
        updateConfig({ onboardingOptions: updated }).catch(e => console.error("Error saving onboarding options:", e));
    };

    const handleUpdateProfile = async (updatedProfile: UserProfile) => {
        try {
            await setDocument('Users', updatedProfile.id, updatedProfile);
            setUserProfile(updatedProfile);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const renderContent = () => {
        if (isDataLoading || isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        
        switch (page) {
            case 'home': return <>
                <HeroSection 
                    onSignupClick={() => setAuthModalOpen(true)} 
                    heroSlides={heroSlides} 
                    strings={strings} 
                    language={language}
                />
                <FeaturesSection content={currentSiteContent.homepage} strings={strings} />
                <HowItWorks content={currentSiteContent.homepage} strings={strings} />
                <TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={onboardingOptions.subjects} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} />
                <CoursesPreview content={currentSiteContent.homepage} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} />
                <TestimonialsSection content={currentSiteContent.homepage} testimonials={testimonials} strings={strings} />
                <AILessonPlanner content={currentSiteContent.homepage} strings={strings} language={language} />
            </>;
            case 'admin-dashboard': return <AdminDashboard onLogout={() => { auth?.signOut(); handleNavigate('home'); }} content={isEnglishAdmin ? siteContentEn : siteContent} setContent={handleSetSiteContent} heroSlides={heroSlides} setHeroSlides={(v: any) => { const u = typeof v === 'function' ? v(heroSlides) : v; setHeroSlides(u); overwriteCollection('HeroSlides', u); }} onboardingOptions={onboardingOptions} setOnboardingOptions={handleSetOnboardingOptions} users={users} setUsers={setUsers} staff={staff} setStaff={setStaff} payments={payments} setPayments={setPayments} teachers={teachers} setTeachers={(v: any) => { const u = typeof v === 'function' ? v(teachers) : v; setTeachers(u); overwriteCollection('Teachers', u); }} courses={courses} setCourses={(v: any) => { const u = typeof v === 'function' ? v(courses) : v; setCourses(u); overwriteCollection('Courses', u); }} testimonials={testimonials} setTestimonials={(v: any) => { const u = typeof v === 'function' ? v(testimonials) : v; setTestimonials(u); overwriteCollection('Testimonials', u); }} blogPosts={blogPosts} setBlogPosts={(v: any) => { const u = typeof v === 'function' ? v(blogPosts) : v; setBlogPosts(u); overwriteCollection('Blog', u); }} subjects={onboardingOptions.subjects} strings={strings} language={language} isEnglishAdmin={isEnglishAdmin} isSuperAdmin={isSuperAdmin} onToggleEnglishMode={() => { const next = !isEnglishAdmin; setIsEnglishAdmin(next); setLanguage(next ? 'en' : 'ar'); setStrings(next ? enStrings : arStrings); }} onActivateCourse={async () => {}} />;
            case 'teachers': return <TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={onboardingOptions.subjects} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'courses': return <CoursesPage courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>;
            case 'blog': return <BlogPage posts={blogPosts.filter(p => p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'videos': return <VideosPage shorts={blogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return <TeacherProfilePage teacher={displayedTeachers.find(t => t.id === selectedId)!} strings={strings} language={language}/>;
            case 'course-profile': return <CourseProfilePage course={displayedCourses.find(c => c.id === selectedId)!} onBook={(id) => handleNavigate('payment', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>;
            case 'payment': return <PaymentPage course={displayedCourses.find(c => c.id === selectedId)!} onEnroll={() => handleNavigate('dashboard')} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>;
            case 'dashboard': return userProfile ? <Dashboard userProfile={userProfile} onLogout={() => { auth?.signOut(); handleNavigate('home'); }} onUpdateProfile={handleUpdateProfile} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language} /> : <div className="py-20 text-center">يرجى تسجيل الدخول أولاً.</div>;
            case 'about': return <AboutPage content={currentSiteContent.about} strings={strings} />;
            case 'contact': return <ContactPage content={currentSiteContent.contact} strings={strings} />;
            case 'faq': return <FAQPage faqs={currentSiteContent.faq} strings={strings} />;
            case 'terms': return <TermsPage content={currentSiteContent.terms} strings={strings} />;
            case 'privacy': return <PrivacyPolicyPage content={currentSiteContent.privacy} strings={strings} />;
            case 'payment-refund': return <PaymentRefundPage content={currentSiteContent.paymentRefundPolicy || ''} strings={strings} />;
            default: return <div className="py-20 text-center">الصفحة المطلوبة غير موجودة.</div>;
        }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            {showWelcomeModal && page === 'home' && <WelcomeModal onStartChat={() => setShowWelcomeModal(false)} onClose={() => setShowWelcomeModal(false)} />}
            <Header onNavigate={handleNavigate} onLoginClick={() => setAuthModalOpen(true)} onSignupClick={() => setShowOnboarding(true)} isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={userProfile?.username || 'Admin'} onLogout={() => auth?.signOut()} currency={currency} onCurrencyChange={handleCurrencyChange} language={language} onLanguageChange={() => setShowLangConfirm(true)} isTranslating={isTranslating} strings={strings} />
            <main className="min-h-[70vh]">{renderContent()}</main>
            <Footer onNavigate={handleNavigate} strings={strings} />
            {isAuthModalOpen && <AuthModal initialView="login" onClose={() => setAuthModalOpen(false)} onLogin={async (e, p) => { try { await auth?.signInWithEmailAndPassword(e, p); setAuthModalOpen(false); return true; } catch { return false; } }} onSwitchToOnboarding={() => { setAuthModalOpen(false); setShowOnboarding(true); }} strings={strings} />}
            {showOnboarding && <div className="fixed inset-0 z-[150] bg-blue-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"><div className="w-full max-w-4xl"><OnboardingWizard options={onboardingOptions} onSignupSuccess={async (p) => { try { const { user } = await auth!.createUserWithEmailAndPassword(p.email, p.password!); await setDocument('Users', user!.uid, { ...p, id: user!.uid, enrolledCourses: [] }); setShowOnboarding(false); handleNavigate('dashboard'); return null; } catch (e:any) { return e.message; } }} onClose={() => setShowOnboarding(false)} strings={strings} language={language} /></div></div>}
            {showLangConfirm && <div className="fixed inset-0 z-[110] flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/60" onClick={() => setShowLangConfirm(false)}></div><div className="relative bg-white rounded-xl p-6 w-full max-w-md"><h3 className="text-xl font-bold mb-4">{strings.langConfirmTitle}</h3><p className="mb-6">{strings.langConfirmMessage}</p><div className="flex flex-col gap-2"><button onClick={() => { performLanguageChange(); setShowLangConfirm(false); }} className="bg-green-500 text-white p-3 rounded-lg font-bold">{strings.langConfirmYes}</button><button onClick={() => setShowLangConfirm(false)} className="bg-gray-100 p-3 rounded-lg font-bold">{strings.langConfirmNo}</button></div></div></div>}
            <Chatbot courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} strings={strings} language={language} isOpen={false} setIsOpen={() => {}} />
        </div>
    );
};

export default App;
