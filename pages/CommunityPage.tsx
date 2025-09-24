import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// FIX: Replaced deprecated useAppContext with useData from DataContext.
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Post, PostCategory } from '../types';
import { PlusIcon, ChatBubbleOvalLeftEllipsisIcon, HandThumbUpIcon, UserCircleIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    // FIX: Get data-related state from useData and auth state from useAuth.
    const { toggleLikePost } = useData();
    const { currentPublicUser } = useAuth();
    const isLiked = currentPublicUser ? post.likes.includes(currentPublicUser.id) : false;

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(!currentPublicUser) return;
        toggleLikePost(post.id);
    };

    return (
        <Link to={`/post/${post.id}`} className="block bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
                <img src={post.avatar} alt={post.username} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-gray-800 dark:text-white">{post.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString('ar-EG-u-nu-latn')} • <span className="font-semibold text-cyan-500">{post.category}</span></p>
                </div>
            </div>
            {post.title && <h3 className="text-lg font-bold mb-2">{post.title}</h3>}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-4">{post.content}</p>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                        <span>{post.comments.length}</span>
                    </div>
                </div>
                <button onClick={handleLikeClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <HandThumbUpIcon className="w-5 h-5"/>
                    <span className="font-semibold">{post.likes.length}</span>
                </button>
            </div>
        </Link>
    );
};

const NewPostForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // FIX: Replaced deprecated useAppContext with useData.
    const { addPost } = useData();
    const [category, setCategory] = useState<PostCategory>('نقاش عام');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        addPost({ category, title: title.trim() || undefined, content });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">الفئة</label>
                <select value={category} onChange={e => setCategory(e.target.value as PostCategory)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    <option value="نقاش عام">نقاش عام</option>
                    <option value="سؤال">سؤال</option>
                    <option value="للبيع">للبيع</option>
                    <option value="حدث">حدث</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">العنوان (اختياري)</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: تجمع ملاك الحي الأول" className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">المحتوى</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} required rows={6} placeholder="اكتب ما يدور في ذهنك..." className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">نشر</button>
            </div>
        </form>
    );
};

const CommunityPage: React.FC = () => {
    // FIX: Get data-related state from useData and auth state from useAuth.
    const { posts } = useData();
    const { isPublicAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');

    const sortedPosts = useMemo(() => {
        const sorted = [...posts];
        if (sortOrder === 'popular') {
            sorted.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
        } else {
            sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        return sorted;
    }, [posts, sortOrder]);

    const handleNewPostClick = () => {
        if (isPublicAuthenticated) {
            setIsModalOpen(true);
        } else {
            navigate('/login-user');
        }
    };
    
    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen animate-fade-in" dir="rtl">
            <PageBanner
                title="مجتمع هليوبوليس"
                subtitle="شارك بآرائك، اطرح أسئلتك، وتواصل مع جيرانك."
                icon={<ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 text-teal-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <label htmlFor="sortOrder" className="font-semibold">ترتيب حسب:</label>
                        <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value as 'latest' | 'popular')} className="bg-white dark:bg-slate-800 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option value="latest">الأحدث</option>
                            <option value="popular">الأكثر تفاعلاً</option>
                        </select>
                    </div>
                    <button onClick={handleNewPostClick} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                        <PlusIcon className="w-5 h-5"/>
                        <span>منشور جديد</span>
                    </button>
                </div>

                {sortedPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedPosts.map(post => <PostCard key={post.id} post={post} />)}
                    </div>
                ) : (
                    <EmptyState
                        icon={<ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 text-slate-400" />}
                        title="لا توجد منشورات بعد"
                        message="كن أول من يبدأ نقاشاً في مجتمع هليوبوليس الجديدة!"
                    >
                         <button onClick={handleNewPostClick} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5"/>
                            <span>أضف أول منشور</span>
                        </button>
                    </EmptyState>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إنشاء منشور جديد">
                    <NewPostForm onClose={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </div>
    );
};

export default CommunityPage;