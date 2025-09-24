import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Spinner from '../components/common/Spinner';
import { ArrowLeftIcon, HandThumbUpIcon, ChatBubbleOvalLeftEllipsisIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { posts, currentPublicUser, toggleLikePost, addComment } = useAppContext();
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
                title={post.title || `منشور من ${post.username}`}
                subtitle={`في قسم ${post.category}`}
                icon={<ChatBubbleOvalLeftEllipsisIcon className="w-10 h-10 text-teal-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
                 <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5"/>
                    <span>العودة إلى المجتمع</span>
                </button>

                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    {/* Post Content */}
                    <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                         <div className="flex items-center gap-4 mb-4">
                            <Link to={`/user/${post.userId}`}>
                                <img src={post.avatar} alt={post.username} className="w-14 h-14 rounded-full object-cover hover:ring-2 ring-cyan-400" />
                            </Link>
                            <div>
                                <Link to={`/user/${post.userId}`} className="font-bold text-lg text-gray-800 dark:text-white hover:underline">{post.username}</Link>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(post.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-6 mt-6">
                            <button onClick={handleLikeClick} className={`flex items-center gap-2 text-lg font-semibold ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}>
                                <HandThumbUpIcon className="w-6 h-6"/> {post.likes.length}
                            </button>
                             <div className="flex items-center gap-2 text-lg text-gray-500 dark:text-gray-400">
                                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6"/> {post.comments.length}
                            </div>
                        </div>
                    </div>
                    {/* Comments Section */}
                    <div className="pt-6">
                        <h2 className="text-2xl font-bold mb-6">التعليقات ({post.comments.length})</h2>
                        <div className="space-y-6">
                             {currentPublicUser && (
                                <form onSubmit={handleCommentSubmit} className="flex items-start gap-4">
                                    <img src={currentPublicUser.avatar} alt="avatar" className="w-10 h-10 rounded-full"/>
                                    <div className="flex-grow">
                                        <textarea value={newComment} onChange={e => setNewComment(e.target.value)} required placeholder="أضف تعليقاً..." rows={2} className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500"></textarea>
                                        <button type="submit" className="mt-2 px-4 py-2 bg-cyan-500 text-white font-semibold text-sm rounded-lg hover:bg-cyan-600">إضافة تعليق</button>
                                    </div>
                                </form>
                            )}
                            {post.comments.map(comment => (
                                <div key={comment.id} className="flex items-start gap-4">
                                    <Link to={`/user/${comment.userId}`}><img src={comment.avatar} alt={comment.username} className="w-10 h-10 rounded-full"/></Link>
                                    <div className="flex-grow bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                        <div className="flex items-baseline gap-2">
                                            <Link to={`/user/${comment.userId}`} className="font-bold text-gray-800 dark:text-white hover:underline">{comment.username}</Link>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                                        </div>
                                        <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
