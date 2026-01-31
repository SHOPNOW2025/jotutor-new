import React, { useState, useMemo } from 'react';
import { Course, Currency, Language } from '../types';
import CourseCard from './CourseCard';

interface CoursesPageProps {
  courses: Course[];
  onSelectCourse: (id: string) => void;
  currency: Currency;
  exchangeRate: number;
  strings: { [key: string]: string };
  language: Language;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ courses, onSelectCourse, currency, exchangeRate, strings, language }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all'); // New Grade Filter
  const [sortBy, setSortBy] = useState<string>('default');

  const categories = useMemo(() => ['all', ...Array.from(new Set(courses.map(c => c.category)))], [courses]);
  const levels = useMemo(() => ['all', ...Array.from(new Set(courses.map(c => c.level)))], [courses]);
  const curriculums = useMemo(() => ['all', ...Array.from(new Set(courses.map(c => c.curriculum).filter(Boolean) as string[]))], [courses]);
  
  // Extract all unique grades from all courses
  const allGrades = useMemo(() => {
      const grades = new Set<string>();
      courses.forEach(c => {
          if (c.targetGrades && Array.isArray(c.targetGrades)) {
              c.targetGrades.forEach(g => grades.add(g));
          }
      });
      return ['all', ...Array.from(grades)];
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses]; 

    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      result = result.filter(course => course.level === selectedLevel);
    }

    if (selectedCurriculum !== 'all') {
      result = result.filter(course => course.curriculum === selectedCurriculum);
    }

    if (selectedGrade !== 'all') {
        result = result.filter(course => course.targetGrades && course.targetGrades.includes(selectedGrade));
    }

    const getPrice = (c: Course) => {
        let p = 0;
        if (currency === 'USD') p = c.priceUsd ?? (c.price ? c.price * 1.41 : 0);
        else if (currency === 'SAR') p = c.priceSar ?? (c.price ? c.price * 5.3 : 0);
        else p = c.priceJod ?? c.price ?? 0;
        return (typeof p === 'number' && !isNaN(p)) ? p : 0;
    };

    if (sortBy === 'price-asc') {
      result.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [courses, selectedCategory, selectedLevel, selectedCurriculum, selectedGrade, sortBy, currency]);

  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.coursesTitle}</h1>
          <p className="mt-4 text-lg text-gray-600">{strings.coursesSubtitle}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">{strings.category}</label>
                    <select
                        id="category-filter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        <option value="all">{strings.allCategories}</option>
                        {categories.filter(c => c !== 'all').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="level-filter" className="block text-sm font-medium text-gray-700">{strings.level}</label>
                    <select
                        id="level-filter"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        <option value="all">{strings.allLevels}</option>
                        {levels.filter(l => l !== 'all').map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="curriculum-filter" className="block text-sm font-medium text-gray-700">المنهاج</label>
                    <select
                        id="curriculum-filter"
                        value={selectedCurriculum}
                        onChange={(e) => setSelectedCurriculum(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        <option value="all">كل المناهج</option>
                        {curriculums.filter(c => c !== 'all').map(curr => <option key={curr} value={curr}>{curr}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="grade-filter" className="block text-sm font-medium text-gray-700">الصف الدراسي</label>
                    <select
                        id="grade-filter"
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        <option value="all">كل الصفوف</option>
                        {allGrades.filter(g => g !== 'all').map(grade => <option key={grade} value={grade}>{grade}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700">{strings.sortBy}</label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    >
                        <option value="default">{strings.sortDefault}</option>
                        <option value="price-asc">{strings.sortPriceAsc}</option>
                        <option value="price-desc">{strings.sortPriceDesc}</option>
                    </select>
                </div>
            </div>
        </div>

        {filteredAndSortedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCourses.map(course => (
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
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">{strings.noCoursesFound}</h3>
            <p className="text-gray-500 mt-2">{strings.noCoursesFoundDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;