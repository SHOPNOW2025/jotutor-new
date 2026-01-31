
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { translateContent, setGeminiApiKey } from '../services/geminiService';
import { 
    fetchPublicData,
    fetchAdminData,
    overwriteCollection, 
    updateConfig, 
    setDocument,
    auth,
    db,
    onAuthStateChangedListener,
    subscribeToPayments,
} from '../googleSheetService';

const App: React.FC = () => {
    // --- Routing Helpers ---
    const getPathFromState = (page: Page, id: string | null): string => {
        switch (page) {
            case 'home': return '/';
            case 'teachers': return '/teachers';
            case 'teacher-profile': return `/teachers/${id}`;
            case 'courses': return '/courses';
            case 'course-profile': return `/courses/${id}`;
            case 'payment': return `/payment/${id}`;
            case 'videos': return '/videos';
            case 'short-player': return `/videos/${id}`;
            case 'blog': return '/blog';
            case 'article': return `/blog/${id}`;
            case 'about': return '/about';
            case 'contact': return '/contact';
            case 'faq': return '/faq';
            case 'privacy': return '/privacy';
            case 'terms': return '/terms';
            case 'payment-refund': return '/payment-refund';
            case 'dashboard': return '/dashboard';
            case 'admin-dashboard': return '/admin-dashboard';
            default: return '/';
        }
    };

    const getStateFromPath = (path: string): { page: Page, id: string | null } => {
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 0) return { page: 'home', id: null };
        
        const segment = parts[0];
        const id = parts[1] || null;

        switch (segment) {
            case 'teachers': return id ? { page: 'teacher-profile', id } : { page: 'teachers', id: null };
            case 'courses': return id ? { page: 'course-profile', id } : { page: 'courses', id: null };
            case 'payment': return { page: 'payment', id };
            case 'videos': return id ? { page: 'short-player', id } : { page: 'videos', id: null };
            case 'blog': return id ? { page: 'article', id } : { page: 'blog', id: null };
            case 'about': return { page: 'about', id: null };
            case 'contact': return { page: 'contact', id: null };
            case 'faq': return { page: 'faq', id: null };
            case 'privacy': return { page: 'privacy', id: null };
            case 'terms': return { page: 'terms', id: null };
            case 'payment-refund': return { page: 'payment-refund', id: null };
            case 'dashboard': return { page: 'dashboard', id: null };
            case 'admin-dashboard': return { page: 'admin-dashboard', id: null };
            default: return { page: 'home', id: null };
        }
    };

    // --- State Management ---
    const initialRoute = getStateFromPath(window.location.pathname);
    const [page, setPage] = useState<Page>(initialRoute.page);
    const [selectedId, setSelectedId] = useState<string | null>(initialRoute.id);
    const [navHistory, setNavHistory] = useState<{page: Page, id: string | null}[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
    const [isEnglishAdmin, setIsEnglishAdmin] = useState<boolean>(false); // وضع التعديل الإنجليزي
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showLangConfirm, setShowLangConfirm] = useState(false);
    const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
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
    
    // Site Configs
    const [siteContent, setSiteContent] = useState<SiteContent>(initialData.siteContent);
    const [siteContentEn, setSiteContentEn] = useState<SiteContent>(initialData.siteContent); // داتا بيس منفصلة
    const [onboardingOptions, setOnboardingOptions] = useState<OnboardingOptions>(initialData.onboardingOptions);
    
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [initialDashboardView, setInitialDashboardView] = useState<DashboardView | undefined>();

    // Sync state with browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const { page: newPage, id: newId } = getStateFromPath(window.location.pathname);
            setPage(newPage);
            setSelectedId(newId);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // الحوسبة الديناميكية للعناصر بناءً على اللغة المفعلة للمستخدم
    const displayedCourses = useMemo(() => {
        if (language === 'ar') return courses.filter(c => c.title);
        return courses
            .filter(c => c.title_en)
            .map(c => ({
                ...c,
                title: c.title_en!,
                description: c.description_en || c.description,
                level: c.level_en || c.level,
                category: c.category_en || c.category,
                curriculum: c.curriculum_en || c.curriculum,
                duration: c.duration_en || c.duration,
                includedSubjects: c.includedSubjects_en || c.includedSubjects
            }));
    }, [courses, language]);

    const displayedTeachers = useMemo(() => {
        if (language === 'ar') return teachers.filter(t => t.name);
        return teachers
            .filter(t => t.name_en)
            .map(t => ({
                ...t,
                name: t.name_en!,
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
        const loadPublicData = async () => {
            setIsDataLoading(true);
            try {
                const response = await fetchPublicData();
                if(response.success){
                    const data = response.data;
                    setTeachers(data.teachers || []);
                    setCourses(data.courses || []);
                    setTestimonials(data.testimonials || []);
                    setBlogPosts(data.blog || []);
                    setHeroSlides(data.heroSlides || []);
                    if (data.config) {
                        if (data.config.siteContent) setSiteContent(data.config.siteContent);
                        if (data.config.siteContentEn) setSiteContentEn(data.config.siteContentEn);
                        if (data.config.onboardingOptions) setOnboardingOptions(data.config.onboardingOptions);
                        if (data.config.siteContent?.geminiApiKey) setGeminiApiKey(data.config.siteContent.geminiApiKey);
                    }
                    setError(null);
                }
            } catch (e: any) {
                console.warn("Offline/Fail mode:", e.message);
                setError("Failed to load live data.");
            } finally {
                setIsDataLoading(false);
            }
        };
        loadPublicData();
    }, []);

    useEffect(() => {
        let isMounted = true;
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (!isMounted) return;
            if (user) {
                setIsLoggedIn(true);
                const email = user.email ? user.email.toLowerCase() : '';
                if (email === 'admin@jotutor.com' || email === 'eng@jotutor.com') {
                    setIsAdmin(true);
                    setIsSuperAdmin(email === 'admin@jotutor.com');
                    // إذا دخل الموظف الإنجليزي، نفعّل وضع الإنجليزي تلقائياً
                    if (email === 'eng@jotutor.com') {
                        setIsEnglishAdmin(true);
                        setLanguage('en');
                        setStrings(enStrings);
                    }
                    const response = await fetchAdminData();
                    if(response.success) {
                        setUsers(response.data.users || []);
                        setStaff(response.data.staff || []);
                        setPayments(response.data.payments || []);
                    }
                } else {
                    if (db) {
                        const userDoc = await db.collection('users').doc(user.uid).get();
                        if (userDoc.exists) setUserProfile({ ...userDoc.data(), id: user.uid } as UserProfile);
                    }
                }
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setUserProfile(null);
            }
            setIsAuthLoading(false);
        });
        return () => { isMounted = false; unsubscribe(); };
    }, []);

    // الحفظ الذكي: إذا كنا في وضع الإنجليزي، نحدث siteContentEn فقط
    const handleSetSiteContent = (newContent: React.SetStateAction<SiteContent>) => {
         if (isEnglishAdmin) {
             const updated = typeof newContent === 'function' ? newContent(siteContentEn) : newContent;
             setSiteContentEn(updated);
             updateConfig({ siteContentEn: updated });
         } else {
             const updated = typeof newContent === 'function' ? newContent(siteContent) : newContent;
             setSiteContent(updated);
             updateConfig({ siteContent: updated });
         }
    };

    const handleSetOnboardingOptions = (newOptions: React.SetStateAction<OnboardingOptions>) => {
        const updated = typeof newOptions === 'function' ? newOptions(onboardingOptions) : newOptions;
        setOnboardingOptions(updated);
        updateConfig({ onboardingOptions: updated });
    };

    const handleSetTeachers = (newVal: React.SetStateAction<Teacher[]>) => {
        const updated = typeof newVal === 'function' ? newVal(teachers) : newVal;
        setTeachers(updated);
        overwriteCollection('Teachers', updated);
    };

    const handleSetCourses = (newVal: React.SetStateAction<Course[]>) => {
        const updated = typeof newVal === 'function' ? newVal(courses) : newVal;
        setCourses(updated);
        overwriteCollection('Courses', updated);
    };

    const handleNavigate = (newPage: Page, id: string | null = null) => {
        if (page === newPage && selectedId === id) return;
        const newPath = getPathFromState(newPage, id);
        window.history.pushState({ page: newPage, id }, '', newPath);
        setNavHistory(prev => [...prev, { page, id: selectedId }]);
        setPage(newPage);
        setSelectedId(id);
        window.scrollTo(0, 0);
    };

    // Fix: Added handleLogin implementation to handle authentication and navigation.
    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        if (!auth) return false;
        try {
            await auth.signInWithEmailAndPassword(email, password);
            setAuthModalOpen(false);
            if (email.toLowerCase() === 'admin@jotutor.com' || email.toLowerCase() === 'eng@jotutor.com') {
                handleNavigate('admin-dashboard');
            } else {
                handleNavigate('dashboard');
            }
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const handleLogout = () => {
        if (auth) auth.signOut();
        handleNavigate('home');
    };

    // Fix: Added performLanguageChange to handle the language switching logic safely.
    const performLanguageChange = async () => {
        const targetLanguage = language === 'ar' ? 'en' : 'ar';
        if (targetLanguage === 'ar') {
            setLanguage('ar'); 
            setStrings(arStrings); 
            return;
        }
        setIsTranslating(true);
        try {
            // Baseline language switch
            setLanguage('en');
            setStrings(enStrings);
        } catch (error) {
            console.error("Failed to change language", error);
            setStrings(enStrings);
            setLanguage('en');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleToggleEnglishAdminMode = () => {
        if (!isSuperAdmin) return;
        const nextMode = !isEnglishAdmin;
        setIsEnglishAdmin(nextMode);
        if (nextMode) {
            setLanguage('en'); setStrings(enStrings);
        } else {
            setLanguage('ar'); setStrings(arStrings);
        }
    };

    const renderContent = () => {
        if (isDataLoading || isAuthLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        if (showOnboarding) return <div className="container mx-auto px-6 py-12 max-w-4xl"><OnboardingWizard options={onboardingOptions} onSignupSuccess={() => Promise.resolve(null)} onClose={() => setShowOnboarding(false)} strings={strings} language={language} /></div>;
        
        const selectedTeacher = displayedTeachers.find(t => t.id === selectedId);
        const selectedCourse = displayedCourses.find(c => c.id === selectedId);

        switch (page) {
            case 'home': return <><HeroSection onSignupClick={() => setAuthModalOpen(true)} heroSlides={heroSlides} content={currentSiteContent.homepage} strings={strings} /><FeaturesSection content={currentSiteContent.homepage} strings={strings} /><HowItWorks content={currentSiteContent.homepage} strings={strings} /><TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={onboardingOptions.subjects} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} /><CoursesPreview content={currentSiteContent.homepage} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} /><TestimonialsSection content={currentSiteContent.homepage} testimonials={testimonials} strings={strings} /><AILessonPlanner content={currentSiteContent.homepage} strings={strings} language={language} /></>;
            case 'admin-dashboard': return <AdminDashboard onLogout={handleLogout} content={isEnglishAdmin ? siteContentEn : siteContent} setContent={handleSetSiteContent} heroSlides={heroSlides} setHeroSlides={(val) => {const u = typeof val === 'function' ? val(heroSlides) : val; setHeroSlides(u); overwriteCollection('HeroSlides', u);}} onboardingOptions={onboardingOptions} setOnboardingOptions={handleSetOnboardingOptions} users={users} setUsers={setUsers} staff={staff} setStaff={setStaff} payments={payments} setPayments={setPayments} teachers={teachers} setTeachers={handleSetTeachers} courses={courses} setCourses={handleSetCourses} subjects={onboardingOptions.subjects} testimonials={testimonials} setTestimonials={(val) => {const u = typeof val === 'function' ? val(testimonials) : val; setTestimonials(u); overwriteCollection('Testimonials', u);}} blogPosts={blogPosts} setBlogPosts={(val) => {const u = typeof val === 'function' ? val(blogPosts) : val; setBlogPosts(u); overwriteCollection('Blog', u);}} onActivateCourse={() => Promise.resolve()} strings={strings} language={language} isEnglishAdmin={isEnglishAdmin} isSuperAdmin={isSuperAdmin} onToggleEnglishMode={handleToggleEnglishAdminMode} />;
            case 'teachers': return <TeacherSearch content={currentSiteContent.homepage} teachers={displayedTeachers} subjects={onboardingOptions.subjects} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <div className="py-20 text-center">Teacher not found.</div>;
            case 'courses': return <CoursesPage courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>;
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={(id) => handleNavigate('payment', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <div className="py-20 text-center">Course not found.</div>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} onEnroll={() => {}} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <div className="py-20 text-center">Course not found.</div>;
            case 'dashboard': return userProfile ? <Dashboard userProfile={userProfile} onLogout={handleLogout} onUpdateProfile={async () => true} courses={displayedCourses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language} initialView={initialDashboardView} onViewHandled={() => setInitialDashboardView(undefined)} /> : <div className="py-20 text-center">Please log in.</div>;
            case 'about': return <AboutPage content={currentSiteContent.about} strings={strings} />;
            case 'contact': return <ContactPage content={currentSiteContent.contact} strings={strings} />;
            case 'faq': return <FAQPage faqs={currentSiteContent.faq} strings={strings} />;
            case 'privacy': return <PrivacyPolicyPage content={currentSiteContent.privacy} strings={strings} />;
            case 'terms': return <TermsPage content={currentSiteContent.terms} strings={strings} />;
            case 'payment-refund': return <PaymentRefundPage content={currentSiteContent.paymentRefundPolicy || ''} strings={strings} />;
            case 'videos': return <VideosPage shorts={blogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return <ShortPlayerPage post={blogPosts.find(p => p.id === selectedId)!} onBack={() => handleNavigate('videos')} strings={strings} language={language}/>;
            case 'blog': return <BlogPage posts={blogPosts.filter(p => p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return <ArticlePage post={blogPosts.find(p => p.id === selectedId)!} onBack={() => handleNavigate('blog')} strings={strings} language={language}/>;
            default: return <div className="py-20 text-center">صفحة قيد التطوير أو غير موجودة.</div>;
        }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            {showWelcomeModal && <WelcomeModal onStartChat={() => setShowWelcomeModal(false)} onClose={() => setShowWelcomeModal(false)} />}
            <Header 
                onNavigate={handleNavigate} 
                onLoginClick={() => setAuthModalOpen(true)} 
                onSignupClick={() => setAuthModalOpen(true)} 
                isLoggedIn={isLoggedIn} 
                isAdmin={isAdmin} 
                username={isAdmin ? (isEnglishAdmin ? 'English Admin' : 'Admin') : userProfile?.username} 
                onLogout={handleLogout} 
                currency={currency} 
                onCurrencyChange={() => setCurrency(c => c === 'JOD' ? 'USD' : 'JOD')} 
                language={language} 
                onLanguageChange={() => setShowLangConfirm(true)} 
                isTranslating={isTranslating} 
                strings={strings} 
            />
            <main>{renderContent()}</main>
            <Footer onNavigate={handleNavigate} strings={strings} />
            {isAuthModalOpen && <AuthModal initialView="login" onClose={() => setAuthModalOpen(false)} onLogin={handleLogin} onSwitchToOnboarding={() => {setAuthModalOpen(false); setShowOnboarding(true);}} strings={strings} />}
            {showLangConfirm && <div className="fixed inset-0 z-[110] flex items-center justify-center px-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLangConfirm(false)}></div><div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6"><div className="text-center mb-6"><h3 className="text-xl font-bold text-blue-900 mb-4">{strings.langConfirmTitle}</h3><p className="text-gray-600 leading-relaxed">{strings.langConfirmMessage}</p></div><div className="flex flex-col gap-3"><button onClick={() => {performLanguageChange(); setShowLangConfirm(false);}} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">{strings.langConfirmYes}</button><button onClick={() => setShowLangConfirm(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg">{strings.langConfirmNo}</button></div></div></div>}
        </div>
    );
};

export default App;
