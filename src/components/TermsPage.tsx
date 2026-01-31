import React from 'react';

interface TermsPageProps {
  content: string;
  strings: { [key: string]: string };
}

const TermsPage: React.FC<TermsPageProps> = ({ content, strings }) => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.termsTitle}</h1>
        </div>
         <div className="prose lg:prose-xl mx-auto text-gray-700 leading-relaxed">
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
