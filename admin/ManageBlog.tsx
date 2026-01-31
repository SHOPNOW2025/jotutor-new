import React, { useState } from 'react';
// Fix: Corrected import path for types.
import { BlogPost } from '../types';

interface ManageBlogProps {
    posts: BlogPost[];
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const extractYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const PostFormModal: React.FC<{ post: BlogPost | null; onSave: (post: BlogPost) => void; onClose: () => void }> = ({ post, onSave, onClose }) => {
    const [type, setType] = useState<'article' | 'short'>(post?.type || 'article');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [formData, setFormData] = useState<Omit<BlogPost, 'id' | 'date' | 'type'>>({
        title: post?.title || '',
        author: post?.author || 'فريق JoTutor',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        imageUrl: post?.imageUrl || 'https://picsum.photos/seed/blog/800/400',
        tags: post?.tags || [],
        youtubeVideoId: post?.youtubeVideoId || undefined,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData(prev => ({ ...prev, tags: value.split(',').map(s => s.trim()) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalPostData: Partial<BlogPost> = {};
        
        if (type === 'short') {
            const videoId = extractYouTubeID(youtubeUrl);
            if (!videoId) {
                alert('الرجاء إدخال رابط يوتيوب صحيح.');
                return;
            }
            finalPostData = {
                youtubeVideoId: videoId,
                imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                content: formData.excerpt, // Use excerpt as the main content for shorts page
            };
        }

        const finalPost: BlogPost = {
            id: post?.id || Date.now().toString(),
            date: post?.date || new Date().toISOString(),
            type: type,
            ...formData,
            ...finalPostData,
        };
        onSave(finalPost);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{post ? 'تعديل المنشور' : 'إضافة منشور جديد'}</h2>
                    <div className="space-y-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">نوع المنشور</label>
                            <select value={type} onChange={(e) => setType(e.target.value as 'article' | 'short')} className="w-full p-2 border rounded bg-white">
                                <option value="article">مقال</option>
                                <option value="short">فيديو قصير (Short)</option>
                            </select>
                        </div>
                    
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="العنوان" className="w-full p-2 border rounded" required />
                        
                        {type === 'short' && (
                            <input type="url" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="رابط فيديو اليوتيوب (Short)" className="w-full p-2 border rounded" required />
                        )}

                        {type === 'article' && (
                             <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="رابط الصورة" className="w-full p-2 border rounded" />
                        )}
                       
                        <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder={type === 'short' ? 'شرح الفيديو' : 'مقتطف من المقال'} rows={3} className="w-full p-2 border rounded"></textarea>

                        {type === 'article' && (
                            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="المحتوى الكامل (يدعم HTML)" rows={10} className="w-full p-2 border rounded"></textarea>
                        )}
                        
                        <input name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} placeholder="الوسوم (مفصولة بفاصلة)" className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex justify-end mt-6 space-x-2 space-x-reverse">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">إلغاء</button>
                        <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageBlog: React.FC<ManageBlogProps> = ({ posts, setPosts }) => {
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
            {isModalOpen && <PostFormModal post={editingPost} onSave={handleSavePost} onClose={handleCloseModal} />}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">إدارة المدونة والفيديوهات</h1>
                <button onClick={() => handleOpenModal(null)} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
                    إضافة منشور جديد
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-right py-3 px-4 font-semibold text-sm">العنوان</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">النوع</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">التاريخ</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} className="border-b">
                                    <td className="py-3 px-4">{post.title}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.type === 'short' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {post.type === 'short' ? 'فيديو' : 'مقال'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">{new Date(post.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <button onClick={() => handleOpenModal(post)} className="text-blue-500 hover:underline mr-4">تعديل</button>
                                        <button onClick={() => handleRemovePost(post.id)} className="text-red-500 hover:underline">حذف</button>
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
