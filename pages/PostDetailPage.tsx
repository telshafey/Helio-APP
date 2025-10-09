import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
// FIX: Added TrashIcon for comment deletion.
import { ArrowLeftIcon, HandThumbUpIcon, ChatBubbleOvalLeftEllipsisIcon, TrashIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';
import type { Post } from '../types';
import ShareButton from '../components/common/ShareButton';
import { useCommunity } from '../context/AppContext';

const PollDisplay: React.FC<{ post: Post }> = ({ post }) => {
    const { voteOnPoll } = useCommunity();
    const { currentPublicUser } = useAuth();
    const navigate = useNavigate();

    const { totalVotes, userVoteIndex } = useMemo(() => {
        if (!post.pollOptions) return { totalVotes: 0, userVoteIndex: -1 };
        const allVoters = new Set<number>();
        let voteIndex = -1;
        post.pollOptions.forEach((opt, index) => {
            opt.votes.forEach(voterId => {
                allVoters.add(voterId);
                if (currentPublicUser && voterId === currentPublicUser.id) {
                    voteIndex = index;
                }
            });
        });
        return { totalVotes: allVoters.size, userVoteIndex: voteIndex };
    }, [post.pollOptions, currentPublicUser]);
    
    const hasVoted = userVoteIndex > -1;

    const handleVote = (e: React.MouseEvent, optionIndex: number) => {
        if (!currentPublicUser) {
            navigate('/login-user');
            return;
        }
        voteOnPoll(post.id, optionIndex);
    };

    if (!post.pollOptions) return null;

    return (
        <div className="mt-6 space-y-3">
            <h3 className="text-xl font-bold mb-4">{post.title}</h3>
            {hasVoted ? (
                // Results View
                post.pollOptions.map((option, index) => {
                    const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    const isUserChoice = index === userVoteIndex;
                    return (
                        <div key={index} className={`p-3 border-2 rounded-lg ${isUserChoice ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-center font-semibold mb-1">
                                <span className={isUserChoice ? 'text-cyan-700 dark:text-cyan-300' : ''}>{option.option}</span>
                                <span>{Math.round(percentage)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })
            ) : (
                // Voting View
                post.pollOptions.map((option, index) => (
                    <button 
                        key={index} 
                        onClick={(e) => handleVote(e, index)}
                        className="w-full text-right p-4 font-semibold bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-transparent hover:border-cyan-400 transition"
                    >
                        {option.option}
                    </button>
                ))
            )}
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2">{totalVotes} إجمالي الأصوات</p>
        </div>
    );
};

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { posts, addComment, toggleLikePost, deleteComment } = useCommunity();
    const { currentPublicUser, isPublicAuthenticated } = useAuth();
    const [comment, setComment] = useState('');

    const post = useMemo(() => posts.find(p => p.id === Number(postId)), [posts, postId]);

    if (!post) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    const isLiked = currentPublicUser ? post.likes.includes(currentPublicUser.id) : false;

    const handleLikeClick = () => {
        if (!isPublicAuthenticated) {
            navigate('/login-user');
            return;
        }
        toggleLikePost(post.id);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        addComment(post.id, { content: comment });
        setComment('');
    };

    const handleDeleteComment = (commentId: number) => {
        deleteComment(post.id, commentId);
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner 
                title={post.title || `منشور من ${post.username}`}
                subtitle={`بواسطة ${post.username} • ${new Date(post.date).toLocaleDateString('ar-EG-u-nu-latn')}`}
                icon={<ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 text-teal-500" />}
            />
            <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5"/>
                    <span>العودة للمجتمع</span>
                </button>
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <p className="whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>

                    {post.category === 'استطلاع رأي' && <PollDisplay post={post} />}

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <ShareButton title={post.title || 'منشور جديد'} text={post.content} />
                        <button onClick={handleLikeClick} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors text-lg ${isLiked ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                            <HandThumbUpIcon className="w-6 h-6"/>
                            <span className="font-semibold">{post.likes.length}</span>
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-2xl font-bold mb-6">التعليقات ({post.comments.length})</h3>
                    {isPublicAuthenticated ? (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={3} placeholder="أضف تعليقك..." className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-cyan-500"></textarea>
                            <button type="submit" className="mt-2 px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600">إضافة تعليق</button>
                        </form>
                    ) : (
                        <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg mb-8">
                            <Link to="/login-user" className="font-semibold text-cyan-500 hover:underline">سجل الدخول</Link> لإضافة تعليق.
                        </div>
                    )}
                    <div className="space-y-6">
                        {post.comments.map(c => (
                            <div key={c.id} className="flex items-start gap-4">
                                <img src={c.avatar} alt={c.username} className="w-12 h-12 rounded-full" />
                                <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold">{c.username}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-gray-500">{new Date(c.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                                            {currentPublicUser && currentPublicUser.id === c.userId && (
                                                <button onClick={() => handleDeleteComment(c.id)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailPage;
