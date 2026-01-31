// Fix: Added AboutContent to imports to resolve type error.
import { UserProfile, Course, Teacher, Testimonial, BlogPost, HeroSlide, StaffMember, Payment, SiteContent, OnboardingOptions, AboutContent, HomepageContent } from './types';

// This file provides the initial state for the application.
// If Google Sheets is not configured, the app will run entirely on this data.
// If Google Sheets is configured, this data will be replaced by live data on load.

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
        dob: '2008-05-10',
    }
];

const staff: StaffMember[] = [
    { id: '1', name: 'أحمد المشرف', email: 'ahmad@jotutor.com', permissions: 'Manage Teachers' },
    { id: '2', name: 'سارة مديرة', email: 'sara@jotutor.com', permissions: 'Full Control' }
];

const payments: Payment[] = [
    { id: '101', date: new Date('2023-10-26T10:00:00Z').toISOString(), userId: '1', userName: 'طالب جديد', courseId: '1', courseName: 'باقة الرياضيات للمرحلة الابتدائية', amount: 179, currency: 'JOD', status: 'Success' },
    { id: '102', date: new Date('2023-10-25T14:30:00Z').toISOString(), userId: '2', userName: 'مستخدم آخر', courseId: '3', courseName: 'باقة اللغة الإنجليزية المتقدمة', amount: 247, currency: 'JOD', status: 'Failed' },
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
    {
        id: '3',
        name: "الأستاذ يوسف",
        avatarUrl: "https://i.ibb.co/3zd2yv9/image.jpg",
        level: "جميع المراحل",
        experience: 10,
        specialties: ["اللغة العربية", "البلاغة", "النحو"],
        rating: 4.8,
        reviews: 95,
        pricePerHour: 30,
        bio: "أعمل على ترسيخ حب اللغة العربية لدى الطلاب من خلال أساليب إبداعية تركز على فهم النصوص وتذوقها.",
        qualifications: ["دكتوراه في اللغة العربية وآدابها"],
    },
    {
        id: '4',
        name: "المعلمة سارة",
        avatarUrl: "https://i.ibb.co/L5BKn2S/image.jpg",
        level: "متوسط وثانوي",
        experience: 7,
        specialties: ["الفيزياء", "الكيمياء"],
        rating: 4.9,
        reviews: 110,
        pricePerHour: 28,
        bio: "أساعد الطلاب على فهم القوانين الفيزيائية والتفاعلات الكيميائية من خلال التجارب العملية والأمثلة الواقعية.",
        qualifications: ["بكالوريوس في الهندسة الكيميائية"],
    },
];

