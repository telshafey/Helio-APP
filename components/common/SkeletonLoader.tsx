import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-pulse" dir="rtl">
      {/* Top bar skeleton */}
      <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2 md:w-1/3 mb-8"></div>
      
      {/* Main content grid skeleton, similar to public home page structure */}
      <div className="space-y-8">
        {/* Ad slider placeholder */}
        <div className="h-56 sm:h-64 md:h-72 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>

        {/* Categories placeholder */}
        <div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2 mx-auto mb-6"></div>
            <div className="flex justify-center gap-4">
                <div className="w-36 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="w-36 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl hidden sm:block"></div>
                <div className="w-36 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl hidden md:block"></div>
                <div className="w-36 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl hidden lg:block"></div>
                <div className="w-36 h-40 bg-slate-200 dark:bg-slate-700 rounded-xl hidden xl:block"></div>
            </div>
        </div>

        {/* Services carousel placeholder */}
        <div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3 mx-auto mb-6"></div>
            <div className="flex gap-6">
                <div className="w-72 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0"></div>
                <div className="w-72 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0 hidden sm:block"></div>
                <div className="w-72 h-64 bg-slate-200 dark:bg-slate-700 rounded-xl flex-shrink-0 hidden lg:block"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;