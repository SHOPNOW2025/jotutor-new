
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import ImageUploadInput from './ImageUploadInput';

interface ManageBlogProps {
    posts: BlogPost[];
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
    isEnglishAdmin?: boolean;
}

const extractYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const PostFormModal: React.FC<{ post: BlogPost | null; onSave: (post: BlogPost) => void; onClose: () => void; isEnglishAdmin?: boolean; }> = ({ post, onSave, onClose, isEnglishAdmin }) => {
    const [type, setType] = useState<'article' | 'short'>(post?.type || 'article');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [formData, setFormData] = useState<Partial<BlogPost>>({});

    useEffect(() => {
        if (isEnglishAdmin) {
            setFormData({
                title_en: post?.title_en || '',
                excerpt_en: post?.excerpt_en || '',
                content_en: post?.content_en || '',
                tags_en: post?.tags_en || [],
                // Readonly refs
                title: post?.title,
                imageUrl: post?.imageUrl,
            });
        } else {
            setFormData({
                title: post?.title || '',
                author: post?.author || 'فريق JoTutor',
                excerpt: post?.excerpt || '',
                content: post?.content || '',
                imageUrl: post?.imageUrl || 'https://picsum.photos/seed/blog/800/400',
                tags: post?.tags || [],
                youtubeVideoId: post?.youtubeVideoId || undefined,
            });
        }
    }, [post, isEnglishAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const key = isEnglishAdmin ? 'tags_en' : 'tags';
        setFormData(prev => ({ ...prev, [key]: value.split(',').map(s => s.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalPostData: Partial<BlogPost> = {};
        
        if (!isEnglishAdmin && type === 'short') {
            const videoId = extractYouTubeID(youtubeUrl);
            if (!videoId) {
                alert('الرجاء إدخال رابط يوتيوب صحيح.');
                return;
            }
            finalPostData = {
                youtubeVideoId: videoId,
                imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                content: formData.excerpt, 
            };
        }

        const finalPost: BlogPost = {
            ...(post || { id: Date.now().toString() } as BlogPost),
            date: post?.date || new Date().toISOString(),
            type: type, // Type shouldn't change in English edit mode usually, but kept for simplicity
            ...formData,
            ...finalPostData,
        };
        onSave(finalPost);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {isEnglishAdmin ? 'Edit Blog Post (English)' : (post ? 'تعديل المنشور' : 'إضافة منشور جديد')}
                    </h2>
                    <div className="space-y-4">
                        {!isEnglishAdmin && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنشور</label>
                                <select value={type} onChange={(e) => setType(e.target.value as 'article' | 'short')} className="w-full p-2 border rounded bg-white">
                                    <option value="article">مقال</option>
                                    <option value="short">فيديو قصير (Short)</option>
                                </select>
                            </div>
                        )}
                        
                        {isEnglishAdmin ? (
                            <>
                                <div className="bg-gray-100 p-2 rounded text-xs mb-2">
                                    <span className="text-gray-500">Arabic Title:</span> {formData.title || 'Not set'}
                                </div>
                                <input name="title_en" value={formData.title_en || ''} onChange={handleChange} placeholder="Title (English)" className="w-full p-2 border rounded" required />
                                <textarea name="excerpt_en" value={formData.excerpt_en || ''} onChange={handleChange} placeholder="Excerpt/Short Description (English)" rows={3} className="w-full p-2 border rounded"></textarea>
                                {type === 'article' && (
                                    <textarea name="content_en" value={formData.content_en || ''} onChange={handleChange} placeholder="Full Content (HTML Supported) - English" rows={10} className="w-full p-2 border rounded"></textarea>
                                )}
                                <input name="tags_en" value={(formData.tags_en || []).join(', ')} onChange={handleTagsChange} placeholder="Tags (comma separated) English" className="w-full p-2 border rounded" />
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Image (Shared)</label>
                                    <ImageUploadInput
                                        value={formData.imageUrl || ''}
                                        onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                        placeholder="Image URL"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <input name="title" value={formData.title || ''} onChange={handleChange} placeholder="العنوان" className="w-full p-2 border rounded" required />
                                
                                {type === 'short' && (
                                    <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="رابط فيديو اليوتيوب (Short)" className="w-full p-2 border rounded" required />
                                )}

                                {type === 'article' && (
                                     <div>
                                        <label className="block text-sm text-gray-600 mb-1">صورة المقال</label>
                                        <ImageUploadInput
                                            value={formData.imageUrl || ''}
                                            onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                                            placeholder="رابط الصورة"
                                        />
                                     </div>
                                )}
                               
                                <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleChange} placeholder={type === 'short' ? 'شرح الفيديو' : 'مقتطف من المقال'} rows={3} className="w-full p-2 border rounded"></textarea>

                                {type === 'article' && (
                                    <textarea name="content" value={formData.content || ''} onChange={handleChange} placeholder="المحتوى الكامل (يدعم HTML)" rows={10} className="w-full p-2 border rounded"></textarea>
                                )}
                                
                                <input name="tags" value={(formData.tags || []).join(', ')} onChange={handleTagsChange} placeholder="الوسوم (مفصولة بفاصلة)" className="w-full p-2 border rounded" />
                            </>
                        )}
                    </div>
                    <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">
                            {isEnglishAdmin ? 'Cancel' : 'إلغاء'}
                        </button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                            {isEnglishAdmin ? 'Save' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageBlog: React.FC<ManageBlogProps> = ({ posts, setPosts, isEnglishAdmin }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

    const handleOpenModal = (post: BlogPost | null) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handleSavePost = (postToSave: BlogPost) => {
        if (posts.some(p => p.id === postToSave.id)) {
            setPosts(prev => prev.map(p => p.id === postToSave.id ? postToSave : p));
        } else {
            setPosts(prev => [postToSave, ...prev]);
        }
        handleCloseModal();
    };

    const handleRemovePost = (id: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المنشور؟')) {
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    return (
        <div>
            {isModalOpen && <PostFormModal post={editingPost} onSave={handleSavePost} onClose={handleCloseModal} isEnglishAdmin={isEnglishAdmin} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{isEnglishAdmin ? 'Manage Blog (English)' : 'إدارة المدونة والفيديوهات'}</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    {isEnglishAdmin ? 'Add New Post' : 'إضافة منشور جديد'}
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">{isEnglishAdmin ? 'Title' : 'العنوان'}</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">{isEnglishAdmin ? 'Type' : 'النوع'}</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">{isEnglishAdmin ? 'Date' : 'التاريخ'}</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">{isEnglishAdmin ? 'Actions' : 'الإجراءات'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} className="border-b">
                                    <td className="py-3 px-4">
                                        <span className="font-medium">{isEnglishAdmin ? (post.title_en || post.title) : post.title}</span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.type === 'short' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {post.type === 'short' ? 'Short/Video' : 'Article'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{new Date(post.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(post)} className="text-blue-500 hover:underline mr-4">
                                            {isEnglishAdmin ? 'Edit' : 'تعديل'}
                                        </button>
                                        {!isEnglishAdmin && <button onClick={() => handleRemovePost(post.id)} className="text-red-500 hover:underline">حذف</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageBlog;
