import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
// FIX: Replaced deprecated useAppContext with useData from DataContext.
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, StarIcon, PhoneIcon, ChatBubbleOvalLeftIcon, ChevronLeftIcon, ChevronRightIcon, HomeModernIcon, HandThumbUpIcon, HeartIcon, HeartIconSolid } from '../components/common/Icons';
import Spinner from '../components/common/Spinner';

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

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    const goToNext = () => setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));

    if (images.length === 0) {
        return <div className="w-full h-64 sm:h-96 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-lg"><HomeModernIcon className="w-20 h-20 text-slate-400"/></div>
    }

    return (
        <div className="relative w-full h-64 sm:h-96 group">
            <div style={{ backgroundImage: `url(${images[currentIndex]})` }} className="w-full h-full rounded-lg bg-center bg-cover duration-500"></div>
            {images.length > 1 && (
                <>
                    <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeftIcon className="w-6 h-6"/></button>
                    <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRightIcon className="w-6 h-6"/></button>
                </>
            )}
        </div>
    );
}

const AddReviewForm: React.FC<{ serviceId: number }> = ({ serviceId }) => {
    // FIX: Replaced deprecated useAppContext with useData.
    const { addReview } = useData();
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
    // FIX: Get data-related state from useData and auth state from useAuth.
    const { services, handleToggleFavorite, handleToggleHelpfulReview } = useData();
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <ImageSlider images={service.images} />
                        <div className="mt-8">
                             <div className="flex items-center gap-4">
                                <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">{service.name}</h1>
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
                            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{service.address}</p>
                            <div className="my-6">
                                <RatingDisplay rating={service.rating} reviewCount={service.reviews.length} />
                            </div>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mt-8">
                                <h2 className="text-2xl font-bold border-b pb-2 mb-4">حول الخدمة</h2>
                                <p>{service.about}</p>
                            </div>

                             {/* Reviews Section */}
                            <div className="mt-12">
                                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-t border-slate-200 dark:border-slate-700 pt-8">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">التقييمات والآراء ({service.reviews.length})</h3>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as any)}
                                        className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
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
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold mb-4">معلومات الاتصال</h3>
                                <div className="space-y-4">
                                    <a href={`tel:${service.phone}`} className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-600 transition-colors">
                                        <PhoneIcon className="w-6 h-6" />
                                        <span>اتصال: {service.phone}</span>
                                    </a>
                                     {service.whatsapp && (
                                        <a href={`https://wa.me/${service.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-emerald-600 transition-colors">
                                            <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                                            <span>واتساب</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicServiceDetailPage;