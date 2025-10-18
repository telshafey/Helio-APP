import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';
import type { Post, PostCategory, Circle, MarketplaceItem, JobPosting, LostAndFoundItem } from '../types';
import { 
    PlusIcon, ChatBubbleOvalLeftEllipsisIcon, HandThumbUpIcon, UserCircleIcon, 
    PinIcon, UsersIcon, TrashIcon, ShoppingBagIcon, BriefcaseIcon, 
    MagnifyingGlassIcon, PhoneIcon, MapPinIcon, ArchiveBoxIcon
} from '../components/common/Icons';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';
import { useCommunity } from '../context/AppContext';
import { useNews } from '../context/NewsContext';
import AdSlider from '../components/common/AdSlider';
import { InputField, TextareaField } from '../components/common/FormControls';
import ImageUploader from '../components/common/ImageUploader';

// --- SUB-COMPONENTS FOR COMMUNITY PAGE ---

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

// --- Community Feed Tab ---
const CommunityFeedTab: React.FC<{ posts: Post[], circles: Circle[] }> = ({ posts, circles }) => {
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

    return (
        <>
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
        </>
    );
};

// --- Marketplace Tab ---
const AddItemForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { handleSaveMarketplaceItem } = useCommunity();
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', category: '', contactPhone: '', duration: 30,
    });
    const [images, setImages] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length === 0) {
            alert('يرجى إضافة صورة واحدة على الأقل.');
            return;
        }
        handleSaveMarketplaceItem({
            ...formData,
            price: parseFloat(formData.price) || 0,
            images,
            duration: Number(formData.duration),
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple maxFiles={5} label="صور المنتج" />
            <InputField name="title" label="عنوان الإعلان" value={formData.title} onChange={handleChange} required />
            <TextareaField name="description" label="الوصف" value={formData.description} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="price" label="السعر (بالجنيه)" type="number" value={formData.price} onChange={handleChange} required />
                <InputField name="category" label="الفئة" value={formData.category} onChange={handleChange} required placeholder="مثال: أثاث, إلكترونيات..."/>
            </div>
            <InputField name="contactPhone" label="رقم هاتف للتواصل" value={formData.contactPhone} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium mb-1">مدة عرض الإعلان</label>
                <select name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value={30}>30 يوم</option>
                    <option value={60}>60 يوم</option>
                    <option value={90}>90 يوم</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">إرسال للمراجعة</button>
            </div>
        </form>
    );
};

const MarketplaceItemCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
        <div className="relative">
            <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />
            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{item.category}</div>
        </div>
        <div className="p-4">
            <h3 className="font-bold text-lg truncate">{item.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm h-10 overflow-hidden">{item.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <p className="text-xl font-extrabold text-cyan-500">{item.price.toLocaleString('ar-EG')} جنيه</p>
                <a href={`tel:${item.contactPhone}`} className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600">
                    <PhoneIcon className="w-4 h-4" />
                    <span>تواصل</span>
                </a>
            </div>
        </div>
    </div>
);

const MarketplaceTab: React.FC = () => {
    const { marketplaceItems } = useCommunity();
    const [searchTerm, setSearchTerm] = useState('');

    const approvedItems = useMemo(() => {
        return marketplaceItems
            .filter(item => item.status === 'approved')
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [marketplaceItems, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="relative flex-grow">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                <input type="text" placeholder="ابحث عن منتج أو فئة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none"/>
            </div>
            {approvedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedItems.map(item => <MarketplaceItemCard key={item.id} item={item} />)}
                </div>
            ) : (
                <div className="mt-10">
                    <EmptyState icon={<ShoppingBagIcon className="w-16 h-16 text-slate-400" />} title="لا توجد إعلانات متاحة" message="كن أول من يضيف إعلان بيع في المدينة!" />
                </div>
            )}
        </div>
    );
};

