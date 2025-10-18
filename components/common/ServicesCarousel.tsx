import React, { useRef, memo } from 'react';
import type { Service } from '../../types';
import ServiceCard from './ServiceCard';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface ServicesCarouselProps {
    title: string;
    services: Service[];
}

const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ title, services }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (services.length === 0) {
        return null;
    }

    return (
        <section className="py-10 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">{title}</h2>
                <div className="relative group">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {services.map(service => (
                            <div key={service.id} className="flex-shrink-0 w-72" style={{ scrollSnapAlign: 'start' }}>
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                    {/* Desktop Navigation Buttons */}
                    <button
                        onClick={() => scroll('right')}
                        className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll('left')}
                        className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Scroll left"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default memo(ServicesCarousel);