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
    const [error, setError] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const loginSuccess = await onLogin(email, password);
        if (!loginSuccess) {
            setError('Invalid credentials');
        }
    };

    const joinTeacherUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdR8nxLM30CJgzGiBLyeY9Txcug_YfrRXa2xMVYOUe0ldSUZw/viewform?usp=sf_link";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="p-8">
                    <div className="flex border-b mb-6">
                        <button onClick={() => setView('login')} className={`flex-1 py-2 text-center font-semibold ${view === 'login' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}>{strings.login}</button>
                        <button onClick={() => setView('signup')} className={`flex-1 py-2 text-center font-semibold ${view === 'signup' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}>{strings.signup}</button>
                    </div>

                    {view === 'login' ? (
                        <div>
                            <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">{strings.loginWelcome}</h2>
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <input type="email" placeholder={strings.email} value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-md" required />
                                <input type="password" placeholder={strings.password} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-md" required />
                                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                                <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600">{strings.login}</button>
                            </form>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-blue-900 mb-4">{strings.signupTitle}</h2>
                            <p className="text-gray-600 mb-6">{strings.signupDesc}</p>
                            <button onClick={onSwitchToOnboarding} className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600">{strings.signupNewStudent}</button>
                             <a href={joinTeacherUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-block mt-3 bg-blue-900 text-white font-bold py-3 rounded-md hover:bg-blue-800">{strings.signupJoinTeacher}</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;