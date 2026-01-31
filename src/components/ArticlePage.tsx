import React from 'react';
import { BlogPost, Language } from '../types';

interface ArticlePageProps {
    post: BlogPost;
    onBack: () => void;
    strings: { [key: string]: string };
    language: Language;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ post, onBack, strings, language }) => {
    const postDate = new Date(post.date);
    const formattedDate = !isNaN(postDate.getTime()) ? postDate.toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : post.date;

    return (
        <div className="py-12 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
                <button onClick={onBack} className="text-green-600 hover:underline mb-8">&larr; {strings.backToBlog}</button>
                <article>
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg mb-8" />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">{post.title}</h1>
                    <p className="text-gray-500 mb-8">{strings.by} {post.author} ・ {formattedDate}</p>
                    <div 
                        className="prose lg:prose-xl max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </div>
        </div>
    );
};

export default ArticlePage;
