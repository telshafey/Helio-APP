import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeftIcon, BellIcon } from '../components/common/Icons';
import EmptyState from '../components/common/EmptyState';
import PageBanner from '../components/common/PageBanner';
// FIX: Imported useServices to get services data.
import { useServices } from '../context/ServicesContext';

const UserNotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Destructured notifications from useData and services from useServices.
    const { notifications } = useData();
    const { services } = useServices();

    const getServiceName = (serviceId?: number) => {
        if (!serviceId) return null;
        return services.find(s => s.id === serviceId)?.name;
    };
    
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    return (
        <div className="animate-fade-in" dir="rtl">
             <PageBanner
                title="الإشعارات"
                subtitle="أحدث التنبيهات والأخبار الهامة المرسلة إليك."
                icon={<BellIcon className="w-12 h-12 text-cyan-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-8">
                    <ArrowLeftIcon className="w-5 h-5"/>
                    <span>العودة</span>
                </button>
                <div className="max-w-3xl mx-auto">
                    {sortedNotifications.length > 0 ? (
                        <div className="space-y-4">
                            {sortedNotifications.map(n => (
                                <div key={n.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-start gap-4">
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
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState 
                            icon={<BellIcon className="w-16 h-16 text-slate-400" />}
                            title="لا توجد إشعارات حالياً"
                            message="سيتم عرض الإشعارات الهامة والتنبيهات هنا عند توفرها."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default UserNotificationsPage;