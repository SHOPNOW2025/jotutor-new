import React, { useMemo } from 'react';
// Fix: Corrected import path for types.
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

const getSuggestedCourses = (profile: UserProfile, allCourses: Course[]): Course[] => {
    const { serviceType, educationStage } = profile;

    let targetCategories: string[] = [];

    // Direct mapping for specific service types
    if (serviceType === 'التأسيس') {
        targetCategories.push('تأسيس');
    } else if (serviceType === 'اللغات') {
        targetCategories.push('لغات');
    } else if (serviceType === 'التقوية') {
        targetCategories.push('التقوية');
    } else { 
        // Fallback for other service types based on education stage
        if (educationStage.includes('تأسيس')) {
             targetCategories.push('تأسيس');
        }
        if (educationStage.includes('ابتدائي')) {
            // This category name should match one in your data, e.g., 'التقوية' might cover this
            targetCategories.push('التقوية'); 
        }
        if (educationStage.includes('إعدادي') || educationStage.includes('ثانوي') || educationStage.includes('جامعي')) {
            targetCategories.push('التقوية');
        }
    }
    
    // Remove duplicates
    const uniqueCategories = [...new Set(targetCategories)];
    
    if (uniqueCategories.length === 0) {
        return [];
    }

    return allCourses.filter(course => uniqueCategories.includes(course.category));
};

const CoursesView: React.FC<CoursesViewProps> = ({ userProfile, allCourses, onSelectCourse, currency, exchangeRate, strings }) => {
    const enrolledCourses = useMemo(() => {
        if (!userProfile.enrolledCourses || userProfile.enrolledCourses.length === 0) {
            return [];
        }
        const enrolledIds = new Set(userProfile.enrolledCourses);
        return allCourses.filter(course => enrolledIds.has(course.id));
    }, [userProfile.enrolledCourses, allCourses]);

    const suggestedCourses = useMemo(() => {
        const enrolledIds = new Set(userProfile.enrolledCourses || []);

        // 1. Get initial suggestions based on profile
        const initialSuggestions = getSuggestedCourses(userProfile, allCourses);

        // 2. Filter out any courses the user is already enrolled in
        let finalSuggestions = initialSuggestions.filter(course => !enrolledIds.has(course.id));

        // 3. If no suggestions are left, apply the fallback to show up to 3 other courses
        if (finalSuggestions.length === 0 && allCourses.length > 0) {
            // Get up to 3 courses from the general list that the user is not enrolled in
            finalSuggestions = allCourses.filter(course => !enrolledIds.has(course.id)).slice(0, 3);
        }

        return finalSuggestions;
    }, [userProfile, allCourses]);


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{strings.myCourses}</h1>

            {/* Enrolled Courses Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">{strings.enrolledCoursesTitle}</h2>
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
                    <div className="text-center py-12 bg-gray-50 rounded-md">
                        <p className="text-gray-600">{strings.noEnrolledCourses}</p>
                    </div>
                )}
            </div>

            {/* Suggested Courses Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-blue-900 mb-2">{strings.suggestedCoursesTitle}</h2>
                 <p className="text-gray-600 mb-6">{strings.suggestedCoursesDesc}</p>
                {suggestedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {suggestedCourses.map(course => (
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
                    <div className="text-center py-12 bg-gray-50 rounded-md">
                        <h3 className="text-xl font-semibold text-gray-700">{strings.noSuggestedCourses}</h3>
                        <p className="text-gray-500 mt-2">{strings.noSuggestedCoursesDesc}</p>
                        <button onClick={() => onSelectCourse('')} className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">
                            {strings.discoverMoreCourses}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesView;