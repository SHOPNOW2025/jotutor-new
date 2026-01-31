import React from 'react';
// Fix: Corrected import path for types.
import { BlogPost, Language } from '../types';

interface BlogPageProps {
  posts: BlogPost[];
  onSelectPost: (id: string) => void;
  strings: { [key: string]: string };
  language: Language;
}

const BlogCard: React.FC<{ post: BlogPost; onSelect: () => void; strings: { [key: string]: string }, language: Language }> = ({ post, onSelect, strings, language }) => {
    const postDate = new Date(post.date);
    const formattedDate = !isNaN(postDate.getTime()) ? postDate.toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : post.date;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
            <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{strings.by} {post.author} ・ {formattedDate}</p>
                <h3 className="text-xl font-bold text-blue-900 mb-3 h-14 overflow-hidden">{post.title}</h3>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">{post.excerpt}</p>
                <button onClick={onSelect} className="font-semibold text-green-600 hover:text-green-700">
                    {strings.readMore}
                </button>
            </div>
        </div>
    );
}

const BlogPage: React.FC<BlogPageProps> = ({ posts, onSelectPost, strings, language }) => {
  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-900">{strings.blogTitle}</h1>
          <p className="mt-4 text-lg text-gray-600">نصائح ومقالات مفيدة للطلاب وأولياء الأمور.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} onSelect={() => onSelectPost(post.id)} strings={strings} language={language} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
