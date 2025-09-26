import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Spinner from './components/common/Spinner';
import { useAuth } from './context/AuthContext';
import ToastContainer from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

// New Mobile UI Components
import BottomNav from './components/common/BottomNav';
import SideDrawer from './components/common/SideDrawer';
import PublicHeader from './components/common/PublicHeader';
import PublicFooter from './components/common/PublicFooter';


// Lazy-loaded page components
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));


// New Public/Auth Pages
const PublicHomePage = lazy(() => import('./pages/PublicHomePage'));
const PublicLoginPage = lazy(() => import('./pages/PublicLoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PublicServicesPage = lazy(() => import('./pages/PublicServicesPage'));
const PublicServiceListPage = lazy(() => import('./pages/PublicServiceListPage'));
const PublicServiceDetailPage = lazy(() => import('./pages/PublicServiceDetailPage'));
const PublicPropertiesPage = lazy(() => import('./pages/PublicPropertiesPage'));
const PublicPropertyDetailPage = lazy(() => import('./pages/PublicPropertyDetailPage'));
const PublicNewsPage = lazy(() => import('./pages/PublicNewsPage'));
const PublicNewsDetailPage = lazy(() => import('./pages/PublicNewsDetailPage'));
const PublicCityServicesGuidePage = lazy(() => import('./pages/PublicCityServicesGuidePage'));
const AboutCityPage = lazy(() => import('./pages/AboutCityPage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const UserNotificationsPage = lazy(() => import('./pages/UserNotificationsPage'));
const PublicTransportationPage = lazy(() => import('./pages/PublicTransportationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));


const App: React.FC = () => {
  const { isPublicAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <div className="bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col" dir="rtl">
        <PublicHeader />
        <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <main className="flex-grow pt-14 pb-14 md:pb-0">
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Spinner /></div>}>
            <Routes>
              <Route path="/" element={<PublicHomePage />} />
              <Route path="/login-user" element={<PublicLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={isPublicAuthenticated ? <ProfilePage /> : <Navigate to="/login-user" />} />
              <Route path="/favorites" element={isPublicAuthenticated ? <FavoritesPage /> : <Navigate to="/login-user" />} />
              <Route path="/user-notifications" element={<UserNotificationsPage />} />
              <Route path="/user/:userId" element={<PublicProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/about-city" element={<AboutCityPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/services" element={<PublicServicesPage />} />
              <Route path="/services/subcategory/:subCategoryId" element={<PublicServiceListPage />} />
              <Route path="/service/:serviceId" element={<PublicServiceDetailPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/properties" element={<PublicPropertiesPage />} />
              <Route path="/property/:propertyId" element={<PublicPropertyDetailPage />} />
              <Route path="/news" element={<PublicNewsPage />} />
              <Route path="/news/:newsId" element={<PublicNewsDetailPage />} />
              <Route path="/transportation" element={<PublicTransportationPage />} />
              <Route path="/city-services-guide" element={<PublicCityServicesGuidePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/post/:postId" element={<PostDetailPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
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
    </>
  );
};

export default App;