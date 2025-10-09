import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';
import type { Post, PostCategory, Circle } from '../types';
import { PlusIcon, ChatBubbleOvalLeftEllipsisIcon, HandThumbUpIcon, UserCircleIcon, PinIcon, TagIcon, UsersIcon, TrashIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';
import { useCommunity } from '../context/AppContext';

// Reusable component for Polls within a PostCard on the main feed
const PollInCard: React.FC<{ post: Post }> = ({ post }) => {
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
        e.stopPropagation();
        e.preventDefault();
        if (!currentPublicUser) {
            navigate('/login-user');
            return;
        }
        voteOnPoll(post.id, optionIndex);
    };

    if (!post.pollOptions) return null;

    return (
        <div className="mt-4 space-y-3">
            {hasVoted ? (
                // Results View
                post.pollOptions.map((option, index) => {
                    const percentage = totalVotes > 0 ? (option.votes.length / totalVotes) * 100 : 0;
                    const isUserChoice = index === userVoteIndex;
                    return (
                        <div key={index} className={`p-2 border-2 rounded-lg ${isUserChoice ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-center font-semibold text-sm mb-1">
                                <span className={isUserChoice ? 'text-cyan-700 dark:text-cyan-300' : ''}>{option.option}</span>
                                <span>{Math.round(percentage)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
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
                        className="w-full text-right p-3 font-semibold bg-slate-100 dark:bg-slate-700/50 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-transparent hover:border-cyan-400 transition"
                    >
                        {option.option}
                    </button>
                ))
            )}
        </div>
    );
};


const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    const { toggleLikePost } = useCommunity();
    const { currentPublicUser } = useAuth();
    const isLiked = currentPublicUser ? post.likes.includes(currentPublicUser.id) : false;

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if(!currentPublicUser) return;
        toggleLikePost(post.id);
    };

    return (
        <Link to={`/post/${post.id}`} className={`block bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${post.isPinned ? 'ring-2 ring-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/10' : ''}`}>
            {post.isPinned && (
                <div className="flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
                    <PinIcon className="w-5 h-5"/>
                    <span>مثبت</span>
                </div>
            )}
            <div className="flex items-center gap-4 mb-4">
                <img src={post.avatar} alt={post.username} className="w-12 h-12 rounded-full object-cover" loading="lazy" decoding="async" />
                <div>
                    <p className="font-bold text-gray-800 dark:text-white">{post.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center flex-wrap">
                        <span>{new Date(post.date).toLocaleDateString('ar-EG-u-nu-latn')}</span>
                        <span className="mx-1.5">•</span>
                        <span className="font-semibold text-cyan-500">{post.category}</span>
                    </p>
                </div>
            </div>
            {post.title && <h3 className="text-lg font-bold mb-2">{post.title}</h3>}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{post.content}</p>

            {post.category === 'استطلاع رأي' && <PollInCard post={post} />}
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                        <span>{post.comments.length}</span>
                    </div>
                </div>
                <button onClick={handleLikeClick} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-100 dark:bg-red-900/50' : 'text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <HandThumbUpIcon className="w-5 h-5"/>
                    <span className="font-semibold">{post.likes.length}</span>
                </button>
            </div>
        </Link>
    );
};

const NewPostForm: React.FC<{ onClose: () => void; circleId: number }> = ({ onClose, circleId }) => {
    const { addPost } = useCommunity();
    const [category, setCategory] = useState<PostCategory>('نقاش');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']);

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const addPollOption = () => setPollOptions([...pollOptions, '']);
    const removePollOption = (index: number) => setPollOptions(pollOptions.filter((_, i) => i !== index));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && category !== 'استطلاع رأي') return;
        
        let postData: any = { category, title: title.trim() || undefined, content, circleId };
        
        if (category === 'استطلاع رأي') {
            const validOptions = pollOptions.map(opt => ({ option: opt.trim(), votes: [] })).filter(opt => opt.option);
            if (validOptions.length < 2) {
                alert('يجب أن يحتوي الاستطلاع على خيارين على الأقل.');
                return;
            }
            postData.pollOptions = validOptions;
        }

        addPost(postData);
        onClose();
    };

    const postCategories: PostCategory[] = ['نقاش', 'سؤال', 'حدث', 'استطلاع رأي'];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">نوع المنشور</label>
                <select value={category} onChange={e => setCategory(e.target.value as PostCategory)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    {postCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">{category === 'استطلاع رأي' ? 'السؤال الرئيسي للاستطلاع' : 'العنوان (اختياري)'}</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={category === 'استطلاع رأي' ? 'ما هو سؤالك؟' : 'مثال: تجمع ملاك الحي الأول'} required={category === 'استطلاع رأي'} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">المحتوى</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} required rows={4} placeholder="اكتب ما يدور في ذهنك..." className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"></textarea>
            </div>
            
            {category === 'استطلاع رأي' && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-medium">خيارات الاستطلاع</label>
                    {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" value={option} onChange={e => handlePollOptionChange(index, e.target.value)} placeholder={`خيار ${index + 1}`} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
                            {pollOptions.length > 2 && <button type="button" onClick={() => removePollOption(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-4 h-4"/></button>}
                        </div>
                    ))}
                    <button type="button" onClick={addPollOption} className="text-sm text-cyan-600 font-semibold flex items-center gap-1"><PlusIcon className="w-4 h-4"/>إضافة خيار</button>
                </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">نشر</button>
            </div>
        </form>
    );
};

const CommunityPage: React.FC = () => {
    const { users } = useUsers();
    const { posts, circles } = useCommunity();
    const { isPublicAuthenticated, currentPublicUser } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'latest' | 'popular'>('latest');
    const [activeCircleId, setActiveCircleId] = useState<number>(1);
    const [postTypeFilter, setPostTypeFilter] = useState<PostCategory | 'all'>('all');

    const postTypesForFilter: (PostCategory | 'all')[] = ['all', 'نقاش', 'سؤال', 'حدث', 'استطلاع رأي'];

    const sortedAndFilteredPosts = useMemo(() => {
        let processedPosts = posts.filter(p => p.circleId === activeCircleId);

        if (postTypeFilter !== 'all') {
            processedPosts = processedPosts.filter(p => p.category === postTypeFilter);
        }

        if (sortOrder === 'popular') {
            processedPosts.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
        } else {
            processedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        
        processedPosts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

        return processedPosts;
    }, [posts, sortOrder, activeCircleId, postTypeFilter]);

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
                subtitle="شارك بآرائك، اطرح أسئلتك، وتواصل مع جيرانك في الدوائر المختلفة."
                icon={<ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 text-teal-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
                            {currentPublicUser ? (
                                <>
                                    <img src={currentPublicUser.avatar} alt={currentPublicUser.name} className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-cyan-500/50" />
                                    <h3 className="mt-4 text-xl font-bold">مرحباً، {currentPublicUser.name}!</h3>
                                </>
                            ) : (
                                <h3 className="text-xl font-bold">مرحباً في مجتمع هليوبوليس</h3>
                            )}
                             <div className="mt-4 flex justify-around text-sm">
                                <div className="text-gray-500 dark:text-gray-400"><strong className="block text-lg text-gray-800 dark:text-white">{posts.length}</strong> منشور</div>
                                <div className="text-gray-500 dark:text-gray-400"><strong className="block text-lg text-gray-800 dark:text-white">{users.length}</strong> عضو</div>
                            </div>
                             <button onClick={handleNewPostClick} className="w-full mt-6 flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-cyan-600 transition-transform hover:scale-105">
                                <PlusIcon className="w-5 h-5"/>
                                <span>أضف منشوراً جديداً</span>
                            </button>
                        </div>

                         <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><UsersIcon className="w-5 h-5"/> الدوائر</h3>
                            <div className="space-y-2">
                                {circles.map(circle => (
                                    <button key={circle.id} onClick={() => setActiveCircleId(circle.id)} className={`w-full text-right p-3 rounded-md font-semibold transition ${activeCircleId === circle.id ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                        {circle.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Feed */}
                    <main className="lg:col-span-8 xl:col-span-9">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                {postTypesForFilter.map(type => (
                                    <button key={type} onClick={() => setPostTypeFilter(type)} className={`px-3 py-1 text-sm font-semibold rounded-full ${postTypeFilter === type ? 'bg-cyan-500 text-white' : 'bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                                        {type === 'all' ? 'الكل' : type}
                                    </button>
                                ))}
                            </div>
                             <div className="flex items-center gap-2">
                                <label htmlFor="sortOrder" className="font-semibold text-sm">ترتيب حسب:</label>
                                <select id="sortOrder" value={sortOrder} onChange={e => setSortOrder(e.target.value as 'latest' | 'popular')} className="bg-white dark:bg-slate-800 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                    <option value="latest">الأحدث</option>
                                    <option value="popular">الأكثر تفاعلاً</option>
                                </select>
                            </div>
                        </div>

                        {sortedAndFilteredPosts.length > 0 ? (
                            <div className="space-y-6">
                                {sortedAndFilteredPosts.map(post => <PostCard key={post.id} post={post} />)}
                            </div>
                        ) : (
                             <div className="mt-10">
                                <EmptyState
                                    icon={<ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 text-slate-400" />}
                                    title="لا توجد منشورات هنا"
                                    message="حاول تغيير الفلاتر أو كن أول من يضيف منشوراً في هذه الدائرة!"
                                />
                             </div>
                        )}
                    </main>
                </div>

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إنشاء منشور جديد">
                    <NewPostForm onClose={() => setIsModalOpen(false)} circleId={activeCircleId} />
                </Modal>
            </div>
        </div>
    );
};

export default CommunityPage;