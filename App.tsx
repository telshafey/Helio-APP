import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Spinner from './components/common/Spinner';
import Breadcrumbs from './components/common/Breadcrumbs';
import { useAppContext } from './context/AppContext';
import ToastContainer from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

// New Mobile UI Components
import BottomNav from './components/common/BottomNav';
import SideDrawer from './components/common/SideDrawer';
import PublicHeader from './components/common/PublicHeader';
import PublicFooter from './components/common/PublicFooter';


// Lazy-loaded page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AdvertisementsPage = lazy(() => import('./pages/AdvertisementsPage'));
const TransportationPage = lazy(() => import('./pages/TransportationPage'));
const CityServicesGuidePage = lazy(() => import('./pages/CityServicesGuidePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesOverviewPage = lazy(() => import('./pages/ServicesOverviewPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));
const ContentManagementPage = lazy(() => import('./pages/ContentManagementPage'));

// New Public/Auth Pages
const PublicHomePage = lazy(() => import('./pages/PublicHomePage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const PublicLoginPage = lazy(() => import('./pages/PublicLoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PublicServicesPage = lazy(() => import('./pages/PublicServicesPage'));
const PublicServiceListPage = lazy(() => import('./pages/PublicServiceListPage'));
const PublicServiceDetailPage = lazy(() => import('./pages/PublicServiceDetailPage'));
const PublicPropertiesPage = lazy(() => import('./pages/PublicPropertiesPage'));
const PublicNewsPage = lazy(() => import('./pages/PublicNewsPage'));
const PublicNewsDetailPage = lazy(() => import('./pages/PublicNewsDetailPage'));
const PublicCityServicesGuidePage = lazy(() => import('./pages/PublicCityServicesGuidePage'));
const AboutCityPage = lazy(() => import('./pages/AboutCityPage'));
const AboutCompanyPage = lazy(() => import('./pages/AboutCompanyPage'));
const PublicProfilePage = lazy(() => import('./pages/PublicProfilePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const CommunityManagementPage = lazy(() => import('./pages/CommunityManagementPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const UserNotificationsPage = lazy(() => import('./pages/UserNotificationsPage'));
const PublicTransportationPage = lazy(() => import('./pages/PublicTransportationPage'));


const App: React.FC = () => {
  const { isAuthenticated, isPublicAuthenticated } = useAppContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      {!isAuthenticated ? (
        <>
          <div className="bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 min-h-screen font-sans flex flex-col" dir="rtl">
            <PublicHeader />
            <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <main className="flex-grow pt-16 pb-16 md:pb-0">
              <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Spinner /></div>}>
                <Routes>
                  <Route path="/" element={<PublicHomePage />} />
                  <Route path="/admin-login" element={<AdminLoginPage />} />
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
                  <Route path="/services" element={<PublicServicesPage />} />
                  <Route path="/services/subcategory/:subCategoryId" element={<PublicServiceListPage />} />
                  <Route path="/service/:serviceId" element={<PublicServiceDetailPage />} />
                  <Route path="/emergency" element={<EmergencyPage />} />
                  <Route path="/properties" element={<PublicPropertiesPage />} />
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
      ) : (
        <>
          <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
                <div className="h-full w-full">
                  <Breadcrumbs />
                  <Suspense fallback={<Spinner />}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/services/subcategory/:subCategoryId" element={<ServicePage />} />
                      <Route path="/services/detail/:serviceId" element={<ServiceDetailPage />} />
                       <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
                      <Route path="/properties" element={<PropertiesPage />} />
                      <Route path="/emergency" element={<EmergencyPage />} />
                      <Route path="/users" element={<UsersPage />} />
                      <Route path="/news" element={<NewsPage />} />
                      <Route path="/advertisements" element={<AdvertisementsPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/transportation" element={<TransportationPage />} />
                      <Route path="/city-services-guide" element={<CityServicesGuidePage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/services-overview" element={<ServicesOverviewPage />} />
                      <Route path="/reviews" element={<ReviewsPage />} />
                      <Route path="/audit-log" element={<AuditLogPage />} />
                      <Route path="/content-management" element={<ContentManagementPage />} />
                      <Route path="/community-management" element={<CommunityManagementPage />} />
                      <Route path="/about-city" element={<AboutCityPage />} />
                      <Route path="/about-company" element={<AboutCompanyPage />} />

                      {/* Redirect old public paths to dashboard home if logged in */}
                      <Route path="/about" element={<Navigate to="/" />} />
                      <Route path="/privacy-policy" element={<Navigate to="/" />} />
                      <Route path="/faq" element={<Navigate to="/" />} />
                      <Route path="/terms-of-use" element={<Navigate to="/" />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Suspense>
                </div>
              </main>
            </div>
          </div>
          <ToastContainer />
        </>
      )}
    </>
  );
};

export default App;
