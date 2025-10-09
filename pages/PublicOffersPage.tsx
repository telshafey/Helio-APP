import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCommunity } from '../context/AppContext';
import { useServices } from '../context/ServicesContext';
import PageBanner from '../components/common/PageBanner';
import { TagIcon, CalendarDaysIcon } from '../components/common/Icons';
import type { ExclusiveOffer } from '../types';
import EmptyState from '../components/common/EmptyState';

const OfferCard: React.FC<{ offer: ExclusiveOffer; serviceName: string }> = ({ offer, serviceName }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
            <Link to={`/service/${offer.serviceId}`} className="block">
                <div className="relative">
                    <img src={offer.imageUrl} alt={offer.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg drop-shadow">{offer.title}</h3>
                        <p className="text-sm drop-shadow">{serviceName}</p>
                    </div>
                </div>
                <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 h-12 overflow-hidden">{offer.description}</p>
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-4 h-4" />
                            <span>ينتهي في: {new Date(offer.endDate).toLocaleDateString('ar-EG-u-nu-latn')}</span>
                        </div>
                        {offer.promoCode && <span className="font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">الكود: {offer.promoCode}</span>}
                    </div>
                </div>
            </Link>
        </div>
    );
};

const PublicOffersPage: React.FC = () => {
    const { offers } = useCommunity();
    const { services } = useServices();

    const activeApprovedOffers = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return offers
            .filter(offer => {
                const start = new Date(offer.startDate);
                const end = new Date(offer.endDate);
                return offer.status === 'approved' && today >= start && today <= end;
            })
            .sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [offers]);

    const getServiceName = (serviceId: number): string => {
        return services.find(s => s.id === serviceId)?.name || 'خدمة غير معروفة';
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner title="العروض الحصرية" subtitle="استفد من أفضل العروض والخصومات المتاحة لسكان المدينة فقط." icon={<TagIcon className="w-12 h-12 text-pink-500" />}/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {activeApprovedOffers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeApprovedOffers.map(offer => (
                            <OfferCard key={offer.id} offer={offer} serviceName={getServiceName(offer.serviceId)} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-16">
                        <EmptyState icon={<TagIcon className="w-16 h-16 text-slate-400" />} title="لا توجد عروض متاحة حالياً" message="يرجى التحقق مرة أخرى قريباً للعثور على أفضل العروض في المدينة." />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicOffersPage;
