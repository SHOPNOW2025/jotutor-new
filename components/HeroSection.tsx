import React, { useState, useEffect } from 'react';
// Fix: Corrected import path for types.
import { HeroSlide } from '../types';

interface HeroSectionProps {
  onSignupClick: () => void;
  heroSlides: HeroSlide[];
  strings: { [key: string]: string };
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSignupClick, heroSlides = [], strings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [heroSlides]);

  const currentSlide = heroSlides[currentIndex];

  const Title: React.FC<{ text: string }> = ({ text }) => {
    if (!text) return null;
    const words = text.split(' ');
    const lastWord = words.pop();
    const mainText = words.join(' ');
    return (
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {mainText} <span className="text-green-400">{lastWord}</span>
        </h1>
    );
  };

  return (
    <section className="relative text-white" style={{ minHeight: '500px' }}>
       <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                opacity: index === currentIndex ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text contrast */}
        </div>

      <div className="container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center relative z-10">
        <div className="lg:w-2/3 text-center lg:text-right">
          {currentSlide && <Title text={currentSlide.title} />}
          {currentSlide && (
            <p className="mt-6 text-lg text-gray-200 max-w-2xl mx-auto lg:mx-0" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              {currentSlide.description}
            </p>
          )}
          <div className="mt-8 flex justify-center lg:justify-start">
            <button onClick={onSignupClick} className="bg-green-500 text-white font-bold text-lg py-3 px-8 rounded-full hover:bg-green-600 transition-transform duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2 space-x-reverse">
              <span>{strings.heroButton}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l-5 5 5 5m-5-5h12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;