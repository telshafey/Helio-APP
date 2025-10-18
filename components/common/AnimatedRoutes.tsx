import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { lazyWithPrefetch } from './lazyWithPrefetch';

// Lazy-loaded page components with prefetching capability
const EmergencyPage = lazyWithPrefetch(() => import('../../pages/EmergencyPage'));
const PrivacyPolicyPage = lazyWithPrefetch(() => import('../../pages/PrivacyPolicyPage'));
const AboutPage = lazyWithPrefetch(() => import('../../pages/AboutPage'));
const FaqPage = lazyWithPrefetch(() => import('../../pages/FaqPage'));
const TermsOfUsePage = lazyWithPrefetch(() => import('../../pages/TermsOfUsePage'));
const PublicHomePage = lazyWithPrefetch(() => import('../../pages/PublicHomePage'));
const PublicLoginPage = lazyWithPrefetch(() => import('../../pages/PublicLoginPage'));
const RegisterPage = lazyWithPrefetch(() => import('../../pages/RegisterPage'));
const ProfilePage = lazyWithPrefetch(() => import('../../pages/ProfilePage'));
const PublicServicesPage = lazyWithPrefetch(() => import('../../pages/PublicServicesPage'));
const PublicServiceListPage = lazyWithPrefetch(() => import('../../pages/PublicServiceListPage'));
const PublicServiceDetailPage = lazyWithPrefetch(() => import('../../pages/PublicServiceDetailPage'));
const PublicPropertiesPage = lazyWithPrefetch(() => import('../../pages/PublicPropertiesPage'));
const PublicPropertyDetailPage = lazyWithPrefetch(() => import('../../pages/PublicPropertyDetailPage'));
const PublicNewsPage = lazyWithPrefetch(() => import('../../pages/PublicNewsPage'));
const PublicNewsDetailPage = lazyWithPrefetch(() => import('../../pages/PublicNewsDetailPage'));
const PublicCityServicesGuidePage = lazyWithPrefetch(() => import('../../pages/PublicCityServicesGuidePage'));
const AboutCityPage = lazyWithPrefetch(() => import('../../pages/AboutCityPage'));
const PublicProfilePage = lazyWithPrefetch(() => import('../../pages/PublicProfilePage'));
const CommunityPage = lazyWithPrefetch(() => import('../../pages/CommunityPage'));
const PostDetailPage = lazyWithPrefetch(() => import('../../pages/PostDetailPage'));
const FavoritesPage = lazyWithPrefetch(() => import('../../pages/FavoritesPage'));
const UserNotificationsPage = lazyWithPrefetch(() => import('../../pages/UserNotificationsPage'));
const PublicTransportationPage = lazyWithPrefetch(() => import('../../pages/PublicTransportationPage'));
const ContactPage = lazyWithPrefetch(() => import('../../pages/ContactPage'));
const MarketplaceManagementPage = lazyWithPrefetch(() => import('../../pages/MarketplaceManagementPage'));
const JobsManagementPage = lazyWithPrefetch(() => import('../../pages/JobsManagementPage'));
const OffersManagementPage = lazyWithPrefetch(() => import('../../pages/OffersManagementPage'));
const LostAndFoundManagementPage = lazyWithPrefetch(() => import('../../pages/LostAndFoundManagementPage'));