// --- Jobs Tab ---
const AddJobForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { handleSaveJobPosting } = useCommunity();
    const [formData, setFormData] = useState({
        title: '', companyName: '', description: '', location: 'هليوبوليس الجديدة',
        type: 'دوام كامل' as JobPosting['type'], contactInfo: '', duration: 30,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveJobPosting({
            ...formData,
            type: formData.type as JobPosting['type'],
            duration: Number(formData.duration),
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="title" label="المسمى الوظيفي" value={formData.title} onChange={handleChange} required />
            <InputField name="companyName" label="اسم الشركة" value={formData.companyName} onChange={handleChange} required />
            <TextareaField name="description" label="وصف الوظيفة" value={formData.description} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="location" label="الموقع" value={formData.location} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium mb-1">نوع الدوام</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                        <option value="دوام كامل">دوام كامل</option>
                        <option value="دوام جزئي">دوام جزئي</option>
                        <option value="عقد">عقد</option>
                        <option value="تدريب">تدريب</option>
                    </select>
                </div>
            </div>
            <InputField name="contactInfo" label="معلومات التواصل (بريد إلكتروني أو هاتف)" value={formData.contactInfo} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium mb-1">مدة عرض الإعلان</label>
                <select name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value={30}>30 يوم</option>
                    <option value={60}>60 يوم</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">إرسال للمراجعة</button>
            </div>
        </form>
    );
};

const JobPostingCard: React.FC<{ job: JobPosting }> = ({ job }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-transparent hover:border-cyan-500/50 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{job.title}</h3>
                <p className="font-semibold">{job.companyName}</p>
            </div>
            <span className="bg-slate-100 dark:bg-slate-700 text-xs px-2 py-1 rounded-full">{job.type}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm my-3 h-16 overflow-hidden">{job.description}</p>
        <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {job.location}</p>
            <p className="font-mono text-xs">{new Date(job.creationDate).toLocaleDateString('ar-EG-u-nu-latn')}</p>
        </div>
    </div>
);

const JobsTab: React.FC = () => {
    const { jobPostings } = useCommunity();
    const [searchTerm, setSearchTerm] = useState('');

    const approvedJobs = useMemo(() => {
        return jobPostings
            .filter(job => job.status === 'approved')
            .filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [jobPostings, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="relative flex-grow">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                <input type="text" placeholder="ابحث عن وظيفة أو شركة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none"/>
            </div>

            {approvedJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedJobs.map(job => <JobPostingCard key={job.id} job={job} />)}
                </div>
            ) : (
                <div className="mt-10">
                    <EmptyState icon={<BriefcaseIcon className="w-16 h-16 text-slate-400" />} title="لا توجد وظائف متاحة حالياً" message="سيتم عرض الوظائف هنا عند توفرها." />
                </div>
            )}
        </div>
    );
};

// --- Lost & Found Tab ---
const AddLostAndFoundForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { handleSaveLostAndFoundItem } = useCommunity();
    const [formData, setFormData] = useState({
        type: 'lost' as 'lost' | 'found',
        title: '',
        description: '',
        location: '',
        contactInfo: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [image, setImage] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveLostAndFoundItem({
            ...formData,
            imageUrl: image[0] || undefined,
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">نوع البلاغ</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value="lost">مفقود</option>
                    <option value="found">تم العثور عليه</option>
                </select>
            </div>
            <InputField name="title" label="العنوان" value={formData.title} onChange={handleChange} required placeholder={formData.type === 'lost' ? 'مثال: فقدت مفاتيح سيارتي' : 'مثال: وجدت هاتف محمول'} />
            <TextareaField name="description" label="الوصف" value={formData.description} onChange={handleChange} required />
            <ImageUploader initialImages={image} onImagesChange={setImage} multiple={false} label="صورة (اختياري)" />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="location" label="الموقع التقريبي" value={formData.location} onChange={handleChange} required placeholder="مثال: الحديقة المركزية"/>
                <InputField name="date" label="تاريخ الفقد/العثور" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <InputField name="contactInfo" label="معلومات التواصل (هاتف أو بريد إلكتروني)" value={formData.contactInfo} onChange={handleChange} required />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">إرسال للمراجعة</button>
            </div>
        </form>
    );
};

const LostAndFoundCard: React.FC<{ item: LostAndFoundItem }> = ({ item }) => {
    const [showContact, setShowContact] = useState(false);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                     <img src={item.avatar} alt={item.username} className="w-8 h-8 rounded-full" />
                     <span className="font-semibold text-sm">{item.username}</span>
                </div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm my-2">{item.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-3">
                    <p className="flex items-center gap-1"><MapPinIcon className="w-4 h-4"/> <strong>الموقع:</strong> {item.location}</p>
                    <p><strong>التاريخ:</strong> {new Date(item.date).toLocaleDateString('ar-EG-u-nu-latn')}</p>
                </div>
                 <button onClick={() => setShowContact(!showContact)} className="w-full mt-4 bg-cyan-500 text-white font-semibold py-2 rounded-lg hover:bg-cyan-600">
                    {showContact ? item.contactInfo : 'إظهار معلومات التواصل'}
                </button>
            </div>
        </div>
    );
}

const LostAndFoundTab: React.FC = () => {
    const { lostAndFoundItems } = useCommunity();
    const [activeSubTab, setActiveSubTab] = useState<'lost' | 'found'>('lost');

    const filteredItems = useMemo(() => {
        return lostAndFoundItems
            .filter(item => item.status === 'approved' && item.type === activeSubTab)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [lostAndFoundItems, activeSubTab]);

    return (
        <div className="space-y-6">
            <div className="bg-slate-200 dark:bg-slate-700 p-1 rounded-lg flex gap-1">
                <button onClick={() => setActiveSubTab('lost')} className={`flex-1 px-6 py-2 font-semibold rounded-md ${activeSubTab === 'lost' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>مفقودات</button>
                <button onClick={() => setActiveSubTab('found')} className={`flex-1 px-6 py-2 font-semibold rounded-md ${activeSubTab === 'found' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>تم العثور عليها</button>
            </div>
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => <LostAndFoundCard key={item.id} item={item} />)}
                </div>
            ) : (
                <div className="mt-10">
                    <EmptyState icon={<ArchiveBoxIcon className="w-16 h-16 text-slate-400" />} title={`لا توجد ${activeSubTab === 'lost' ? 'مفقودات' : 'موجودات'} حالياً`} message="كن أول من يضيف بلاغاً لمساعدة جيرانك." />
                </div>
            )}
        </div>
    );
};

// --- MAIN COMMUNITY PAGE ---
const CommunityPage: React.FC = () => {
    const { users } = useUsers();
    const { posts, circles } = useCommunity();
    const { isPublicAuthenticated, currentPublicUser } = useAuth();
    const { advertisements } = useNews();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState<'feed' | 'marketplace' | 'jobs' | 'lost-and-found'>('feed');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isMarketplaceModalOpen, setIsMarketplaceModalOpen] = useState(false);
    const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
    const [isLostAndFoundModalOpen, setIsLostAndFoundModalOpen] = useState(false);
    const [activeCircleId, setActiveCircleId] = useState<number>(1);

    const sliderAds = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return advertisements.filter(ad => {
            const start = new Date(ad.startDate);
            const end = new Date(ad.endDate);
            return today >= start && today <= end;
        });
    }, [advertisements]);
    
    const handleSidebarButtonClick = () => {
        if (!isPublicAuthenticated) {
            navigate('/login-user');
            return;
        }
        if (activeTab === 'feed') setIsPostModalOpen(true);
        else if (activeTab === 'marketplace') setIsMarketplaceModalOpen(true);
        else if (activeTab === 'jobs') setIsJobsModalOpen(true);
        else if (activeTab === 'lost-and-found') setIsLostAndFoundModalOpen(true);
    };

    const getSidebarButtonText = () => {
        switch (activeTab) {
            case 'marketplace': return 'أضف إعلانك';
            case 'jobs': return 'أضف وظيفة';
            case 'lost-and-found': return 'أضف بلاغاً';
            case 'feed':
            default: return 'أضف منشوراً جديداً';
        }
    };

    const TabButton: React.FC<{ tabId: 'feed' | 'marketplace' | 'jobs' | 'lost-and-found', title: string, icon: React.ReactNode }> = ({ tabId, title, icon }) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-2 px-4 py-3 font-semibold rounded-t-lg transition-colors focus:outline-none text-sm ${
                activeTab === tabId
                    ? 'bg-white dark:bg-slate-800 text-cyan-500 border-b-2 border-cyan-500'
                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
        >
            {icon}
            {title}
        </button>
    );

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen animate-fade-in" dir="rtl">
            <PageBanner
                title="مجتمع هليوبوليس"
                subtitle="شارك، تواصل، وكن جزءاً من مجتمع حيوي."
                icon={<ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 text-teal-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {sliderAds.length > 0 && (
                    <div className="mb-8">
                        <AdSlider ads={sliderAds} />
                    </div>
                )}
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
                             <button onClick={handleSidebarButtonClick} className="w-full mt-6 flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-cyan-600 transition-transform hover:scale-105">
                                <PlusIcon className="w-5 h-5"/>
                                <span>{getSidebarButtonText()}</span>
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
                         <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                            <nav className="-mb-px flex gap-2 flex-wrap" aria-label="Tabs">
                                <TabButton tabId="feed" title="المنشورات" icon={<ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5"/>} />
                                <TabButton tabId="marketplace" title="البيع والشراء" icon={<ShoppingBagIcon className="w-5 h-5"/>} />
                                <TabButton tabId="jobs" title="الوظائف" icon={<BriefcaseIcon className="w-5 h-5"/>} />
                                <TabButton tabId="lost-and-found" title="المفقودات" icon={<ArchiveBoxIcon className="w-5 h-5"/>} />
                            </nav>
                        </div>

                        {activeTab === 'feed' && <CommunityFeedTab posts={posts} circles={circles} />}
                        {activeTab === 'marketplace' && <MarketplaceTab />}
                        {activeTab === 'jobs' && <JobsTab />}
                        {activeTab === 'lost-and-found' && <LostAndFoundTab />}
                    </main>
                </div>

                <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title="إنشاء منشور جديد">
                    <NewPostForm onClose={() => setIsPostModalOpen(false)} circleId={activeCircleId} />
                </Modal>
                <Modal isOpen={isMarketplaceModalOpen} onClose={() => setIsMarketplaceModalOpen(false)} title="إضافة إعلان جديد">
                    <AddItemForm onClose={() => setIsMarketplaceModalOpen(false)} />
                </Modal>
                <Modal isOpen={isJobsModalOpen} onClose={() => setIsJobsModalOpen(false)} title="إضافة إعلان وظيفة">
                    <AddJobForm onClose={() => setIsJobsModalOpen(false)} />
                </Modal>
                <Modal isOpen={isLostAndFoundModalOpen} onClose={() => setIsLostAndFoundModalOpen(false)} title="إضافة بلاغ جديد">
                    <AddLostAndFoundForm onClose={() => setIsLostAndFoundModalOpen(false)} />
                </Modal>
            </div>
        </div>
    );
};

export default CommunityPage;