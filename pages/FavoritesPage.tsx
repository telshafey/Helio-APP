import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ServiceCard from '../components/common/ServiceCard';
import EmptyState from '../components/common/EmptyState';
import { HeartIconSolid } from '../components/common/Icons';

const FavoritesPage: React.FC = () => {
    const { services } = useAppContext();
    
    // The route in App.tsx already protects this page, so we can assume the user is authenticated.
    const favoriteServices = services.filter(s => s.isFavorite);

    return (
        <div className="animate-fade-in" dir="rtl">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-red-100 dark:bg-red-900/50 rounded-full mb-4">
                        <HeartIconSolid className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">قائمة المفضلة</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">جميع خدماتك المفضلة في مكان واحد.</p>
                </div>

                {favoriteServices.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {favoriteServices.map(service => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<HeartIconSolid className="w-16 h-16 text-slate-400" />}
                        title="قائمة المفضلة فارغة"
                        message="لم تقم بإضافة أي خدمات إلى المفضلة بعد. ابدأ بتصفح الخدمات وأضف ما يعجبك!"
                    >
                        <Link 
                            to="/services-overview" 
                            className="inline-block bg-cyan-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                            تصفح الخدمات
                        </Link>
                    </EmptyState>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
