import React from 'react';
import { BlogPost, Language } from '../types';

interface ShortPlayerPageProps {
    post: BlogPost;
    onBack: () => void;
    strings: { [key: string]: string };
    language: Language;
}

const ShortPlayerPage: React.FC<ShortPlayerPageProps> = ({ post, onBack, strings, language }) => {
    const postDate = new Date(post.date);
    const formattedDate = !isNaN(postDate.getTime()) ? postDate.toLocaleDateString(language === 'ar' ? 'ar-JO' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : post.date;

    return (
        <div className="py-12 bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
            <div className="container mx-auto px-6 max-w-2xl">
                <button onClick={onBack} className="text-green-400 hover:underline mb-6">&larr; {strings.backToVideos}</button>
                <div className="bg-black rounded-lg shadow-xl overflow-hidden">
                    <div className="aspect-w-9 aspect-h-16">
                        <iframe
                            src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
                            title={post.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </div>
                <div className="mt-6 text-center">
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <p className="text-gray-400 mb-4">{strings.by} {post.author} ・ {formattedDate}</p>
                    <p className="text-gray-300">{post.excerpt}</p>
                </div>
            </div>
        </div>
    );
};

export default ShortPlayerPage;
