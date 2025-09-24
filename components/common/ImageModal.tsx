import React from 'react';
import { XMarkIcon } from './Icons';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    altText?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, altText = 'Advertisement' }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white shadow-lg hover:bg-white/30"
                aria-label="Close image view"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
            <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={imageUrl} alt={altText} className="block max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
            </div>
        </div>
    );
};

export default ImageModal;