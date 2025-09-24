import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import { ArrowLeftIcon, HandThumbUpIcon, ChatBubbleOvalLeftEllipsisIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { posts, toggleLikePost, addComment } = useData();
    const { currentPublicUser } = useAuth();
    const [newComment, setNewComment] = useState('');

    const post = useMemo(() => posts.find(p => p.id === Number(postId)), [posts, postId]);
    
    if (!post) {
        return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    }

    const isLiked = currentPublicUser ? post.likes.includes(currentPublicUser.id) : false;

    const handleLikeClick = () => {
        if (!currentPublicUser) {
            navigate('/login-user');
            return;
        }
        toggleLikePost(post.id);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPublicUser) {
            navigate('/login-user');
            return;
        }
        if (newComment.trim()) {
            addComment(post.id, { content: newComment });
            setNewComment('');
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen animate-fade-in" dir="rtl">
            <PageBanner
                title={post.title || `منشور بواسطة ${post.username}`}
                subtitle={`نشر في ${new Date(post.date).toLocaleDateString('ar-EG-u-nu-latn')} • ${post.comments.length} تعليقات`}
                icon={<ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 text-teal-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-8">
                        <ArrowLeftIcon className="w-5 h-5"/>
                        <span>العودة إلى المجتمع</span>
                    </button>

                    <article className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                            <Link to={`/user/${post.userId}`}>
                                <img src={post.avatar} alt={post.username} className="w-16 h-16 rounded-full object-cover" />
                            </Link>
                            <div>
                                <Link to={`/user/${post.userId}`} className="text-xl font-bold text-gray-800 dark:text-white hover:underline">{post.username}</Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(post.date).toLocaleString('ar-EG-u-nu-latn', { dateStyle: 'medium', timeStyle: 'short' })}
                                </p>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                            <p>{post.content}</p>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                                <span>{post.comments.length} تعليقات</span>
                            </div>
                            <button onClick={handleLikeClick} className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-colors ${isLiked ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                                <HandThumbUpIcon className="w-5 h-5"/>
                                <span>{post.likes.length} إعجاب</span>
                            </button>
                        </div>
                    </article>

                    {/* Comments Section */}
                    <div className="mt-10">
                        <h3 className="text-2xl font-bold mb-6">التعليقات</h3>
                        {/* Add Comment Form */}
                        {currentPublicUser ? (
                            <form onSubmit={handleCommentSubmit} className="mb-8 flex items-start gap-4">
                                <img src={currentPublicUser.avatar} alt="Your avatar" className="w-10 h-10 rounded-full object-cover"/>
                                <div className="flex-grow">
                                    <textarea
                                        value={newComment}
                                        onChange={e => setNewComment(e.target.value)}
                                        placeholder="أضف تعليقك..."
                                        rows={3}
                                        className="w-full bg-white dark:bg-slate-800 p-3 rounded-md focus:ring-2 focus:ring-cyan-500 border border-slate-300 dark:border-slate-600"
                                    ></textarea>
                                    <button type="submit" className="mt-2 px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                                        إرسال
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="mb-8 text-center p-4 bg-slate-200 dark:bg-slate-800 rounded-lg">
                                <Link to="/login-user" className="font-semibold text-cyan-600 hover:underline">سجل الدخول</Link>
                                <span> للمشاركة في النقاش.</span>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            {post.comments.length > 0 ? post.comments.map(comment => (
                                <div key={comment.id} className="flex items-start gap-4">
                                    <Link to={`/user/${comment.userId}`}>
                                        <img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full object-cover" />
                                    </Link>
                                    <div className="flex-grow bg-white dark:bg-slate-800 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <Link to={`/user/${comment.userId}`} className="font-bold text-gray-800 dark:text-white hover:underline">{comment.username}</Link>
                                            <p className="text-xs text-gray-400">{new Date(comment.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                                        </div>
                                        <p className="mt-2 text-gray-600 dark:text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500 py-8">لا توجد تعليقات بعد. كن أول من يعلق!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
