import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Service } from '../../types';
import { StarIcon, HeartIcon, HeartIconSolid } from './Icons';
import { useServices } from '../../context/ServicesContext';
import { useAuth } from '../../context/AuthContext';

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon
                key={i}
                className={`w-4 h-4 ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500' }`}
            />
        ))}
    </div>
);

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const { handleToggleFavorite } = useServices();
    const { isPublicAuthenticated } = useAuth();

    const onFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggleFavorite(service.id);
    };

    return (
        <div className="relative group">
            <Link to={`/service/${service.id}`} className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 active:scale-[0.98]">
                <div className="relative">
                    <img 
                        src={service.images[0] || `https://picsum.photos/400/300?random=${service.id}`} 
                        alt={service.name} 
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute bottom-0 right-0 bg-gradient-to-t from-black/60 to-transparent w-full p-4">
                        <Rating rating={service.rating} />
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 truncate group-hover:text-cyan-500">{service.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{service.address}</p>
                </div>
            </Link>
             {isPublicAuthenticated && (
                <button
                    onClick={onFavoriteClick}
                    className="absolute top-3 left-3 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white hover:text-red-500 transition-colors z-10"
                    title={service.isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                    {service.isFavorite ? <HeartIconSolid className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                </button>
             )}
        </div>
    );
};

export default memo(ServiceCard);