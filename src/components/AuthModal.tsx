import React, { useState } from 'react';

interface AuthModalProps {
    initialView: 'login' | 'signup';
    onClose: () => void;
    onLogin: (email: string, password: string) => Promise<boolean>;
    onSwitchToOnboarding: () => void;
    strings: { [key: string]: string };
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose, onLogin, onSwitchToOnboarding, strings }) => {
    const [view, setView] = useState(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const loginSuccess = await onLogin(email, password);
        if (!loginSuccess) {
            setError(strings.errorInvalidCredentials || 'Invalid email or password.');
        }
    };

    const joinTeacherUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdR8nxLM30CJgzGiBLyeY9Txcug_YfrRXa2xMVYOUe0ldSUZw/viewform?usp=sf_link";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-8">
                    <div className="flex border-b mb-6">
                        <button onClick={() => setView('login')} className={`flex-1 py-2 text-center font-bold transition-colors ${view === 'login' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>{strings.login}</button>
                        <button onClick={() => setView('signup')} className={`flex-1 py-2 text-center font-bold transition-colors ${view === 'signup' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>{strings.signup}</button>
                    </div>

                    {view === 'login' ? (
                        <div>
                            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">{strings.loginWelcome}</h2>
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div>
                                    <input 
                                        type="email" 
                                        placeholder={strings.email} 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                                        required 
                                    />
                                </div>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder={strings.password} 
                                        value={password} 
                                        onChange={e => setPassword(e.target.value)} 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-12 ltr:pr-12 rtl:pl-12" 
                                        required 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 ltr:right-0 rtl:left-0 flex items-center px-4 text-gray-400 hover:text-green-600 transition-colors"
                                        title={showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {error && <p className="text-red-500 text-sm text-center font-bold bg-red-50 p-2 rounded">{error}</p>}
                                <button type="submit" className="w-full bg-green-500 text-white font-black py-3 rounded-lg hover:bg-green-600 transition-all active:scale-95 shadow-md">
                                    {strings.login}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-blue-900 mb-4">{strings.signupTitle}</h2>
                            <p className="text-gray-600 mb-6">{strings.signupDesc}</p>
                            <button onClick={onSwitchToOnboarding} className="w-full bg-green-500 text-white font-black py-3 rounded-lg hover:bg-green-600 transition-all active:scale-95 shadow-md">
                                {strings.signupNewStudent}
                            </button>
                             <a href={joinTeacherUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-block mt-3 bg-blue-900 text-white font-black py-3 rounded-lg hover:bg-blue-800 transition-all active:scale-95 shadow-md">
                                {strings.signupJoinTeacher}
                             </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;