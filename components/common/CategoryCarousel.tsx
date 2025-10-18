import React, { useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { getIcon } from './iconUtils';
import type { Category } from '../../types';

interface CategoryCarouselProps {
    title: string;
    categories: Category[];
}

const CategoryCard: React.FC<{ category: Category }> = memo(({ category }) => {
    // A category links to its first sub-category page, or to the main services page if no subs
    const linkTo = category.subCategories.length > 0 ? `/services/subcategory/${category.subCategories[0].id}` : '/services';
    
    return (
        <Link 
            to={linkTo} 
            className="group flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg text-center transform hover:-translate-y-1 transition-transform duration-300 w-full h-full"
        >
            <div className="flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-200">
                {getIcon(category.icon, { className: "w-8 h-8 text-cyan-600 dark:text-cyan-400" })}
            </div>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">{category.name}</h3>
        </Link>
    );
});

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ title, categories }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (scrollOffset: number) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
        }
    };

    if (categories.length === 0) {
        return null;
    }

    return (
        <section className="py-10 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">{title}</h2>
                <div className="relative group">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {categories.map(category => (
                            <div key={category.id} className="flex-shrink-0 w-36 h-40" style={{ scrollSnapAlign: 'start' }}>
                                <CategoryCard category={category} />
                            </div>
                        ))}
                    </div>
                    {/* Desktop Navigation Buttons for RTL */}
                    <button
                        onClick={() => scroll(-250)} // Scroll Right
                        className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Scroll right"
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll(250)} // Scroll Left
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

export default memo(CategoryCarousel);