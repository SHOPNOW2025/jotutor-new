import React, { useState } from 'react';
import { UserProfile, OnboardingOptions, Language } from '../types';

interface OnboardingWizardProps {
    options: OnboardingOptions;
    onSignupSuccess: (profile: UserProfile) => Promise<string | null>;
    onClose: () => void;
    strings: { [key: string]: string };
    language?: Language;
}

const Stepper: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
    return (
        <div className="flex items-center justify-center mb-6 px-4">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step}
                    </div>
                    {index < totalSteps - 1 && (
                        <div className={`flex-1 h-0.5 transition-colors duration-300 ${currentStep > step ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ options, onSignupSuccess, onClose, strings, language = 'ar' }) => {
    const [step, setStep] = useState(1);
    const [countryCode, setCountryCode] = useState('+962'); // Default to Jordan
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        userType: 'Student',
        subjects: [],
        serviceType: options.serviceTypes?.[0],
        educationStage: options.educationStages?.[0],
        curriculum: '', 
        phone: '',
    });
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Country Codes List
    const countryCodes = [
        { code: '+962', flag: '🇯🇴', name: 'الأردن' },
        { code: '+966', flag: '🇸🇦', name: 'السعودية' },
        { code: '+971', flag: '🇦🇪', name: 'الإمارات' },
        { code: '+965', flag: '🇰🇼', name: 'الكويت' },
        { code: '+974', flag: '🇶🇦', name: 'قطر' },
        { code: '+973', flag: '🇧🇭', name: 'البحرين' },
        { code: '+20', flag: '🇪🇬', name: 'مصر' },
        { code: '+970', flag: '🇵🇸', name: 'فلسطين' },
    ];

    const validateStep = (currentStep: number): boolean => {
        setError('');
        switch (currentStep) {
            case 4: // Grade
                if (!formData.grade?.trim()) {
                    setError(strings.errorGradeRequired);
                    return false;
                }
                break;
            case 5: // Curriculum
                if (!formData.curriculum) {
                    setError("الرجاء اختيار منهاج واحد على الأقل.");
                    return false;
                }
                break;
            case 6: // Subjects
                if (!formData.subjects || formData.subjects.length === 0) {
                    setError(strings.errorSubjectsRequired);
                    return false;
                }
                break;
            case 7: // Personal Info
                if (!formData.username?.trim()) {
                    setError(strings.errorFullNameRequired);
                    return false;
                }
                if (!formData.age?.trim()) {
                    setError(strings.errorAgeRequired);
                    return false;
                }
                if (!formData.phone?.trim()) {
                    setError(strings.errorPhoneRequired);
                    return false;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!formData.email?.trim() || !emailRegex.test(formData.email)) {
                    setError(strings.errorEmailInvalid);
                    return false;
                }
                if (!formData.password || formData.password.length < 6) {
                    setError(strings.errorPasswordInvalid);
                    return false;
                }
                break;
            default:
                break;
        }
        return true;
    };


    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };
    const handleBack = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    const handleSelect = (key: keyof UserProfile, value: any) => {
        setError('');
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubjectToggle = (subject: string) => {
        setError('');
        setFormData(prev => {
            const subjects = prev.subjects || [];
            const newSubjects = subjects.includes(subject)
                ? subjects.filter(s => s !== subject)
                : [...subjects, subject];
            return { ...prev, subjects: newSubjects };
        });
    };

    const handleCurriculumToggle = (curr: string) => {
        setError('');
        setFormData(prev => {
            const currentList = prev.curriculum ? prev.curriculum.split(', ') : [];
            let newList;
            if (currentList.includes(curr)) {
                newList = currentList.filter(c => c !== curr);
            } else {
                newList = [...currentList, curr];
            }
            return { ...prev, curriculum: newList.join(', ') };
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!termsAgreed) {
            setError(strings.errorAgreeToTerms);
            return;
        }
        
        if (!validateStep(7)) return;

        setIsSubmitting(true);
        // Combine country code with phone number
        const fullPhone = `${countryCode}${formData.phone?.replace(/^0+/, '')}`;

        const finalProfile: UserProfile = {
            id: Date.now().toString(),
            username: formData.username || '',
            email: formData.email || '',
            phone: fullPhone,
            password: formData.password || '',
            userType: formData.userType || 'Student',
            serviceType: formData.serviceType || '',
            educationStage: formData.educationStage || '',
            grade: formData.grade || '',
            curriculum: formData.curriculum || '',
            subjects: formData.subjects || [],
            age: formData.age || '',
        };
        const errorMessage = await onSignupSuccess(finalProfile);
        if (errorMessage) {
            setError(errorMessage);
        }
        setIsSubmitting(false);
    };

    const totalSteps = 8;
    
    const serviceTypeDetails = {
        [options.serviceTypes[0]]: strings.serviceType1Desc,
        [options.serviceTypes[1]]: strings.serviceType2Desc,
        [options.serviceTypes[2]]: strings.serviceType3Desc,
        [options.serviceTypes[3]]: strings.serviceType4Desc,
        [options.serviceTypes[4]]: strings.serviceType5Desc,
    };
    
    const educationStageDetails = {
        [options.educationStages[0]]: strings.educationStage1Desc,
        [options.educationStages[1]]: strings.educationStage2Desc,
        [options.educationStages[2]]: strings.educationStage3Desc,
        [options.educationStages[3]]: strings.educationStage4Desc,
        [options.educationStages[4]]: strings.educationStage5Desc,
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep1Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep1Desc}</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {['Student', 'Parent'].map(type => (
                                <button key={type} type="button" onClick={() => handleSelect('userType', type as 'Student' | 'Parent')} className={`p-4 border rounded-lg w-full sm:w-40 text-center transition-all duration-200 ${formData.userType === type ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:border-green-400'}`}>
                                    {strings[`userType${type}`]}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep2Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep2Desc}</p>
                        <div className="space-y-3">
                            {options.serviceTypes.map(type => (
                                <button key={type} type="button" onClick={() => handleSelect('serviceType', type)} className={`w-full text-right p-3 border rounded-lg transition-all duration-200 ${formData.serviceType === type ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:border-green-400'}`}>
                                    <span className="font-semibold text-blue-900">{type}</span>
                                    <p className="text-sm text-gray-600">{serviceTypeDetails[type]}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                     <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep3Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep3Desc}</p>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {options.educationStages.map(stage => (
                                <button key={stage} type="button" onClick={() => handleSelect('educationStage', stage)} className={`w-full text-right p-3 border rounded-lg transition-all duration-200 ${formData.educationStage === stage ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:border-green-400'}`}>
                                    <span className="font-semibold text-blue-900">{stage}</span>
                                    <p className="text-sm text-gray-600">{educationStageDetails[stage]}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 4:
                const gradesEn = ['KG1', 'KG2', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'College'];
                const gradesAr = ['روضة 1', 'روضة 2', 'الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'الصف السابع', 'الصف الثامن', 'الصف التاسع', 'الصف العاشر', 'الصف الحادي عشر', 'الصف الثاني عشر (توجيهي)', 'جامعي'];
                const grades = language === 'ar' ? gradesAr : gradesEn;

                return (
                    <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep4Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep4Desc}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                             {grades.map(grade => (
                                <button key={grade} type="button" onClick={() => handleSelect('grade', grade)} className={`p-2 border rounded-lg text-sm font-medium transition-all duration-200 ${formData.grade === grade ? 'bg-green-100 border-green-500 ring-2 ring-green-500 text-green-800' : 'bg-white hover:border-green-400 text-gray-700'}`}>
                                    {grade}
                                </button>
                             ))}
                        </div>
                    </div>
                );
            case 5:
                 const selectedCurriculums = formData.curriculum ? formData.curriculum.split(', ') : [];
                 return (
                     <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep5Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep5Desc} (يمكنك اختيار أكثر من منهاج)</p>
                        <div className="space-y-3">
                            {options.curriculums.map(c => (
                                <button key={c} type="button" onClick={() => handleCurriculumToggle(c)} className={`w-full text-right p-3 border rounded-lg transition-all duration-200 flex justify-between items-center ${selectedCurriculums.includes(c) ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:border-green-400'}`}>
                                    <span className="font-semibold text-blue-900">{c}</span>
                                    {selectedCurriculums.includes(c) && <span className="text-green-600 font-bold">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                const isLearningLanguages = formData.serviceType === options.serviceTypes[4];
                const title = isLearningLanguages ? strings.onboardingStep6Title_languages : strings.onboardingStep6Title;
                const description = isLearningLanguages ? strings.onboardingStep6Desc_languages : strings.onboardingStep6Desc;
                const itemsToShow = isLearningLanguages ? (options.languages || []) : options.subjects;
                
                return (
                     <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
                        <p className="text-center text-gray-600 mb-4">{description}</p>
                        <div className="flex flex-wrap gap-2 justify-center max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-md">
                            {itemsToShow.map(item => (
                                 <button key={item} type="button" onClick={() => handleSubjectToggle(item)} className={`px-4 py-2 border rounded-full text-sm transition-colors ${formData.subjects?.includes(item) ? 'bg-green-500 text-white border-green-500' : 'bg-white hover:border-green-400'}`}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep7Title}</h3>
                        <p className="text-center text-gray-600 mb-4">{strings.onboardingStep7Desc}</p>
                        <input type="text" placeholder={strings.fullName} onChange={e => handleSelect('username', e.target.value)} value={formData.username || ''} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
                        <input type="number" placeholder={strings.age} onChange={e => handleSelect('age', e.target.value)} value={formData.age || ''} className="w-full p-3 border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 outline-none" required min="1" max="100" />
                        
                        {/* Phone with Country Code Select */}
                        <div className="flex gap-2">
                            <select 
                                value={countryCode} 
                                onChange={(e) => setCountryCode(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md bg-white font-medium text-sm focus:ring-2 focus:ring-green-500 outline-none min-w-[100px]"
                            >
                                {countryCodes.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.flag} {c.code}
                                    </option>
                                ))}
                            </select>
                            <input 
                                type="tel" 
                                placeholder={strings.phone} 
                                onChange={e => handleSelect('phone', e.target.value)} 
                                value={formData.phone || ''} 
                                className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" 
                                required 
                            />
                        </div>

                        <input type="email" placeholder={strings.email} onChange={e => handleSelect('email', e.target.value)} value={formData.email || ''} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" required />
                        <input type="password" placeholder={strings.password} onChange={e => handleSelect('password', e.target.value)} value={formData.password || ''} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none" required minLength={6} />
                    </div>
                );
            case 8:
                return (
                     <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep8Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep8Desc}</p>
                        <div className="bg-blue-50 p-4 rounded-md text-center text-blue-800">
                           <p>{strings.verificationMessage}</p>
                        </div>
                        <div className="mt-6">
                            <label className="flex items-center space-x-2 space-x-reverse justify-center">
                                <input type="checkbox" checked={termsAgreed} onChange={(e) => setTermsAgreed(e.target.checked)} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                                <span className="text-sm text-gray-700">{strings.agreeToTerms}</span>
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl relative p-2 md:p-4">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <form onSubmit={handleSubmit} className="mt-8">
                <Stepper currentStep={step} totalSteps={totalSteps} />
                <div className="min-h-[350px] flex flex-col justify-center py-4 bg-gray-50 p-6 rounded-lg shadow-inner">
                    {renderStepContent()}
                </div>
                 {error && <p className="text-red-500 text-center text-sm mt-4">{error}</p>}
                <div className="flex justify-between mt-6">
                    {step > 1 ? (
                        <button type="button" onClick={handleBack} className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors">{strings.back}</button>
                    ) : <div />}
                    
                    {step < totalSteps ? (
                        <button type="button" onClick={handleNext} className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors">{strings.next}</button>
                    ) : (
                        <button type="submit" disabled={!termsAgreed || isSubmitting} className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {isSubmitting ? `${strings.generating}...` : strings.finishSignup}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default OnboardingWizard;