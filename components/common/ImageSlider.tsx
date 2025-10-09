import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, HomeModernIcon } from './Icons';

interface ImageSliderProps {
    images: string[];
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    // This handles wrapping correctly for both positive and negative page numbers
    const imageIndex = ((page % images.length) + images.length) % images.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    if (images.length === 0) {
        return <div className="w-full h-64 sm:h-96 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-lg"><HomeModernIcon className="w-20 h-20 text-slate-400"/></div>;
    }

    return (
        <div className="relative w-full h-64 sm:h-96 group overflow-hidden rounded-lg flex items-center justify-center bg-slate-200 dark:bg-slate-800">
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={page}
                    src={images[imageIndex]}
                    alt={`Slide ${imageIndex + 1}`}
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
                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1); // Swipe left, go to next
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1); // Swipe right, go to previous
                        }
                    }}
                    className="absolute w-full h-full object-cover"
                />
            </AnimatePresence>
            {images.length > 1 && (
                <>
                    <button onClick={() => paginate(-1)} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"><ChevronLeftIcon className="w-6 h-6"/></button>
                    <button onClick={() => paginate(1)} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full z-10 opacity-0 group-hover:opacity-100 md:opacity-100 transition-opacity"><ChevronRightIcon className="w-6 h-6"/></button>
                </>
            )}
        </div>
    );
};

export default ImageSlider;
