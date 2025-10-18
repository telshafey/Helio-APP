import React from 'react';

interface PageBannerProps {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, icon }) => {
    return (
        <div className="bg-white dark:bg-slate-800/50 py-6 sm:py-8 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-block p-3 bg-slate-100 dark:bg-slate-700/50 rounded-full mb-4 ring-8 ring-slate-100/50 dark:ring-slate-700/30">
                    {icon}
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white tracking-tight">{title}</h1>
                {subtitle && <p className="mt-3 max-w-2xl mx-auto text-md sm:text-lg text-gray-600 dark:text-gray-300">{subtitle}</p>}
            </div>
        </div>
    );
};

export default PageBanner;