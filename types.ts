export type Page = 
  'home' | 'teachers' | 'teacher-profile' | 'courses' | 'course-profile' | 
  'payment' | 'videos' | 'short-player' | 'blog' | 'article' | 'about' | 
  'contact' | 'faq' | 'privacy' | 'terms' | 
  'dashboard' | 'admin-dashboard' | 'admin-user-view';

// Fix: Moved DashboardView type here to break a circular dependency.
export type DashboardView = 'profile' | 'courses' | 'wallet' | 'ai-assistant';

// Fix: Added 'SAR' to Currency type to allow comparisons and currency switching.
export type Currency = 'JOD' | 'USD' | 'SAR';
export type Language = 'ar' | 'en';

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Teacher {
  id: string;
  name: string;
  avatarUrl: string;
  level: string; // e.g., "ابتدائي ومتوسط"
  experience: number; // years
  specialties: string[];
  rating: number;
  reviews: number;
  pricePerHour: number;
  bio: string;
  qualifications: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "ولي أمر"
  avatarUrl: string;
  quote: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    teacher: string;
    price: number; // in JOD
    // Fix: Added optional price fields used in component logic to resolve TypeScript property missing errors.
    priceJod?: number;
    priceUsd?: number;
    priceSar?: number;
    duration: string;
    level: string;
    imageUrl: string;
    category: string;
}

export interface UserProfile {
    id: string; // Firebase UID
    username: string;
    email: string;
    phone: string;
    password?: string; // Only used for signup, not stored in DB
    userType: 'Student' | 'Parent';
    serviceType: string;
    educationStage: string;
    grade: string;
    curriculum: string;
    subjects: string[];
    dob: string; // YYYY-MM-DD
    enrolledCourses?: string[];
}

export interface OnboardingOptions {
    serviceTypes: string[];
    educationStages: string[];
    curriculums: string[];
    subjects: string[];
    languages: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string; // ISO string
  excerpt: string;
  content: string;
  imageUrl: string;
  tags: string[];
  type: 'article' | 'short';
  youtubeVideoId?: string;
}

export interface ContactContent {
  email: string;
  phone: string;
  address: string;
}

export interface HomepageContent {
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  teacherSearchTitle: string;
  teacherSearchSubtitle: string;
  discoverMoreTeachers: string;
  coursesPreviewTitle: string;
  coursesPreviewSubtitle: string;
  discoverMoreCourses: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  aiPlannerTitle: string;
  aiPlannerSubtitle: string;
}

export interface AboutContent {
  heroImage: string;
  aboutTitle: string;
  visionTitle: string;
  vision: string;
  visionImage: string;
  missionTitle: string;
  mission: string;
  teacherCommunityTitle: string;
  teacherCommunity: string;
  whyJoTutorTitle: string;
  whyJoTutor: string[];
}

export interface SiteContent {
  homepage: HomepageContent;
  about: AboutContent;
  faq: FAQItem[];
  contact: ContactContent;
  privacy: string;
  terms: string;
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    courses?: Course[];
}

export type StaffPermission = 'Full Control' | 'Manage Teachers' | 'Manage Users' | 'Manage Blog';

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    permissions: StaffPermission;
}

export interface Payment {
    id: string;
    date: string; // ISO String
    userId: string;
    userName: string;
    courseId: string;
    courseName: string;
    amount: number;
    currency: 'JOD' | 'USD';
    status: 'Success' | 'Failed';
}