
import { UserProfile, Course, Teacher, Testimonial, BlogPost, HeroSlide, StaffMember, Payment, SiteContent, OnboardingOptions, AboutContent, HomepageContent } from './types';

const users: UserProfile[] = [
    {
        id: '1',
        username: "طالب جديد",
        email: "student@example.com",
        phone: "0791234567",
        password: "password123",
        userType: 'Student',
        serviceType: 'التقوية',
        educationStage: 'المرحلة الإعدادية/المتوسطة',
        grade: 'الصف التاسع',
        curriculum: 'المنهج الوطني الأردني',
        subjects: ['الرياضيات', 'الفيزياء'],
        age: '15',
    }
];

const staff: StaffMember[] = [
    { id: '1', name: 'أحمد المشرف', email: 'ahmad@jotutor.com', permissions: 'Manage Teachers' },
    { id: '2', name: 'سارة مديرة', email: 'sara@jotutor.com', permissions: 'Full Control' }
];

const payments: Payment[] = [
    { id: '101', date: new Date('2023-10-26T10:00:00Z').toISOString(), userId: '1', userName: 'طالب جديد', courseId: 'c1', courseName: 'باقة الرياضيات للمرحلة الابتدائية', amount: 179, currency: 'JOD', status: 'Success' },
    { id: '102', date: new Date('2023-10-25T14:30:00Z').toISOString(), userId: '2', userName: 'مستخدم آخر', courseId: 'c3', courseName: 'باقة اللغة الإنجليزية المتقدمة', amount: 247, currency: 'JOD', status: 'Failed' },
];

const teachers: Teacher[] = [
    {
        id: '1',
        name: "الأستاذ خالد",
        avatarUrl: "https://i.ibb.co/6yv0fbv/image.jpg",
        level: "ابتدائي ومتوسط",
        experience: 8,
        specialties: ["الرياضيات", "العلوم"],
        rating: 4.9,
        reviews: 120,
        pricePerHour: 25,
        bio: "أستاذ متخصص في تبسيط المفاهيم العلمية والرياضية لطلاب المرحلتين الابتدائية والمتوسطة، أستخدم أساليب تفاعلية لجعل التعلم ممتعًا.",
        qualifications: ["بكالوريوس في الرياضيات", "دبلوم تربية"],
    },
    {
        id: '2',
        name: "المعلمة فاطمة",
        avatarUrl: "https://i.ibb.co/yQj50tq/image.jpg",
        level: "ثانوي وجامعي",
        experience: 12,
        specialties: ["اللغة الإنجليزية", "التحضير لـ TOEFL"],
        rating: 5.0,
        reviews: 250,
        pricePerHour: 35,
        bio: "خبيرة في تدريس اللغة الإنجليزية لغير الناطقين بها، أركز على تطوير مهارات المحادثة والكتابة الأكاديمية للطلاب.",
        qualifications: ["ماجستير في الأدب الإنجليزي", "شهادة TESOL"],
    },
];

