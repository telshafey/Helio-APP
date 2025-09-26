import React from 'react';
import { useUI } from '../../context/UIContext';
import { ShareIcon } from './Icons';

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
    className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url, className = '' }) => {
    const { showToast } = useUI();

    const handleShare = async () => {
        // Construct a full, absolute URL reliably.
        // Using window.location.href as a base can be unreliable in some environments.
        // Building from origin + path is safer.
        const path = window.location.pathname + window.location.hash;
        const urlToShare = url || path;
        const absoluteUrl = new URL(urlToShare, window.location.origin).href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: absoluteUrl,
                });
            } catch (error) {
                // Ignore AbortError which happens when the user closes the share sheet.
                if (error instanceof DOMException && error.name === 'AbortError') {
                    return;
                }
                console.error('Error sharing:', error);
                // As a fallback for other errors, try copying to clipboard.
                try {
                    await navigator.clipboard.writeText(absoluteUrl);
                    showToast('فشلت المشاركة، تم نسخ الرابط بدلاً من ذلك.', 'success');
                } catch (copyErr) {
                    showToast('فشل المشاركة والنسخ.', 'error');
                }
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(absoluteUrl);
                showToast('تم نسخ الرابط!', 'success');
            } catch (err) {
                console.error('Failed to copy: ', err);
                showToast('فشل نسخ الرابط.', 'error');
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 font-bold px-4 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-full ${className}`}
            title="مشاركة"
        >
            <ShareIcon className="w-6 h-6" />
            <span>مشاركة</span>
        </button>
    );
};

export default ShareButton;
