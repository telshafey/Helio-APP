import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Advertisement } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import ImageModal from './ImageModal';

interface AdSliderProps {
    ads: Advertisement[];
}

const AdSlider: React.FC<AdSliderProps> = ({ ads }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    const goToPrevious = useCallback(() => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? ads.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, ads.length]);

    const goToNext = useCallback(() => {
        const isLastSlide = currentIndex === ads.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [currentIndex, ads.length]);

    useEffect(() => {
        if (ads.length > 1) {
            const sliderInterval = setInterval(goToNext, 5000);
            return () => clearInterval(sliderInterval);
        }
    }, [goToNext, ads.length]);

    if (ads.length === 0) {
        return null; // Don't render anything if there are no items
    }

    const currentItem = ads[currentIndex];
    
    const handleImageClick = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const SlideContent = () => (
        <>
            <img src={currentItem.imageUrl} alt={currentItem.title} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-4 md:p-6 text-white">
                <h2 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">{currentItem.title}</h2>
            </div>
        </>
    );

    const SlideWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        if (currentItem.serviceId) {
            return <Link to={`/service/${currentItem.serviceId}`} className="block w-full h-full">{children}</Link>;
        }
        if (currentItem.externalUrl) {
            return <a href={currentItem.externalUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">{children}</a>;
        }
        return <button onClick={() => handleImageClick(currentItem.imageUrl)} className="block w-full h-full text-left cursor-pointer">{children}</button>;
    };


    return (
        <>
            <div className="w-full h-56 sm:h-64 md:h-72 relative group rounded-2xl overflow-hidden shadow-2xl">
                <SlideWrapper>
                    <SlideContent />
                </SlideWrapper>

                {/* Navigation Arrows */}
                {ads.length > 1 && (
                    <>
                        <button onClick={goToPrevious} className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <ChevronLeftIcon className="w-6 h-6"/>
                        </button>
                        <button onClick={goToNext} className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <ChevronRightIcon className="w-6 h-6"/>
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                <div className="absolute bottom-4 right-0 left-0">
                    <div className="flex items-center justify-center gap-2">
                        {ads.map((_, slideIndex) => (
                            <div
                                key={slideIndex}
                                onClick={() => setCurrentIndex(slideIndex)}
                                className={`transition-all w-2 h-2 md:w-3 md:h-3 bg-white rounded-full cursor-pointer ${currentIndex === slideIndex ? 'p-1.5 md:p-2' : 'bg-opacity-50'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
            <ImageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                imageUrl={modalImageUrl}
            />
        </>
    );
};

export default AdSlider;