const courses: Course[] = [
    { id: 'c1', title: 'Primary Stage Std 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', priceJod: 179, priceUsd: 252, priceSar: 948, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg', isFeatured: true, sessionCount: 8, totalHours: 16 },
    { id: 'c2', title: 'Secondary to High Std 8Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعتين.', priceJod: 247, priceUsd: 348, priceSar: 1309, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg', sessionCount: 8, totalHours: 16 },
    { id: 'c3', title: 'Foundation Educ Fnd 8Sessions X 2Hours', description: 'دورة تأسيسية، 8 حصص لمدة ساعتين.', priceJod: 229, priceUsd: 323, priceSar: 1213, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg', sessionCount: 8, totalHours: 16 },
];

const testimonials: Testimonial[] = [
    { id: '1', name: 'أمل محمود', role: 'ولي أمر', avatarUrl: 'https://i.ibb.co/Jqj3B2W/image.jpg', quote: 'تجربة ممتازة! ابني تحسن مستواه بشكل ملحوظ في الرياضيات بفضل المعلم خالد. المنصة سهلة الاستخدام والدعم الفني رائع.' },
];

const blogPosts: BlogPost[] = [
    { id: '1', title: '5 استراتيجيات لزيادة التركيز', author: 'فريق JoTutor', date: '2023-10-15T12:00:00Z', excerpt: 'في عالم التعليم الرقمي...', imageUrl: 'https://i.ibb.co/L8zB3Sy/image.jpg', tags: ['نصائح'], type: 'article', content: '<p>المحتوى هنا</p>' },
];

const heroSlides: HeroSlide[] = [
    { id: '1', title: 'تعليم فردي مخصص مدعوم بالذكاء الاصطناعي', description: 'نركز على احتياجات كل طالب وأسلوب تعلمه الخاص', imageUrl: 'https://i.ibb.co/4ZRTCY4g/image.jpg' },
];

const homepageContent: HomepageContent = {
  featuresTitle: 'لماذا تختار JoTutor؟',
  featuresSubtitle: 'نحن نقدم تجربة تعليمية فريدة ومصممة خصيصًا لتلبية احتياجاتك.',
  feature1Title: 'معلمون خبراء',
  feature1Desc: 'نخبة من أفضل المعلمين والمعلمات.',
  feature2Title: 'مناهج متكاملة',
  feature2Desc: 'تغطية شاملة لجميع المناهج.',
  feature3Title: 'مرونة في المواعيد',
  feature3Desc: 'اختر الأوقات التي تناسبك.',
  howItWorksTitle: 'كيف يعمل؟',
  howItWorksSubtitle: 'ابدأ رحلتك في ثلاث خطوات بسيطة.',
  step1Title: 'ابحث عن معلم',
  step1Desc: 'تصفح قائمة المعلمين.',
  step2Title: 'احجز حصة',
  step2Desc: 'اختر الموعد المناسب.',
  step3Title: 'ابدأ التعلم',
  step3Desc: 'انضم إلى حصتك عبر الإنترنت.',
  teacherSearchTitle: 'ابحث عن معلمك المثالي',
  teacherSearchSubtitle: 'تواصل مع أفضل المعلمين.',
  discoverMoreTeachers: 'اكتشف المزيد من المعلمين',
  coursesPreviewTitle: 'أحدث الدورات',
  coursesPreviewSubtitle: 'تصفح أحدث الدورات.',
  discoverMoreCourses: 'اكتشف المزيد من الدورات',
  testimonialsTitle: 'ماذا يقولون عنا',
  testimonialsSubtitle: 'آراء طلابنا هي شهادتنا الأغلى.',
  aiPlannerTitle: 'مخطط الدروس الذكي',
  aiPlannerSubtitle: 'استخدم الذكاء الاصطناعي في ثوانٍ.',
};

const aboutContent: AboutContent = {
    heroImage: 'https://i.ibb.co/YFL8kfwv/image.jpg',
    aboutTitle: 'عن JoTutor',
    visionTitle: 'رؤيتنا',
    vision: 'منح المعلمين القيمة التي يستحقونها.',
    visionImage: 'https://i.ibb.co/4ZRTCY4g/image.jpg',
    missionTitle: 'رسالتنا',
    mission: 'تغطية جميع الاحتياجات التعليمية.',
    teacherCommunityTitle: 'مجتمعنا',
    teacherCommunity: 'نسعى لبناء مجتمع متميز.',
    whyJoTutorTitle: 'لماذا نحن؟',
    whyJoTutor: ['فريق متخصص', 'أساليب حديثة'],
};

const onboardingOptions: OnboardingOptions = {
    serviceTypes: ['التأسيس', 'التقوية', 'المتابعة', 'الأنشطة اللاصفية', 'اللغات'],
    educationStages: ['تأسيس', 'ابتدائي', 'إعدادي/متوسط', 'ثانوي', 'جامعي'],
    curriculums: ['المنهج الوطني الأردني', 'المنهج الأمريكي', 'المنهج البريطاني'],
    subjects: ['الرياضيات', 'الفيزياء', 'اللغة العربية'],
    languages: ['الإنجليزية', 'العربية']
};

const siteContent: SiteContent = {
    homepage: homepageContent,
    about: aboutContent,
    faq: [{ id: '1', question: 'كيف أحجز؟', answer: 'عبر الموقع بسهولة.' }],
    contact: { 
        email: 'contact@jotutor.com', 
        phone: '+962 79 123 4567', 
        address: 'عمان, الأردن',
        facebook: '#',
        instagram: '#',
        youtube: '#',
        linkedin: '#'
    },
    privacy: 'نص سياسة الخصوصية',
    terms: 'نص الشروط'
};

export const initialData = {
    users,
    staff,
    payments,
    teachers,
    courses,
    testimonials,
    blogPosts,
    heroSlides,
    siteContent,
    onboardingOptions
};
