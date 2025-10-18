import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUsers } from '../context/UsersContext';
import { useServices } from '../context/ServicesContext';
import { ArrowLeftIcon, StarIcon, ChatBubbleOvalLeftIcon } from '../components/common/Icons';
import Spinner from '../components/common/Spinner';

const RatingDisplay: React.FC<{ rating: number; size?: string; }> = ({ rating, size = 'w-4 h-4' }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`${size} ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }`} />
        ))}
    </div>
);


const PublicProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    // Fix: 'users' is not in DataContext. It's in UsersContext.
    const { users } = useUsers();
    const { services } = useServices();

    const user = useMemo(() => users.find(u => u.id === Number(userId)), [users, userId]);
    
    const userReviews = useMemo(() => {
        if (!user) return [];
        return services.flatMap(service =>
            service.reviews
                .filter(review => review.userId === user.id)
                .map(review => ({ ...review, serviceId: service.id, serviceName: service.name }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [user, services]);

    if (!user) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    return (
        <div className="animate-fade-in" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl mx-auto">
                     <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-8">
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>العودة</span>
                    </button>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                            <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover ring-4 ring-cyan-500/50" />
                            <div className="text-center sm:text-right flex-grow">
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">عضو منذ: {new Date(user.joinDate).toLocaleDateString('ar-EG')}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                                <ChatBubbleOvalLeftIcon className="w-7 h-7"/>
                                تقييمات {user.name} ({userReviews.length})
                            </h2>
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                {userReviews.length > 0 ? userReviews.map(review => (
                                    <div key={review.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                تقييم لـ <Link to={`/service/${review.serviceId}`} className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline">{review.serviceName}</Link>
                                            </p>
                                            <p className="text-xs text-gray-500">{review.date}</p>
                                        </div>
                                         <RatingDisplay rating={review.rating} />
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">{review.comment}</p>
                                        {review.adminReply && <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-500 border-r-2 border-cyan-500 pr-2">رد الإدارة: {review.adminReply}</p>}
                                    </div>
                                )) : <p className="text-center text-gray-500 py-8">هذا المستخدم لم يقم بإضافة أي تقييمات بعد.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfilePage;