
import React, { useMemo } from 'react';
import { UserProfile, Course, Currency } from '../../types';
import CourseCard from '../CourseCard';

interface CoursesViewProps {
    userProfile: UserProfile;
    allCourses: Course[];
    onSelectCourse: (id: string) => void;
    currency: Currency;
    exchangeRate: number;
    strings: { [key: string]: string };
}

/**
 * وظيفة محسنة للحصول على الدورات المقترحة بناءً على بروفايل المستخدم
 */
const getSuggestedCourses = (profile: UserProfile, allCourses: Course[]): Course[] => {
    const { serviceType, educationStage, grade } = profile;

    // 1. تحديد الفئات المستهدفة بناءً على نوع الخدمة (Onboarding Service Type)
    let targetCategories: string[] = [];
    
    if (serviceType === 'التأسيس' || serviceType === 'Foundation') {
        targetCategories.push('تأسيس', 'تأسيس (3-5 سنوات)');
    } else if (serviceType === 'اللغات' || serviceType === 'Languages') {
        targetCategories.push('لغات', 'اللغات');
    } else if (serviceType === 'التقوية' || serviceType === 'التحسين الأكاديمي' || serviceType === 'Reinforcement') {
        targetCategories.push('التقوية', 'تقوية');
    } else if (serviceType === 'المتابعة' || serviceType === 'Follow-up') {
        targetCategories.push('التقوية', 'متابعة');
    }

    // 2. فلترة أولية حسب الفئة
    let suggestions = allCourses.filter(course => {
        // إذا كان نوع الخدمة يطابق فئة الدورة (أو اسم الفئة بالإنجليزية)
        const categoryMatch = targetCategories.some(cat => 
            course.category === cat || course.category_en === cat
        );
        return categoryMatch;
    });

    // 3. فلترة ثانوية حسب الصف الدراسي (Grade) لزيادة الدقة
    if (grade) {
        const exactGradeMatches = suggestions.filter(course => 
            course.targetGrades && course.targetGrades.includes(grade)
        );
        
        // إذا وجدنا دورات مطابقة تماماً للصف، نكتفي بها
        if (exactGradeMatches.length > 0) {
            suggestions = exactGradeMatches;
        }
    }

    // 4. إذا لم نجد أي شيء في الفئة المحددة، نلجأ للفلترة حسب المرحلة التعليمية (Stage)
    if (suggestions.length === 0) {
        suggestions = allCourses.filter(course => {
            const stageMatch = educationStage && (
                course.level.includes(educationStage.split(' ')[0]) || 
                (course.level_en && educationStage.toLowerCase().includes(course.level_en.toLowerCase()))
            );
            return stageMatch;
        });
    }

    return suggestions;
};

const CoursesView: React.FC<CoursesViewProps> = ({ userProfile, allCourses, onSelectCourse, currency, exchangeRate, strings }) => {
    
    // الدورات المسجل بها الطالب
    const enrolledCourses = useMemo(() => {
        if (!userProfile.enrolledCourses || userProfile.enrolledCourses.length === 0) {
            return [];
        }
        const enrolledIds = new Set(userProfile.enrolledCourses);
        return allCourses.filter(course => enrolledIds.has(course.id));
    }, [userProfile.enrolledCourses, allCourses]);

    // الدورات المقترحة (المنطق الجديد)
    const suggestedCourses = useMemo(() => {
        const enrolledIds = new Set(userProfile.enrolledCourses || []);

        // الحصول على الاقتراحات بناءً على البيانات المدخلة عند التسجيل
        const initialSuggestions = getSuggestedCourses(userProfile, allCourses);

        // استثناء الدورات التي اشترك فيها الطالب بالفعل
        let finalSuggestions = initialSuggestions.filter(course => !enrolledIds.has(course.id));

        // إذا لم تتوفر اقتراحات محددة، نعرض 3 دورات عشوائية مميزة لتجنب الفراغ
        if (finalSuggestions.length === 0 && allCourses.length > 0) {
            finalSuggestions = allCourses
                .filter(course => !enrolledIds.has(course.id))
                .sort(() => 0.5 - Math.random()) // خلط عشوائي
                .slice(0, 3);
        }

        return finalSuggestions;
    }, [userProfile, allCourses]);


    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-black text-blue-900 mb-8">{strings.myCourses}</h1>

            {/* قسم الدورات الحالية (المشترك بها) */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-12">
                <h2 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded-full"></span>
                    {strings.enrolledCoursesTitle}
                </h2>
                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {enrolledCourses.map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                onSelect={() => onSelectCourse(course.id)}
                                currency={currency}
                                exchangeRate={exchangeRate}
                                strings={strings}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <div className="text-4xl mb-4 opacity-30">📚</div>
                        <p className="text-gray-500 font-bold">{strings.noEnrolledCourses}</p>
                        <button 
                            onClick={() => onSelectCourse('')} 
                            className="mt-4 text-green-600 font-bold hover:underline"
                        >
                            {strings.discoverMoreCourses}
                        </button>
                    </div>
                )}
            </div>

            {/* قسم الاقتراحات المخصصة */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                 <h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                    {strings.suggestedCoursesTitle}
                 </h2>
                 <p className="text-gray-500 text-sm mb-8 font-medium">
                    {userProfile.serviceType ? 
                        `بناءً على اهتمامك بـ "${userProfile.serviceType}" وصفك "${userProfile.grade}"، نقترح لك التالي:` : 
                        strings.suggestedCoursesDesc
                    }
                 </p>
                {suggestedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {suggestedCourses.map(course => (
                            <div key={course.id} className="relative group">
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg z-10 shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                                    مقترح لك ✨
                                </div>
                                <CourseCard
                                    course={course}
                                    onSelect={() => onSelectCourse(course.id)}
                                    currency={currency}
                                    exchangeRate={exchangeRate}
                                    strings={strings}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-700">{strings.noSuggestedCourses}</h3>
                        <p className="text-gray-500 mt-2">{strings.noSuggestedCoursesDesc}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesView;