const courses: Course[] = [
    // Primary Stage
    { id: 'c1', title: 'Primary Stage Std 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', price: 179, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c2', title: 'Primary Stage Std+ 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', price: 232, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c3', title: 'Primary Stage Prm 8Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعتين.', price: 319, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c4', title: 'Primary Stage Std 12Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعتين.', price: 212, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c5', title: 'Primary Stage Std+ 12Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعتين.', price: 297, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c6', title: 'Primary Stage Prm 12Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعتين.', price: 409, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c7', title: 'Primary Stage Std 16Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعتين.', price: 279, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c8', title: 'Primary Stage Std+ 16Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعتين.', price: 395, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c9', title: 'Primary Stage Prm 16Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعتين.', price: 439, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c10', title: 'Primary Stage Std 8Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة ونصف.', price: 152, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c11', title: 'Primary Stage Std+ 8Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة ونصف.', price: 207, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c12', title: 'Primary Stage Prm 8Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة ونصف.', price: 262, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c13', title: 'Primary Stage Std 12Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة ونصف.', price: 179, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c14', title: 'Primary Stage Std+ 12Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة ونصف.', price: 262, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c15', title: 'Primary Stage Prm 12Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة ونصف.', price: 359, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c16', title: 'Primary Stage Std 16Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة ونصف.', price: 237, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c17', title: 'Primary Stage Std+ 16Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة ونصف.', price: 317, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c18', title: 'Primary Stage Prm 16Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة ونصف.', price: 449, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c19', title: 'Primary Stage Std 8Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة.', price: 139, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c20', title: 'Primary Stage Std+ 8Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة.', price: 179, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c21', title: 'Primary Stage Prm 8Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 8 حصص لمدة ساعة.', price: 247, duration: '8 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c22', title: 'Primary Stage Std 12Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة.', price: 159, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c23', title: 'Primary Stage Std+ 12Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة.', price: 229, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c24', title: 'Primary Stage Prm 12Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 12 حصة لمدة ساعة.', price: 317, duration: '12 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c25', title: 'Primary Stage Std 16Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة.', price: 207, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c26', title: 'Primary Stage Std+ 16Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة.', price: 277, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c27', title: 'Primary Stage Prm 16Sessions X 1Hour', description: 'دورة للمرحلة الابتدائية، 16 حصة لمدة ساعة.', price: 419, duration: '16 Sessions', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c28', title: 'Primary Stage Std 1Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعتين.', price: 32, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c29', title: 'Primary to Stage Prm 1Sessions X 2Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعتين.', price: 35, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c30', title: 'Primary Stage Std 1Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعة ونصف.', price: 27, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    { id: 'c31', title: 'Primary to Stage Prm 1Sessions X 1.5Hours', description: 'دورة للمرحلة الابتدائية، حصة واحدة لمدة ساعة ونصف.', price: 30, duration: '1 Session', level: 'ابتدائي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/W2zXzLg/image.jpg' },
    
    // Secondary to High Stage
    { id: 'c32', title: 'Secondary to High Std 8Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعتين.', price: 247, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c33', title: 'Secondary to High Std+ 8Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعتين.', price: 327, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c34', title: 'Secondary to High Std 12Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعتين.', price: 349, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c35', title: 'Secondary to High Std+ 12Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعتين.', price: 467, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c36', title: 'Secondary to High Std 16Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعتين.', price: 462, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c37', title: 'Secondary to High Std+ 16Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعتين.', price: 599, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c38', title: 'Secondary to High Std 8Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة ونصف.', price: 207, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c39', title: 'Secondary to High Std+ 8Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة ونصف.', price: 289, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c40', title: 'Secondary to High Prm 8Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة ونصف.', price: 419, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c41', title: 'Secondary to High Std 12Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة ونصف.', price: 289, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c42', title: 'Secondary to High Std+ 12Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة ونصف.', price: 409, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c43', title: 'Secondary to High Prm 12Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة ونصف.', price: 579, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c44', title: 'Secondary to High Std 16Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة ونصف.', price: 379, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c45', title: 'Secondary to High Std+ 16Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة ونصف.', price: 519, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c46', title: 'Secondary to High Prm 16Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة ونصف.', price: 599, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c47', title: 'Secondary to High Std 8Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة.', price: 189, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c48', title: 'Secondary to High Std+ 8Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة.', price: 259, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c49', title: 'Secondary to High Prm 8Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 8 حصص لمدة ساعة.', price: 359, duration: '8 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c50', title: 'Secondary to High Std 12Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة.', price: 269, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c51', title: 'Secondary to High Std+ 12Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة.', price: 359, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c52', title: 'Secondary to High Prm 12Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 12 حصة لمدة ساعة.', price: 489, duration: '12 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c53', title: 'Secondary to High Std 16Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة.', price: 329, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c54', title: 'Secondary to High Std+ 16Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة.', price: 472, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c55', title: 'Secondary to High Prm 16Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، 16 حصة لمدة ساعة.', price: 529, duration: '16 Sessions', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c56', title: 'Secondary to High Std 1Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعتين.', price: 37, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c57', title: 'Secondary to High Std+ 1Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعتين.', price: 42, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c58', title: 'Secondary to High Prm++ 1Sessions X 2Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعتين.', price: 60, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c59', title: 'Secondary to High Std 1Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة ونصف.', price: 32, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c60', title: 'Secondary to High Std+ 1Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة ونصف.', price: 37, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c61', title: 'Secondary to High Prm 1Sessions X 1.5Hours', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة ونصف.', price: 55, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c62', title: 'Secondary to High Std 1Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة.', price: 28, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c63', title: 'Secondary to High Std+ 1Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة.', price: 32, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    { id: 'c64', title: 'Secondary to High Prm 1Sessions X 1Hour', description: 'دورة للمرحلة الإعدادية والثانوية، حصة واحدة لمدة ساعة.', price: 50, duration: '1 Session', level: 'إعدادي / ثانوي', category: 'التقوية', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/R2W74zN/image.jpg' },
    
    // Foundation Stage
    { id: 'c65', title: 'Foundation Educ Fnd 8Sessions X 2Hours', description: 'دورة تأسيسية، 8 حصص لمدة ساعتين.', price: 229, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c66', title: 'Foundation Educ Fnd 12Sessions X 2Hours', description: 'دورة تأسيسية، 12 حصة لمدة ساعتين.', price: 269, duration: '12 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c67', title: 'Foundation Educ Fnd 16Sessions X 2Hours', description: 'دورة تأسيسية، 16 حصة لمدة ساعتين.', price: 379, duration: '16 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c68', title: 'Foundation Educ Fnd 8Sessions X 1.5Hours', description: 'دورة تأسيسية، 8 حصص لمدة ساعة ونصف.', price: 199, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c69', title: 'Foundation Educ Fnd 12Sessions X 1.5Hours', description: 'دورة تأسيسية، 12 حصة لمدة ساعة ونصف.', price: 239, duration: '12 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c70', title: 'Foundation Educ Fnd 16Sessions X 1.5Hours', description: 'دورة تأسيسية، 16 حصة لمدة ساعة ونصف.', price: 319, duration: '16 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c71', title: 'Foundation Educ Fnd 8Sessions X 1Hour', description: 'دورة تأسيسية، 8 حصص لمدة ساعة.', price: 179, duration: '8 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c72', title: 'Foundation Educ Fnd 12Sessions X 1Hour', description: 'دورة تأسيسية، 12 حصة لمدة ساعة.', price: 207, duration: '12 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    { id: 'c73', title: 'Foundation Educ Fnd 16Sessions X 1Hour', description: 'دورة تأسيسية، 16 حصة لمدة ساعة.', price: 269, duration: '16 Sessions', level: 'تأسيس', category: 'تأسيس', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/yqgzk8N/image.jpg' },
    
    // Special Courses (Languages)
    { id: 'c74', title: 'Special Courses Prm+ 8Sessions X 2Hours', description: 'دورة لغات متخصصة، 8 حصص لمدة ساعتين.', price: 239, duration: '8 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c75', title: 'Special Courses Prm+ 12Sessions X 2Hours', description: 'دورة لغات متخصصة، 12 حصة لمدة ساعتين.', price: 319, duration: '12 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c76', title: 'Special Courses Prm+ 16Sessions X 2Hours', description: 'دورة لغات متخصصة، 16 حصة لمدة ساعتين.', price: 419, duration: '16 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c77', title: 'Special Courses Prm+ 8Sessions X 1.5Hours', description: 'دورة لغات متخصصة، 8 حصص لمدة ساعة ونصف.', price: 219, duration: '8 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c78', title: 'Special Courses Prm+ 12Sessions X 1.5Hours', description: 'دورة لغات متخصصة، 12 حصة لمدة ساعة ونصف.', price: 249, duration: '12 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c79', title: 'Special Courses Prm+ 16Sessions X 1.5Hours', description: 'دورة لغات متخصصة، 16 حصة لمدة ساعة ونصف.', price: 339, duration: '16 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c80', title: 'Special Courses Prm+ 8Sessions X 1Hour', description: 'دورة لغات متخصصة، 8 حصص لمدة ساعة.', price: 199, duration: '8 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c81', title: 'Special Courses Prm+ 12Sessions X 1Hour', description: 'دورة لغات متخصصة، 12 حصة لمدة ساعة.', price: 229, duration: '12 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
    { id: 'c82', title: 'Special Courses Prm+ 16Sessions X 1Hour', description: 'دورة لغات متخصصة، 16 حصة لمدة ساعة.', price: 299, duration: '16 Sessions', level: 'لغات', category: 'لغات', teacher: 'معلم متخصص', imageUrl: 'https://i.ibb.co/mXTy1Ww/image.jpg' },
];

const testimonials: Testimonial[] = [
    { id: '1', name: 'أمل محمود', role: 'ولي أمر', avatarUrl: 'https://i.ibb.co/Jqj3B2W/image.jpg', quote: 'تجربة ممتازة! ابني تحسن مستواه بشكل ملحوظ في الرياضيات بفضل المعلم خالد. المنصة سهلة الاستخدام والدعم الفني رائع.' },
    { id: '2', name: 'أحمد علي', role: 'طالب جامعي', avatarUrl: 'https://i.ibb.co/jH0312F/image.jpg', quote: 'استفدت كثيرًا من دورة التحضير للـ TOEFL مع المعلمة فاطمة. الشرح كان واضحًا والتمارين مفيدة جدًا.' },
    { id: '3', name: 'سارة حسين', role: 'طالبة ثانوية', avatarUrl: 'https://i.ibb.co/2nS2Xfb/image.jpg', quote: 'كانت مادة الفيزياء صعبة بالنسبة لي، لكن مع المعلمة سارة أصبحت أسهل وأكثر متعة. شكرًا JoTutor!' },
];

const blogPosts: BlogPost[] = [
    { id: '1', title: '5 استراتيجيات لزيادة التركيز أثناء الدراسة عن بعد', author: 'فريق JoTutor', date: '2023-10-15T12:00:00Z', excerpt: 'في عالم التعليم الرقمي، أصبح الحفاظ على التركيز تحديًا كبيرًا. نقدم لكم 5 طرق عملية لمساعدتكم...', imageUrl: 'https://i.ibb.co/L8zB3Sy/image.jpg', tags: ['نصائح', 'دراسة'], type: 'article', content: '<p>هنا محتوى المقال الكامل...</p>' },
    { id: '2', title: 'كيف تختار المعلم الخصوصي المناسب لطفلك؟', author: 'أحمد صالح', date: '2023-10-05T09:00:00Z', excerpt: 'اختيار المعلم المناسب هو استثمار في مستقبل طفلك. إليك بعض النقاط المهمة التي يجب مراعاتها...', imageUrl: 'https://i.ibb.co/K500zVp/image.jpg', tags: ['أولياء أمور', 'اختيار'], type: 'article', content: '<p>هنا محتوى المقال الكامل...</p>' },
    { id: '3', title: 'شرح قاعدة المبني للمجهول في دقيقة', author: 'المعلمة فاطمة', date: '2023-09-28T15:00:00Z', excerpt: 'فيديو قصير ومفيد لشرح قاعدة Passive Voice في اللغة الإنجليزية.', imageUrl: 'https://i.ytimg.com/vi/cwc3h6_q-A0/hqdefault.jpg', tags: ['إنجليزية', 'قواعد'], type: 'short', youtubeVideoId: 'cwc3h6_q-A0', content: 'شرح سريع لقاعدة المبني للمجهول.' },
];

const heroSlides: HeroSlide[] = [
    { id: '1', title: 'تعليم فردي مخصص مدعوم بالذكاء الاصطناعي', description: 'نركز على احتياجات كل طالب وأسلوب تعلمه الخاص مع استراتيجية تعليمية مدعومة بالذكاء الاصطناعي', imageUrl: 'https://i.ibb.co/4ZRTCY4g/image.jpg' },
    { id: '2', title: 'نخبة من المعلمين بين يديك', description: 'فريق من أفضل المعلمين مع خبرة واسعة في التعليم وشهادات معتمدة من أرقى الجامعات', imageUrl: 'https://i.ibb.co/zWzrLWx9/02-1.jpg' },
    { id: '3', title: 'متابعة دقيقة وتقارير أداء ذكية', description: 'تقنيات حديثة لتحليل التقدم ووضع خطط تعليمية ذكية مع متابعة دقيقة للأداء', imageUrl: 'https://i.ibb.co/zWxm4Bp4/image.jpg' },
];

const homepageContent: HomepageContent = {
  featuresTitle: 'لماذا تختار JoTutor؟',
  featuresSubtitle: 'نحن نقدم تجربة تعليمية فريدة ومصممة خصيصًا لتلبية احتياجاتك.',
  feature1Title: 'معلمون خبراء',
  feature1Desc: 'نخبة من أفضل المعلمين والمعلمات لمساعدتك على التفوق الدراسي.',
  feature2Title: 'مناهج متكاملة',
  feature2Desc: 'تغطية شاملة لجميع المناهج الدراسية المحلية والدولية.',
  feature3Title: 'مرونة في المواعيد',
  feature3Desc: 'اختر الأوقات التي تناسبك لدروسك الخصوصية عبر الإنترنت.',
  howItWorksTitle: 'كيف يعمل؟',
  howItWorksSubtitle: 'ابدأ رحلتك التعليمية في ثلاث خطوات بسيطة.',
  step1Title: 'ابحث عن معلم',
  step1Desc: 'تصفح قائمة المعلمين واختر الأنسب لاحتياجاتك.',
  step2Title: 'احجز حصة',
  step2Desc: 'اختر الموعد المناسب لك وقم بحجز حصتك الدراسية بسهولة.',
  step3Title: 'ابدأ التعلم',
  step3Desc: 'انضم إلى حصتك عبر الإنترنت وابدأ رحلة التفوق.',
  teacherSearchTitle: 'ابحث عن معلمك المثالي',
  teacherSearchSubtitle: 'تواصل مع أفضل المعلمين الخصوصيين في الأردن.',
  discoverMoreTeachers: 'اكتشف المزيد من المعلمين',
  coursesPreviewTitle: 'أحدث الدورات',
  coursesPreviewSubtitle: 'تصفح أحدث الدورات المضافة في مختلف المجالات.',
  discoverMoreCourses: 'اكتشف المزيد من الدورات',
  testimonialsTitle: 'ماذا يقولون عنا',
  testimonialsSubtitle: 'آراء طلابنا وأولياء أمورهم هي شهادتنا الأغلى.',
  aiPlannerTitle: 'مخطط الدروس الذكي',
  aiPlannerSubtitle: 'استخدم الذكاء الاصطناعي لإنشاء خطط دروس متكاملة في ثوانٍ.',
};

const aboutContent: AboutContent = {
    heroImage: 'https://i.ibb.co/YFL8kfwv/image.jpg',
    aboutTitle: 'عن JoTutor',
    visionTitle: 'رؤيتنا',
    vision: 'منح المعلمين القيمة التي يستحقونها، والتي ستنعكس إيجابًا على تطور أطفالنا.',
    visionImage: 'https://i.ibb.co/4ZRTCY4g/image.jpg',
    missionTitle: 'رسالتنا',
    mission: 'تغطية جميع الاحتياجات الناتجة عن تطور التعليم ومواجهة التحديات التي تفرضها المناهج الجامدة، من خلال أساليب تعليم فردي مدعومة بالذكاء الاصطناعي. نهدف إلى دمج معايير المدارس مع أسس التعليم الخصوصي الحديثة، وتقديم الخدمة في منازل الأطفال وعبر الإنترنت، بطريقة ترفع مستواهم وتمكّنهم من الوصول إلى أقصى إمكاناتهم.',
    teacherCommunityTitle: 'مجتمع المعلمين لدينا',
    teacherCommunity: 'نسعى لبناء مجتمع من المعلمين قادر على إحداث أثر إيجابي في تطور المجتمع ككل.',
    whyJoTutorTitle: 'لماذا JoTutor؟',
    whyJoTutor: [
        'أكثر من 750 معلمًا ومعلمة لتغطية جميع المناهج والمراحل الدراسية وأساليب التعلم.',
        'تطبيق استراتيجيات التعليم الفردي بمشاركة الذكاء الاصطناعي وفريق خدمة عملاء متفانٍ.',
        'عملية قبول صارمة تشمل التحقق من المؤهلات، الفحص الأمني، والمراجع.',
        'معدل قبول أقل من 25٪ لضمان تقديم الأفضل فقط.',
        'فريق جودة وخدمة عملاء لضمان تخصيص المعلم الأنسب (وليس الأفضل فقط).',
        'خطط تطوير طويلة الأمد للعملاء.',
        'تقييم خارجي دوري لضمان التطوير المستمر.',
        'متابعة تقدم الطالب بناءً على مستواه وقدرته والتزامه.',
        'تحقيق توافق اجتماعي ونفسي بين الطالب والمعلم.',
        'لسنا مجرد منصة، بل أول كيان للمعلمين في الأردن والشرق الأوسط.'
    ],
};

const onboardingOptions: OnboardingOptions = {
    serviceTypes: ['التأسيس', 'التقوية', 'المتابعة', 'الأنشطة اللاصفية', 'اللغات'],
    educationStages: ['تأسيس (3-5 سنوات)', 'ابتدائي (6-11 سنة)', 'إعدادي/متوسط (12-14 سنة)', 'ثانوي (15-18 سنة)', 'جامعي (18+)'],
    curriculums: ['المنهج الوطني الأردني', 'المنهج الأمريكي', 'المنهج البريطاني (IGCSE)', 'البكالوريا الدولية (IB)'],
    subjects: ['الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'البرمجة'],
    languages: ['الإنجليزية', 'العربية لغير الناطقين بها', 'الفرنسية', 'الألمانية', 'الإسبانية']
};

const siteContent: SiteContent = {
    homepage: homepageContent,
    about: aboutContent,
    faq: [
        { id: '1', question: 'كيف يمكنني حجز حصة مع معلم؟', answer: 'يمكنك تصفح قائمة المعلمين، واختيار المعلم المناسب، ثم الضغط على "عرض الملف الشخصي" لرؤية المواعيد المتاحة وحجز حصة مباشرة.' },
        { id: '2', question: 'هل الحصص مسجلة؟', answer: 'نعم، يتم تسجيل جميع الحصص ويمكن للطالب الرجوع إليها في أي وقت للمراجعة من خلال لوحة التحكم الخاصة به.' },
    ],
    contact: { email: 'contact@jotutor.com', phone: '+962 79 123 4567', address: 'عمان, الأردن' },
    privacy: 'هنا نص سياسة الخصوصية الكامل...',
    terms: 'هنا نص شروط وأحكام الاستخدام الكاملة...'
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