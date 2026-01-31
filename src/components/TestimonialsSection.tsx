
import React from 'react';
import { Testimonial, HomepageContent } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  content: HomepageContent;
  strings: { [key: string]: string };
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, content, strings }) => {
  return (
    // Changed bg-blue-900 to bg-white
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          {/* Changed text colors to blue-900 and gray-600 for visibility on white background */}
          <h2 className="text-4xl font-extrabold text-blue-900">{content?.testimonialsTitle || strings.testimonialsTitle}</h2>
          <p className="mt-4 text-lg text-gray-600">{content?.testimonialsSubtitle || strings.testimonialsSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            // Cards remain bg-blue-800 (dark blue) with white text
            <div key={testimonial.id} className="bg-blue-800 p-8 rounded-xl shadow-lg flex flex-col items-center text-center relative group">
              <div className="relative">
                <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="w-24 h-24 rounded-full border-4 border-green-400 object-cover mb-6 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] transform hover:scale-[3.5] hover:rounded-lg hover:border-white hover:shadow-2xl hover:z-50 cursor-pointer relative" 
                />
              </div>
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
