import React, { Suspense, useState } from 'react';
import SkeletonLoader from './components/common/SkeletonLoader';
import ToastContainer from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';
import ConfirmationDialog from './components/common/ConfirmationDialog';
import BottomNav from './components/common/BottomNav';
import SideDrawer from './components/common/SideDrawer';
import PublicHeader from './components/common/PublicHeader';
import PublicFooter from './components/common/PublicFooter';
import WhatsAppFab from './components/common/WhatsAppFab';
import AnimatedRoutes from './components/common/AnimatedRoutes';


const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <div className="bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col" dir="rtl">
        <PublicHeader />
        <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <main className="flex-grow pt-14 pb-14 md:pb-0 relative">
          <Suspense fallback={<SkeletonLoader />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <div className="hidden md:block">
          <PublicFooter />
        </div>
        <div className="md:hidden">
           <BottomNav onMenuClick={() => setIsDrawerOpen(true)} />
        </div>
      </div>
      <ToastContainer />
      <WhatsAppFab />
      <ConfirmationDialog />
    </>
  );
};

export default App;