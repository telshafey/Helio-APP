import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { useUI } from '../context/UIContext';
import { ArrowLeftIcon, BellIcon, TrashIcon } from '../components/common/Icons';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';

const UserNotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const { notifications } = useNews();
    const { showConfirmation, dismissedNotificationIds, dismissNotification, dismissAllNotifications } = useUI();

    const handleDismissAll = () => {
        showConfirmation(
            'حذف جميع الإشعارات',
            'هل أنت متأكد أنك تريد حذف جميع الإشعارات؟ لا يمكن التراجع عن هذا الإجراء.',
            () => {
                const allIds = notifications.map(n => n.id);
                dismissAllNotifications(allIds);
            }
        );
    };
    
    const visibleNotifications = notifications
        .filter(n => !dismissedNotificationIds.has(n.id))
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    return (
        <div className="animate-fade-in" dir="rtl">
             <PageBanner
                title="الإشعارات"
                subtitle="أحدث التنبيهات والأخبار الهامة المرسلة إليك."
                icon={<BellIcon className="w-12 h-12 text-cyan-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline">
                            <ArrowLeftIcon className="w-5 h-5"/>
                            <span>العودة</span>
                        </button>
                        {visibleNotifications.length > 0 && (
                             <button onClick={handleDismissAll} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-semibold bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 px-3 py-1.5 rounded-md transition-colors">
                                <TrashIcon className="w-4 h-4" />
                                <span>حذف الكل</span>
                            </button>
                        )}
                    </div>
                    {visibleNotifications.length > 0 ? (
                        <div className="space-y-4">
                            {visibleNotifications.map(n => (
                                <div key={n.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-start gap-4 group">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-3 h-3 rounded-full ${new Date() > new Date(n.endDate) ? 'bg-slate-400' : 'bg-cyan-500'}`}></div>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-gray-800 dark:text-white">{n.title}</p>
                                        <p className="text-gray-600 dark:text-gray-300">{n.content}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(n.startDate).toLocaleDateString('ar-EG-u-nu-latn')}
                                            {n.startDate !== n.endDate && ` - ${new Date(n.endDate).toLocaleDateString('ar-EG-u-nu-latn')}`}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => dismissNotification(n.id)}
                                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="حذف الإشعار"
                                    >
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={<BellIcon className="w-16 h-16 text-slate-400" />}
                            title="لا توجد إشعارات جديدة"
                            message="سيتم عرض الإشعارات الهامة والتنبيهات هنا عند توفرها."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default UserNotificationsPage;