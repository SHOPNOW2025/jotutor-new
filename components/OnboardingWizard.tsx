import React, { useState } from 'react';
// Fix: Corrected import path for types.
import { UserProfile, OnboardingOptions } from '../types';

interface OnboardingWizardProps {
    options: OnboardingOptions;
    onSignupSuccess: (profile: UserProfile) => Promise<string | null>;
    strings: { [key: string]: string };
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

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ options, onSignupSuccess, strings }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<UserProfile>>({
        userType: 'Student',
        subjects: [],
        serviceType: options.serviceTypes?.[0],
        educationStage: options.educationStages?.[0],
        curriculum: options.curriculums?.[0],
        phone: '',
    });
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateStep = (currentStep: number): boolean => {
        setError(''); // Clear previous errors
        switch (currentStep) {
            case 4: // Grade
                if (!formData.grade?.trim()) {
                    setError(strings.errorGradeRequired);
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
                if (!formData.dob) {
                    setError(strings.errorDobRequired);
                    return false;
                }
                if (!formData.phone?.trim()) {
                    setError(strings.errorPhoneRequired);
                    return false;
                }
                // Simple email regex
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
                // No validation needed for other steps as they have defaults
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
        setError(''); // Clear errors when going back
        setStep(prev => prev - 1);
    };

    const handleSelect = (key: keyof UserProfile, value: any) => {
        setError(''); // Clear error on input change
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubjectToggle = (subject: string) => {
        setError(''); // Clear error on input change
        setFormData(prev => {
            const subjects = prev.subjects || [];
            const newSubjects = subjects.includes(subject)
                ? subjects.filter(s => s !== subject)
                : [...subjects, subject];
            return { ...prev, subjects: newSubjects };
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!termsAgreed) {
            setError(strings.errorAgreeToTerms);
            return;
        }
        
        // Re-validate the final step before submitting
        if (!validateStep(7)) {
            return;
        }

        setIsSubmitting(true);
        const finalProfile: UserProfile = {
            id: Date.now().toString(), // Will be replaced by Firebase UID in App.tsx
            username: formData.username || '',
            email: formData.email || '',
            phone: formData.phone || '',
            password: formData.password || '',
            userType: formData.userType || 'Student',
            serviceType: formData.serviceType || '',
            educationStage: formData.educationStage || '',
            grade: formData.grade || '',
            curriculum: formData.curriculum || '',
            subjects: formData.subjects || [],
            dob: formData.dob || '',
        };
        const errorMessage = await onSignupSuccess(finalProfile);
        if (errorMessage) {
            setError(errorMessage);
        }
        // On success, the app navigates away, so no 'else' is needed.
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
            case 1: // User Type
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
            case 2: // Service Type
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
            case 3: // Education Stage
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
            case 4: // Grade
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep4Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep4Desc}</p>
                        <input type="text" placeholder={strings.gradePlaceholder} onChange={e => handleSelect('grade', e.target.value)} value={formData.grade || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
                    </div>
                );
            case 5: // Curriculum
                 return (
                     <div>
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep5Title}</h3>
                        <p className="text-center text-gray-600 mb-6">{strings.onboardingStep5Desc}</p>
                        <div className="space-y-3">
                            {options.curriculums.map(c => (
                                <button key={c} type="button" onClick={() => handleSelect('curriculum', c)} className={`w-full text-right p-3 border rounded-lg transition-all duration-200 ${formData.curriculum === c ? 'bg-green-100 border-green-500 ring-2 ring-green-500' : 'bg-white hover:border-green-400'}`}>
                                    <span className="font-semibold text-blue-900">{c}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 6: // Subjects or Languages
                const isLearningLanguages = formData.serviceType === options.serviceTypes[4]; // "اللغات"
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
            case 7: // Personal Info
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center mb-2">{strings.onboardingStep7Title}</h3>
                        <p className="text-center text-gray-600 mb-4">{strings.onboardingStep7Desc}</p>
                        <input type="text" placeholder={strings.fullName} onChange={e => handleSelect('username', e.target.value)} value={formData.username || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
                        <input type="date" placeholder={strings.dob} onChange={e => handleSelect('dob', e.target.value)} value={formData.dob || ''} className="w-full p-3 border border-gray-300 rounded-md text-gray-700" required />
                        <input type="tel" placeholder={strings.phone} onChange={e => handleSelect('phone', e.target.value)} value={formData.phone || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
                        <input type="email" placeholder={strings.email} onChange={e => handleSelect('email', e.target.value)} value={formData.email || ''} className="w-full p-3 border border-gray-300 rounded-md" required />
                        <input type="password" placeholder={strings.password} onChange={e => handleSelect('password', e.target.value)} value={formData.password || ''} className="w-full p-3 border border-gray-300 rounded-md" required minLength={6} />
                    </div>
                );
            case 8: // Verification
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
        <form onSubmit={handleSubmit} className="p-2 md:p-4">
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
    );
};

export default OnboardingWizard;