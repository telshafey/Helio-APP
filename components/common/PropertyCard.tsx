import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Property } from '../../types';
import { MapPinIcon, PhoneIcon } from './Icons';

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
    return (
        <Link to={`/property/${property.id}`} className="block bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 active:scale-[0.98] group">
            <div className="relative">
                <img src={property.images[0] || 'https://picsum.photos/600/400?random=30'} alt={property.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" />
                <div className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold text-white rounded-full ${property.type === 'sale' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                    {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate group-hover:text-cyan-500">{property.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {property.location.address}</p>
                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{property.price.toLocaleString('ar-EG')} جنيه</p>
                <div className="flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <PhoneIcon className="w-4 h-4"/>
                        <span>{property.contact.name}</span>
                    </div>
                    <a href={`tel:${property.contact.phone}`} onClick={(e) => e.stopPropagation()} className="font-bold text-green-600 hover:underline">{property.contact.phone}</a>
                </div>
            </div>
        </Link>
    );
};

export default memo(PropertyCard);