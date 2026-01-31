
import React from 'react';
// Fix: Corrected import path for types.
import { Testimonial, HomepageContent } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  content: HomepageContent;
  strings: { [key: string]: string };
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, content, strings }) => {
  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold">{content?.testimonialsTitle || strings.testimonialsTitle}</h2>
          <p className="mt-4 text-lg text-blue-200">{content?.testimonialsSubtitle || strings.testimonialsSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-blue-800 p-8 rounded-xl shadow-lg flex flex-col items-center text-center">
              <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-24 h-24 rounded-full border-4 border-green-400 object-cover mb-6" />
              <p className="text-blue-200 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div>
                <h4 className="font-bold text-xl text-white">{testimonial.name}</h4>
                <p className="text-green-400">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;