export const prefetchMap: { [path: string]: () => Promise<any> } = {
  '/': PublicHomePage.preload,
  '/services': PublicServicesPage.preload,
  '/properties': PublicPropertiesPage.preload,
  '/news': PublicNewsPage.preload,
  '/community': CommunityPage.preload,
  '/transportation': PublicTransportationPage.preload,
  '/emergency': EmergencyPage.preload,
  '/favorites': FavoritesPage.preload,
  '/about': AboutPage.preload,
  '/faq': FaqPage.preload,
  '/city-services-guide': PublicCityServicesGuidePage.preload,
  '/about-city': AboutCityPage.preload,
  '/contact': ContactPage.preload,
  '/privacy-policy': PrivacyPolicyPage.preload,
  '/terms-of-use': TermsOfUsePage.preload,
  '/login-user': PublicLoginPage.preload,
  '/register': RegisterPage.preload,
  '/marketplace-management': MarketplaceManagementPage.preload,
  '/jobs-management': JobsManagementPage.preload,
  '/offers-management': OffersManagementPage.preload,
  '/lost-and-found-management': LostAndFoundManagementPage.preload,
  // Add dynamic prefetch handlers
  ...(() => {
    const dynamicPrefetches: { [key: string]: () => Promise<any> } = {};
    // Preload for up to 20 potential detail pages to improve performance.
    for (let i = 1; i <= 20; i++) {
        dynamicPrefetches[`/service/${i}`] = PublicServiceDetailPage.preload;
        dynamicPrefetches[`/property/${i}`] = PublicPropertyDetailPage.preload;
        dynamicPrefetches[`/news/${i}`] = PublicNewsDetailPage.preload;
        dynamicPrefetches[`/post/${i}`] = PostDetailPage.preload;
    }
    return dynamicPrefetches;
  })()
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    const { isPublicAuthenticated } = useAuth();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><PublicHomePage /></AnimatedPage>} />
                <Route path="/login-user" element={<AnimatedPage><PublicLoginPage /></AnimatedPage>} />
                <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
                <Route path="/profile" element={isPublicAuthenticated ? <AnimatedPage><ProfilePage /></AnimatedPage> : <Navigate to="/login-user" />} />
                <Route path="/favorites" element={isPublicAuthenticated ? <AnimatedPage><FavoritesPage /></AnimatedPage> : <Navigate to="/login-user" />} />
                <Route path="/user-notifications" element={<AnimatedPage><UserNotificationsPage /></AnimatedPage>} />
                <Route path="/user/:userId" element={<AnimatedPage><PublicProfilePage /></AnimatedPage>} />
                <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
                <Route path="/about-city" element={<AnimatedPage><AboutCityPage /></AnimatedPage>} />
                <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicyPage /></AnimatedPage>} />
                <Route path="/faq" element={<AnimatedPage><FaqPage /></AnimatedPage>} />
                <Route path="/terms-of-use" element={<AnimatedPage><TermsOfUsePage /></AnimatedPage>} />
                <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
                <Route path="/services" element={<AnimatedPage><PublicServicesPage /></AnimatedPage>} />
                <Route path="/services/subcategory/:subCategoryId" element={<AnimatedPage><PublicServiceListPage /></AnimatedPage>} />
                <Route path="/service/:serviceId" element={<AnimatedPage><PublicServiceDetailPage /></AnimatedPage>} />
                <Route path="/emergency" element={<AnimatedPage><EmergencyPage /></AnimatedPage>} />
                <Route path="/properties" element={<AnimatedPage><PublicPropertiesPage /></AnimatedPage>} />
                <Route path="/property/:propertyId" element={<AnimatedPage><PublicPropertyDetailPage /></AnimatedPage>} />
                <Route path="/news" element={<AnimatedPage><PublicNewsPage /></AnimatedPage>} />
                <Route path="/news/:newsId" element={<AnimatedPage><PublicNewsDetailPage /></AnimatedPage>} />
                <Route path="/transportation" element={<AnimatedPage><PublicTransportationPage /></AnimatedPage>} />
                <Route path="/city-services-guide" element={<AnimatedPage><PublicCityServicesGuidePage /></AnimatedPage>} />
                <Route path="/community" element={<AnimatedPage><CommunityPage /></AnimatedPage>} />
                <Route path="/post/:postId" element={<AnimatedPage><PostDetailPage /></AnimatedPage>} />
                
                {/* Marketplace and Jobs Routes */}
                <Route path="/marketplace-management" element={<AnimatedPage><MarketplaceManagementPage /></AnimatedPage>} />
                <Route path="/jobs-management" element={<AnimatedPage><JobsManagementPage /></AnimatedPage>} />
                
                {/* New Offers and Lost & Found Routes */}
                <Route path="/offers-management" element={<AnimatedPage><OffersManagementPage /></AnimatedPage>} />
                <Route path="/lost-and-found-management" element={<AnimatedPage><LostAndFoundManagementPage /></AnimatedPage>} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;