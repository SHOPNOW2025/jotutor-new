





import React, { useState, useEffect, useCallback } from 'react';
import { arStrings, enStrings } from '../localization';
import { JOD_TO_USD_RATE } from '../constants';
// Fix: Imported DashboardView from types.ts to resolve module error.
import { 
    Page, Currency, Language, SiteContent, HeroSlide, Teacher, Testimonial, Course, BlogPost, 
    OnboardingOptions, UserProfile, Payment, StaffMember, DashboardView 
} from '../types';

// Component Imports
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
// Fix: Removed DashboardView from this import as it's now imported from types.ts.
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

// Data and Services
import { initialData } from '../mockData';
import { translateContent } from '../services/geminiService';
// Fix: Use Firebase v8 compat imports and syntax to resolve module errors.
import { 
    fetchPublicData,
    fetchAdminData,
    overwriteCollection, 
    updateConfig, 
    setDocument,
    auth,
    db,
    onAuthStateChangedListener,
} from '../googleSheetService'; // This is now firebaseService.ts


const App: React.FC = () => {
    // === STATE MANAGEMENT ===
    const [page, setPage] = useState<Page>('home');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // Modals
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Localization & Currency
    const [language, setLanguage] = useState<Language>('ar');
    const [strings, setStrings] = useState(arStrings);
    const [isTranslating, setIsTranslating] = useState(false);
    const [currency, setCurrency] = useState<Currency>('JOD');

    // Data State (initialized with mock data, loaded from Firebase)
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>(initialData.teachers);
    const [courses, setCourses] = useState<Course[]>(initialData.courses);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialData.testimonials);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialData.blogPosts);
    const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(initialData.heroSlides);
    const [siteContent, setSiteContent] = useState<SiteContent>(initialData.siteContent);
    const [onboardingOptions, setOnboardingOptions] = useState<OnboardingOptions>(initialData.onboardingOptions);

    // Loading & Error State
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for one-time dashboard view redirect
    const [initialDashboardView, setInitialDashboardView] = useState<DashboardView | undefined>();

    // === DATA FETCHING ON MOUNT ===
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
                    if (data.config?.siteContent) setSiteContent(data.config.siteContent);
                    if (data.config?.onboardingOptions) setOnboardingOptions(data.config.onboardingOptions);
                    setError(null);
                } else {
                     throw new Error("Failed to fetch public data from Firebase");
                }
            } catch (e: any) {
                console.error("Failed to load public data from Firebase:", e.message);
                setError("Failed to load public data from Firebase. Displaying sample data instead. Please check your Firebase security rules to allow public read access.");
                // Fallback to mock data on error is handled by initial state
            } finally {
                setIsDataLoading(false);
            }
        };

        loadPublicData();
    }, []);

    // === AUTHENTICATION STATE LISTENER ===
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener(async (user) => {
            if (user) {
                setIsLoggedIn(true);
                if (user.email === 'admin@jotutor.com') {
                    setIsAdmin(true);
                    setUserProfile(null);
                    
                    // Fetch admin-specific data
                    const response = await fetchAdminData();
                    const data = response.data; // Data can be partial, so we always set it.
                    setUsers(data.users || []);
                    setStaff(data.staff || []);
                    setPayments(data.payments || []);

                    if (!response.success && response.failedCollections && response.failedCollections.length > 0) {
                        const failedList = response.failedCollections.join(', ');
                        const exampleCollection = response.failedCollections[0];
                        const errorMessage = `Failed to load admin data for the following sections due to Firestore permissions: ${failedList}. Please ensure your Firestore Security Rules allow the admin ('admin@jotutor.com') to read these collections. For example, the rule for '${exampleCollection}' should be: match /${exampleCollection}/{docId} { allow read, write: if request.auth.token.email == 'admin@jotutor.com'; }`;
                        setError(errorMessage);
                        console.error(errorMessage);
                    } else {
                        setError(null); // Clear previous errors on full success
                    }

                } else {
                    // Fix: Use Firebase v8 compat syntax to resolve module errors.
                    const userDocRef = db.collection('users').doc(user.uid);
                    const userDocSnap = await userDocRef.get();
                    if (userDocSnap.exists) {
                        setUserProfile({ ...userDocSnap.data(), id: user.uid } as UserProfile);
                    }
                    setIsAdmin(false);
                }
            } else {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setUserProfile(null);
            }
            setIsAuthLoading(false);
        });

        return unsubscribe; // Cleanup on unmount
    }, []);
    

    // === PERSISTENCE WRAPPERS (Saves state to Firestore) ===
    const handleSetUsers = (newUsers: React.SetStateAction<UserProfile[]>) => {
        const updatedUsers = typeof newUsers === 'function' ? newUsers(users) : newUsers;
        setUsers(updatedUsers);
        overwriteCollection('Users', updatedUsers).catch(e => console.error("Failed to save users:", e));
    };
    const handleSetStaff = (newStaff: React.SetStateAction<StaffMember[]>) => {
        const updatedStaff = typeof newStaff === 'function' ? newStaff(staff) : newStaff;
        setStaff(updatedStaff);
        overwriteCollection('Staff', updatedStaff).catch(e => console.error("Failed to save staff:", e));
    };
    const handleSetTeachers = (newTeachers: React.SetStateAction<Teacher[]>) => {
        const updatedTeachers = typeof newTeachers === 'function' ? newTeachers(teachers) : newTeachers;
        setTeachers(updatedTeachers);
        overwriteCollection('Teachers', updatedTeachers).catch(e => console.error("Failed to save teachers:", e));
    };
    const handleSetCourses = (newCourses: React.SetStateAction<Course[]>) => {
        const updatedCourses = typeof newCourses === 'function' ? newCourses(courses) : newCourses;
        setCourses(updatedCourses);
        overwriteCollection('Courses', updatedCourses).catch(e => console.error("Failed to save courses:", e));
    };
    const handleSetTestimonials = (newTestimonials: React.SetStateAction<Testimonial[]>) => {
        const updatedTestimonials = typeof newTestimonials === 'function' ? newTestimonials(testimonials) : newTestimonials;
        setTestimonials(updatedTestimonials);
        overwriteCollection('Testimonials', updatedTestimonials).catch(e => console.error("Failed to save testimonials:", e));
    };
     const handleSetBlogPosts = (newPosts: React.SetStateAction<BlogPost[]>) => {
        const updatedPosts = typeof newPosts === 'function' ? newPosts(blogPosts) : newPosts;
        setBlogPosts(updatedPosts);
        overwriteCollection('Blog', updatedPosts).catch(e => console.error("Failed to save blog posts:", e));
    };
    const handleSetHeroSlides = (newSlides: React.SetStateAction<HeroSlide[]>) => {
        const updatedSlides = typeof newSlides === 'function' ? newSlides(heroSlides) : newSlides;
        setHeroSlides(updatedSlides);
        overwriteCollection('HeroSlides', updatedSlides).catch(e => console.error("Failed to save hero slides:", e));
    };
    const handleSetConfig = (newContent?: SiteContent, newOptions?: OnboardingOptions) => {
        const finalContent = newContent || siteContent;
        const finalOptions = newOptions || onboardingOptions;
        if (finalContent) setSiteContent(finalContent);
        if (finalOptions) setOnboardingOptions(finalOptions);
        updateConfig({ siteContent: finalContent, onboardingOptions: finalOptions })
            .catch(e => console.error("Failed to save config:", e));
    };
     const handleSetSiteContent = (newContent: React.SetStateAction<SiteContent>) => {
        const updatedContent = typeof newContent === 'function' ? newContent(siteContent!) : newContent;
        if (updatedContent) {
          handleSetConfig(updatedContent, undefined);
        }
    };
    const handleSetOnboardingOptions = (newOptions: React.SetStateAction<OnboardingOptions>) => {
        const updatedOptions = typeof newOptions === 'function' ? newOptions(onboardingOptions!) : newOptions;
        if(updatedOptions) {
          handleSetConfig(undefined, updatedOptions);
        }
    };

    // === EFFECTS ===
    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    // === NAVIGATION & AUTH HANDLERS ===
    const handleNavigate = (newPage: Page, id: string | null = null) => {
        setPage(newPage);
        setSelectedId(id);
        window.scrollTo(0, 0);
    };

    const handleLogin = async (email: string, password: string): Promise<boolean> => {
        try {
            // Fix: Use Firebase v8 compat syntax to resolve module errors.
            await auth.signInWithEmailAndPassword(email, password);
            setAuthModalOpen(false);
            if (email.toLowerCase() === 'admin@jotutor.com') {
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
        // Fix: Use Firebase v8 compat syntax to resolve module errors.
        auth.signOut();
        handleNavigate('home');
    };
    
    const handleSignupSuccess = async (profile: UserProfile): Promise<string | null> => {
        if (!profile.email || !profile.password) {
            console.error("Email or password missing for signup.");
            return "Email or password missing for signup.";
        }
    
        try {
            // Fix: Use Firebase v8 compat syntax to resolve module errors.
            const { user } = await auth.createUserWithEmailAndPassword(profile.email, profile.password);
            
            const { password, ...profileData } = profile;
            const finalProfile = { ...profileData, id: user!.uid, enrolledCourses: [] };
    
            await setDocument('Users', user!.uid, finalProfile);
            
            // The onAuthStateChanged listener will handle setting the user profile and login state.
            setShowOnboarding(false);
            setInitialDashboardView('courses'); // Set the initial view for the dashboard
            handleNavigate('dashboard');
            return null; // Return null on success
        } catch (error: any) {
            console.error("Error during signup process:", error);
            if (error.code === 'auth/email-already-in-use') {
                return strings.errorEmailInUse;
            }
            return strings.errorSignupGeneric;
        }
    };

    const handleEnrollInCourse = async (course: Course) => {
        if (!userProfile) {
            alert("Please log in to enroll in a course.");
            setAuthModalOpen(true);
            return;
        }

        try {
            // 1. Update user profile with new course
            const currentEnrolled = userProfile.enrolledCourses || [];
            if (currentEnrolled.includes(course.id)) {
                alert("You are already enrolled in this course.");
                handleNavigate('dashboard');
                return;
            }
            const updatedProfile: UserProfile = {
                ...userProfile,
                enrolledCourses: [...currentEnrolled, course.id]
            };
            await setDocument('Users', userProfile.id, updatedProfile);
            setUserProfile(updatedProfile); // Update local state immediately

            // 2. Create a payment record for admin tracking
            const newPayment: Payment = {
                id: `${userProfile.id}-${course.id}-${Date.now()}`,
                date: new Date().toISOString(),
                userId: userProfile.id,
                userName: userProfile.username,
                courseId: course.id,
                courseName: course.title,
                amount: course.price,
                currency: 'JOD',
                status: 'Success'
            };
            await setDocument('Payments', newPayment.id, newPayment);

            // 3. Provide feedback and navigate
            alert(`${strings.paymentSuccess} You have enrolled in ${course.title}.`);
            handleNavigate('dashboard');

        } catch (error) {
            console.error("Error enrolling in course:", error);
            alert("There was an error enrolling you in the course. Please try again.");
        }
    };

    const handleLanguageChange = async () => {
        const targetLanguage = language === 'ar' ? 'en' : 'ar';
        if (targetLanguage === 'ar') {
            setLanguage('ar'); setStrings(arStrings); return;
        }
        setIsTranslating(true);
        try {
            const translatedStrings = await translateContent(arStrings, 'English');
            setStrings(translatedStrings);
            setLanguage('en');
        } catch (error) {
            console.error("Failed to translate content", error);
            setStrings(enStrings);
            setLanguage('en');
        } finally {
            setIsTranslating(false);
        }
    };

    // === RENDER LOGIC ===
    const renderContent = () => {
        if (isDataLoading || isAuthLoading) {
            return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div></div>;
        }

        if (showOnboarding) {
             return (
                 <div className="container mx-auto px-6 py-12 max-w-4xl">
                     <OnboardingWizard options={onboardingOptions!} onSignupSuccess={handleSignupSuccess} strings={strings}/>
                </div>
            );
        }
        
        const selectedTeacher = teachers.find(t => t.id === selectedId);
        const selectedCourse = courses.find(c => c.id === selectedId);
        const selectedPost = blogPosts.find(p => p.id === selectedId);

        switch (page) {
            case 'home': return (
                <>
                    <HeroSection onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }} heroSlides={heroSlides} strings={strings} />
                    <FeaturesSection content={siteContent.homepage} strings={strings} />
                    <HowItWorks content={siteContent.homepage} strings={strings} />
                    <TeacherSearch content={siteContent.homepage} teachers={teachers} subjects={onboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} isHomePageVersion={true} strings={strings} language={language} />
                    <CoursesPreview content={siteContent.homepage} courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} onNavigate={handleNavigate} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} />
                    <TestimonialsSection content={siteContent.homepage} testimonials={testimonials} strings={strings} />
                    <AILessonPlanner content={siteContent.homepage} strings={strings} language={language} />
                </>
            );
            case 'teachers': return <TeacherSearch content={siteContent.homepage} teachers={teachers} subjects={onboardingOptions?.subjects || []} onSelectTeacher={(id) => handleNavigate('teacher-profile', id)} strings={strings} language={language}/>;
            case 'teacher-profile': return selectedTeacher ? <TeacherProfilePage teacher={selectedTeacher} strings={strings} language={language}/> : <p>Teacher not found.</p>;
            
            case 'courses': return <CoursesPage courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/>
            case 'course-profile': return selectedCourse ? <CourseProfilePage course={selectedCourse} onBook={(id) => handleNavigate('payment', id)} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;
            case 'payment': return selectedCourse ? <PaymentPage course={selectedCourse} onEnroll={handleEnrollInCourse} currency={currency} exchangeRate={JOD_TO_USD_RATE} strings={strings} language={language}/> : <p>Course not found.</p>;

            case 'videos': return <VideosPage shorts={blogPosts.filter(p => p.type === 'short')} onSelectShort={(id) => handleNavigate('short-player', id)} strings={strings} language={language}/>;
            case 'short-player': return selectedPost ? <ShortPlayerPage post={selectedPost} onBack={() => handleNavigate('videos')} strings={strings} language={language}/> : <p>Video not found.</p>;
            
            case 'blog': return <BlogPage posts={blogPosts.filter(p=> p.type === 'article')} onSelectPost={(id) => handleNavigate('article', id)} strings={strings} language={language}/>;
            case 'article': return selectedPost ? <ArticlePage post={selectedPost} onBack={() => handleNavigate('blog')} strings={strings} language={language}/> : <p>Article not found.</p>;

            case 'about': return siteContent ? <AboutPage content={siteContent.about} strings={strings} /> : null;
            case 'contact': return siteContent ? <ContactPage content={siteContent.contact} strings={strings} /> : null;
            case 'faq': return siteContent ? <FAQPage faqs={siteContent.faq} strings={strings} /> : null;
            case 'privacy': return siteContent ? <PrivacyPolicyPage content={siteContent.privacy} strings={strings} /> : null;
            case 'terms': return siteContent ? <TermsPage content={siteContent.terms} strings={strings} /> : null;

            case 'dashboard': return userProfile ? (
                <Dashboard 
                    userProfile={userProfile} 
                    onLogout={handleLogout} 
                    courses={courses} 
                    onSelectCourse={(id) => handleNavigate('course-profile', id)} 
                    currency={currency} 
                    exchangeRate={JOD_TO_USD_RATE} 
                    strings={strings} 
                    language={language}
                    initialView={initialDashboardView}
                    onViewHandled={() => setInitialDashboardView(undefined)}
                />
            ) : <p>Please log in.</p>;
            
            case 'admin-dashboard': return isAdmin ? (
                <AdminDashboard 
                    onLogout={handleLogout}
                    content={siteContent} setContent={handleSetSiteContent}
                    heroSlides={heroSlides} setHeroSlides={handleSetHeroSlides}
                    onboardingOptions={onboardingOptions} setOnboardingOptions={handleSetOnboardingOptions}
                    users={users} setUsers={handleSetUsers}
                    staff={staff} setStaff={handleSetStaff}
                    payments={payments}
                    teachers={teachers} setTeachers={handleSetTeachers}
                    courses={courses} setCourses={handleSetCourses}
                    subjects={(onboardingOptions).subjects || []}
                    testimonials={testimonials} setTestimonials={handleSetTestimonials}
                    blogPosts={blogPosts} setBlogPosts={handleSetBlogPosts}
                />
            ) : <p>Access denied.</p>;

            default: return <h2>Page not found</h2>;
        }
    };

    return (
        <div className={language === 'ar' ? 'rtl' : 'ltr'}>
            <Header
                onNavigate={handleNavigate}
                onLoginClick={() => { setAuthModalView('login'); setAuthModalOpen(true); }}
                onSignupClick={() => { setAuthModalView('signup'); setAuthModalOpen(true); }}
                isLoggedIn={isLoggedIn}
                isAdmin={isAdmin}
                username={isAdmin ? 'Admin' : userProfile?.username}
                onLogout={handleLogout}
                currency={currency}
                onCurrencyChange={() => setCurrency(c => c === 'JOD' ? 'USD' : 'JOD')}
                language={language}
                onLanguageChange={handleLanguageChange}
                isTranslating={isTranslating}
                strings={strings}
            />
            
            {error && (
                 <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 container mx-auto my-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <main>
                {renderContent()}
            </main>

             {!(isDataLoading || isAuthLoading) && (
                 <>
                    <Footer onNavigate={handleNavigate} strings={strings} />
                    <Chatbot courses={courses} onSelectCourse={(id) => handleNavigate('course-profile', id)} strings={strings} language={language}/>
                 </>
            )}
            
            {isAuthModalOpen && (
                <AuthModal 
                    initialView={authModalView}
                    onClose={() => setAuthModalOpen(false)}
                    onLogin={handleLogin}
                    onSwitchToOnboarding={() => {
                        setAuthModalOpen(false);
                        setShowOnboarding(true);
                    }}
                    strings={strings}
                />
            )}
        </div>
    );
};

export default App;