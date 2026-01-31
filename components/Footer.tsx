import React from 'react';
// Fix: Corrected import path for types.
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
  strings: { [key: string]: string };
}

const Footer: React.FC<FooterProps> = ({ onNavigate, strings }) => {
  // Fix: Correctly typed footerLinks to allow for the special 'join' case, resolving the type error.
  const footerLinks: { label: string; page: Page | 'join' }[] = [
    { label: strings.navAbout, page: 'about' },
    { label: strings.footerJoinTeacher, page: 'join' },
    { label: strings.footerFAQ, page: 'faq' },
    { label: strings.navBlog, page: 'blog' },
  ];

  const legalLinks: { label: string; page: Page }[] = [
    { label: strings.privacyTitle, page: 'privacy' },
    { label: strings.termsTitle, page: 'terms' },
  ];

  const socialLinks = [
    { name: 'Facebook', url: '#'},
    { name: 'Twitter', url: '#'},
    { name: 'LinkedIn', url: '#'},
  ];

  const joinTeacherUrl = "https://docs.google.com/forms/d/e/1FAIpQLSdR8nxLM30CJgzGiBLyeY9Txcug_YfrRXa2xMVYOUe0ldSUZw/viewform?usp=sf_link";

  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <button onClick={() => onNavigate('home')} className="flex items-center space-x-2 space-x-reverse mb-4">
                <img src="https://i.ibb.co/XxGsLR3D/15.png" alt="JoTutor Logo" className="h-10 w-auto bg-white rounded-md p-1" />
                <span className="font-bold text-2xl">JoTutor</span>
            </button>
            <p className="text-blue-200">
              {strings.footerDescription}
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h5 className="font-bold text-lg mb-4">{strings.footerQuickLinks}</h5>
            <ul className="space-y-2">
              {footerLinks.map(link => (
                <li key={link.page}>
                  {link.page === 'join' ? (
                    <a href={joinTeacherUrl} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  ) : (
                    <button onClick={() => onNavigate(link.page as Page)} className="text-blue-200 hover:text-white transition-colors">{link.label}</button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-bold text-lg mb-4">{strings.footerLegal}</h5>
            <ul className="space-y-2">
              {legalLinks.map(link => (
                <li key={link.page}>
                  <button onClick={() => onNavigate(link.page)} className="text-blue-200 hover:text-white transition-colors">{link.label}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300 text-sm">&copy; {new Date().getFullYear()} {strings.footerRights}</p>
          <div className="flex space-x-4 space-x-reverse mt-4 md:mt-0">
            {socialLinks.map(social => (
              <a key={social.name} href={social.url} className="text-blue-300 hover:text-white transition-colors" aria-label={social.name}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  {social.name === 'Facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                  {social.name === 'Twitter' && <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />}
                  {social.name === 'LinkedIn' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;