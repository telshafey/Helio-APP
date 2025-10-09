import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';
import { StarIcon, PhoneIcon, ChatBubbleOvalLeftIcon, HomeModernIcon, HandThumbUpIcon, HeartIcon, HeartIconSolid, ClockIcon, MapPinIcon, FacebookIcon, InstagramIcon } from '../components/common/Icons';
import Spinner from '../components/common/Spinner';
import ShareButton from '../components/common/ShareButton';
import ImageSlider from '../components/common/ImageSlider';

const RatingDisplay: React.FC<{ rating: number; reviewCount: number; size?: string; }> = ({ rating, reviewCount, size = 'w-6 h-6' }) => (
    <div className="flex items-center gap-2">
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`${size} ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }`} />
            ))}
        </div>
        <span className="text-gray-600 dark:text-gray-300 font-bold">
            {rating.toFixed(1)}
        </span>
        {reviewCount > 0 && (
             <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({reviewCount} تقييم)
            </span>
        )}
    </div>
);

const AddReviewForm: React.FC<{ serviceId: number }> = ({ serviceId }) => {
    const { addReview } = useServices();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('يرجى اختيار تقييم');
            return;
        }
        addReview(serviceId, { rating, comment });
        setRating(0);
        setComment('');
    };

    return (
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">أضف تقييمك</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <p className="mb-2 font-semibold">تقييمك:</p>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button type="button" key={star} onClick={() => setRating(star)} onMouseOver={() => setRating(star)} >
                                <StarIcon className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'}`} />
                            </button>
                        ))}
                    </div>
                </div>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                    rows={4}
                    placeholder="اكتب تعليقك هنا..."
                    className="w-full bg-white dark:bg-slate-700 p-3 rounded-md focus:ring-2 focus:ring-cyan-500"
                />
                <button type="submit" className="mt-4 px-6 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                    إرسال التقييم
                </button>
            </form>
        </div>
    );
};

const PublicServiceDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { serviceId } = useParams<{ serviceId: string }>();
    const { services, handleToggleFavorite, handleToggleHelpfulReview } = useServices();
    const { isPublicAuthenticated } = useAuth();

    const [sortOrder, setSortOrder] = useState<'latest' | 'highest' | 'helpful'>('latest');

    const service = useMemo(() => services.find(s => s.id === Number(serviceId)), [services, serviceId]);
    
    const sortedReviews = useMemo(() => {
        if (!service) return [];
        const reviews = [...service.reviews];
        switch (sortOrder) {
            case 'highest':
                return reviews.sort((a, b) => b.rating - a.rating);
            case 'helpful':
                return reviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
            case 'latest':
            default:
                return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
    }, [service, sortOrder]);

    if (!service) {
        return <div className="flex items-center justify-center h-screen"><Spinner /> <p className="ml-4">جاري تحميل الخدمة...</p></div>;
    }

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32 md:pb-12">
                 <div className="max-w-5xl mx-auto">
                    <ImageSlider images={service.images} />
                    
                    <div className="mt-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">{service.name}</h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{service.address}</p>
                            <div className="my-6">
                                <RatingDisplay rating={service.rating} reviewCount={service.reviews.length} />
                            </div>
                        </div>
                        {isPublicAuthenticated && (
                            <button
                                onClick={() => handleToggleFavorite(service.id)}
                                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                title={service.isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                            >
                                {service.isFavorite 
                                    ? <HeartIconSolid className="w-8 h-8 text-red-500" /> 
                                    : <HeartIcon className="w-8 h-8" />
                                }
                            </button>
                        )}
                    </div>
                    
                    <div className="mt-8 grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-3 prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                             <h2 className="text-2xl font-bold border-b pb-2 mb-4">حول الخدمة</h2>
                             <p>{service.about}</p>
                        </div>
                        <div className="md:col-span-2">
                             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold mb-4">معلومات وتواصل</h3>
                                <ul className="space-y-3 text-sm">
                                    {service.workingHours && <li className="flex items-center gap-3"><ClockIcon className="w-5 h-5 text-gray-400"/><p>{service.workingHours.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p></li>}
                                    {service.locationUrl && <li className="flex items-center gap-3"><MapPinIcon className="w-5 h-5 text-gray-400"/><a href={service.locationUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">عرض على الخريطة</a></li>}
                                    {service.facebookUrl && <li className="flex items-center gap-3"><FacebookIcon className="w-5 h-5 text-gray-400"/><a href={service.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">صفحة الفيسبوك</a></li>}
                                    {service.instagramUrl && <li className="flex items-center gap-3"><InstagramIcon className="w-5 h-5 text-gray-400"/><a href={service.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">صفحة الإنستغرام</a></li>}
                                </ul>
                                <div className="grid grid-cols-1 gap-3 mt-6">
                                    {service.phone.map((phone, i) => (
                                        <a key={`p-${i}`} href={`tel:${phone}`} className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
                                            <PhoneIcon className="w-6 h-6" />
                                            <span>اتصال: {phone}</span>
                                        </a>
                                    ))}
                                    {service.whatsapp.map((wa, i) => (
                                         <a key={`w-${i}`} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-emerald-600 transition-colors">
                                            <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                                            <span>واتساب</span>
                                        </a>
                                    ))}
                                    <ShareButton title={service.name} text={`تحقق من هذه الخدمة في تطبيق Helio: ${service.name}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Reviews Section */}
                    <div className="mt-12">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-t border-slate-200 dark:border-slate-700 pt-8">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">التقييمات والآراء ({service.reviews.length})</h3>
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option value="latest">الأحدث</option>
                                <option value="highest">الأعلى تقييماً</option>
                                <option value="helpful">الأكثر فائدة</option>
                            </select>
                        </div>
                        <div className="space-y-6">
                             {sortedReviews.length > 0 ? sortedReviews.map(review => (
                                 <div key={review.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <Link to={`/user/${review.userId}`}>
                                                <img src={review.avatar} alt={review.username} className="w-12 h-12 rounded-full object-cover hover:ring-2 ring-cyan-400 transition" />
                                            </Link>
                                            <div>
                                                <Link to={`/user/${review.userId}`} className="font-bold text-gray-900 dark:text-white hover:underline">{review.username}</Link>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                                                <RatingDisplay rating={review.rating} reviewCount={0} size="w-4 h-4" />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => isPublicAuthenticated && handleToggleHelpfulReview(service.id, review.id)}
                                            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors ${!isPublicAuthenticated ? 'cursor-not-allowed opacity-70' : 'hover:bg-cyan-100 dark:hover:bg-cyan-900'} bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300`}
                                            title={isPublicAuthenticated ? "هل كان هذا التقييم مفيداً؟" : "سجل الدخول للتفاعل"}
                                        >
                                            <HandThumbUpIcon className="w-4 h-4"/>
                                            <span>مفيد</span>
                                            <span className="font-bold">{review.helpfulCount || 0}</span>
                                        </button>
                                     </div>
                                     <p className="mt-4 text-gray-700 dark:text-gray-300">{review.comment}</p>
                                     {review.adminReply && <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-500 border-r-2 border-cyan-500 pr-2">رد الإدارة: {review.adminReply}</p>}
                                 </div>
                             )) : <p className="text-center text-gray-500 py-8">كن أول من يضيف تقييماً لهذه الخدمة.</p>}
                         </div>
                    </div>
                    {isPublicAuthenticated ? (
                        <AddReviewForm serviceId={service.id} />
                    ) : (
                        <div className="mt-8 p-6 text-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <p className="font-semibold">هل ترغب في إضافة تقييمك؟</p>
                            <Link to="/login-user" className="text-cyan-500 hover:underline font-bold">سجل الدخول</Link>
                            <span> لإضافة رأيك.</span>
                        </div>
                    )}
                 </div>
            </div>
             {/* Floating Action Bar for Mobile */}
            <div className="md:hidden fixed bottom-14 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 z-20">
                <div className="container mx-auto px-2">
                    <div className="overflow-x-auto whitespace-nowrap p-2">
                         <div className="flex items-center gap-2">
                             {service.phone.map((phone, i) => (
                                <a key={`m-p-${i}`} href={`tel:${phone}`} className="flex-shrink-0 flex items-center justify-center gap-2 bg-green-500 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-green-600 transition-colors text-sm">
                                    <PhoneIcon className="w-5 h-5" />
                                    <span>اتصال {service.phone.length > 1 ? i+1 : ''}</span>
                                </a>
                             ))}
                             {service.whatsapp.map((wa, i) => (
                                 <a key={`m-w-${i}`} href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-600 transition-colors text-sm">
                                    <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                                    <span>واتساب</span>
                                </a>
                             ))}
                             <div className="flex-shrink-0">
                                <ShareButton
                                    title={service.name}
                                    text={`تحقق من هذه الخدمة في تطبيق Helio: ${service.name}`}
                                    className="!py-2.5 !px-4 !text-sm"
                                />
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicServiceDetailPage;