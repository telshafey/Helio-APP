import React, { lazy, Suspense } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardView from '../components/DashboardView'; // General Manager default
import Spinner from '../components/common/Spinner';

// Lazy load the role-specific dashboards for better performance
const ServiceManagerDashboard = lazy(() => import('../components/dashboard/ServiceManagerDashboard'));
const PropertyManagerDashboard = lazy(() => import('../components/dashboard/PropertyManagerDashboard'));
const NewsManagerDashboard = lazy(() => import('../components/dashboard/NewsManagerDashboard'));
const TransportationManagerDashboard = lazy(() => import('../components/dashboard/TransportationManagerDashboard'));

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuth();

    const renderDashboard = () => {
        switch (currentUser?.role) {
            case 'مسؤول ادارة الخدمات':
                return <ServiceManagerDashboard />;
            case 'مسؤول العقارات':
                return <PropertyManagerDashboard />;
            case 'مسؤول الاخبار والاعلانات والاشعارات':
                return <NewsManagerDashboard />;
            case 'مسؤول الباصات':
                return <TransportationManagerDashboard />;
            case 'مدير عام':
            default:
                return <DashboardView />;
        }
    };

    return (
        <Suspense fallback={<Spinner />}>
            {renderDashboard()}
        </Suspense>
    );
};

export default DashboardPage;