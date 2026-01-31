import React from 'react';
// Fix: Corrected import path for types.
import { BlogPost, Language } from '../types';

interface VideosPageProps {
  shorts: BlogPost[];
  onSelectShort: (id: string) => void;
  strings: { [key: string]: string };
  language: Language;
}

const ShortCard: React.FC<{ post: BlogPost; onSelect: () => void; }> = ({ post, onSelect }) => {
    return (
        <div onClick={onSelect} className="group relative rounded-lg overflow-hidden cursor-pointer">
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-white font-bold">{post.title}</h3>
            </div>
        </div>
    );
}

const VideosPage: React.FC<VideosPageProps> = ({ shorts, onSelectShort, strings, language }) => {
  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.videosTitle}</h1>
          <p className="mt-4 text-lg text-gray-600">شروحات سريعة ومفيدة في أقل من دقيقة.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {shorts.map(post => (
            <ShortCard key={post.id} post={post} onSelect={() => onSelectShort(post.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideosPage;
