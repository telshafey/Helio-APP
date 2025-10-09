import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Advertisement } from '../../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import ImageModal from './ImageModal';

interface AdSliderProps {
    ads: Advertisement[];
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};


const AdSlider: React.FC<AdSliderProps> = ({ ads }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState('');

    const adIndex = ((page % ads.length) + ads.length) % ads.length;
    const currentItem = ads[adIndex];

    const paginate = useCallback((newDirection: number) => {
        setPage(prev => [prev[0] + newDirection, newDirection]);
    }, []);

    useEffect(() => {
        if (ads.length > 1) {
            const sliderInterval = setInterval(() => paginate(1), 5000);
            return () => clearInterval(sliderInterval);
        }
    }, [paginate, ads.length]);
    
    if (ads.length === 0) {
        return null; // Don't render anything if there are no items
    }
    
    const handleImageClick = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const SlideContent = () => (
        <>
            <img src={currentItem.imageUrl} alt={currentItem.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
            <div className="w-full h-56 sm:h-64 md:h-72 relative group rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
                 <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        className="absolute w-full h-full"
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);
                            if (swipe < -swipeConfidenceThreshold) paginate(1);
                            else if (swipe > swipeConfidenceThreshold) paginate(-1);
                        }}
                    >
                        <SlideWrapper><SlideContent /></SlideWrapper>
                    </motion.div>
                </AnimatePresence>

                {ads.length > 1 && (
                    <>
                        <button onClick={() => paginate(-1)} className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronLeftIcon className="w-6 h-6"/>
                        </button>
                        <button onClick={() => paginate(1)} className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRightIcon className="w-6 h-6"/>
                        </button>
                    </>
                )}

                <div className="absolute bottom-4 right-0 left-0 z-10">
                    <div className="flex items-center justify-center gap-2">
                        {ads.map((_, slideIndex) => (
                            <div
                                key={slideIndex}
                                onClick={() => setPage([slideIndex, slideIndex > adIndex ? 1 : -1])}
                                className={`transition-all w-2 h-2 md:w-3 md:h-3 bg-white rounded-full cursor-pointer ${adIndex === slideIndex ? 'p-1.5 md:p-2' : 'bg-opacity-50'}`}
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

export default memo(AdSlider);