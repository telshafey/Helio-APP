import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../context/TransportationContext';
import { useAuth } from '../context/AuthContext';
import type { Driver, ExternalRoute, Supervisor, WeeklyScheduleItem } from '../types';
// Fix: Import MapPinIcon to resolve usage error.
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, BusIcon, UserCircleIcon, MapIcon, CalendarDaysIcon, PhoneIcon, ChevronDownIcon, MapPinIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import { InputField } from '../components/common/FormControls';
import PageBanner from '../components/common/PageBanner';
import { useNews } from '../context/NewsContext';
import AdSlider from '../components/common/AdSlider';

const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
        <PhoneIcon className="w-4 h-4" />
        <span>اتصال</span>
    </a>
);

const SupervisorCard: React.FC<{ name: string; phone: string; title: string; iconColor: string }> = ({ name, phone, title, iconColor }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <UserCircleIcon className={`w-10 h-10 ${iconColor}`} />
            <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            </div>
        </div>
        <CallButton phone={phone} />
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-base sm:px-6 sm:py-3 sm:text-lg font-semibold rounded-t-lg transition-colors focus:outline-none ${
            active
                ? 'bg-slate-100 dark:bg-slate-800 text-cyan-500 border-b-2 border-cyan-500'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
        }`}
    >
        {children}
    </button>
);

const PublicTransportationPage: React.FC = () => {
    const { transportation } = useTransportation();
    const { advertisements } = useNews();
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    const [showFullWeek, setShowFullWeek] = useState(false);

    const todayDate = new Date();
    const todayString = todayDate.toISOString().split('T')[0];
    const todaySchedule = transportation.weeklySchedule.find(d => d.date === todayString);
    const todayDayName = todayDate.toLocaleDateString('ar-EG', { weekday: 'long' });

    const sliderAds = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return advertisements.filter(ad => {
            const start = new Date(ad.startDate);
            const end = new Date(ad.endDate);
            return today >= start && today <= end;
        });
    }, [advertisements]);

    return (
        <div className="animate-fade-in bg-slate-100 dark:bg-slate-900" dir="rtl">
            <PageBanner
                title="دليل المواصلات"
                subtitle="كل ما تحتاجه لمعرفة مواعيد وخطوط سير الباصات."
                icon={<BusIcon className="w-12 h-12 text-lime-500" />}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {sliderAds.length > 0 && (
                    <div className="mb-8">
                        <AdSlider ads={sliderAds} />
                    </div>
                )}
                <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
                    <nav className="-mb-px flex justify-center gap-4" aria-label="Tabs">
                        <TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton>
                        <TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton>
                    </nav>
                </div>

                <div>
                    {activeTab === 'internal' && (
                        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
                            <SupervisorCard name={transportation.internalSupervisor.name} phone={transportation.internalSupervisor.phone} title="مشرف الباصات الداخلية" iconColor="text-cyan-500"/>
                            
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 justify-center">
                                    <CalendarDaysIcon className="w-6 h-6" />
                                    مناوبة اليوم: {todayDayName}
                                </h2>
                                {todaySchedule && todaySchedule.drivers.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {todaySchedule.drivers.map(driver => {
                                            const driverDetails = transportation.internalDrivers.find(d => d.name === driver.name);
                                            return (
                                                <div key={driver.name} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <img src={driverDetails?.avatar || `https://i.pravatar.cc/150?u=${driver.name}`} alt={driver.name} className="w-12 h-12 rounded-full object-cover"/>
                                                        <div>
                                                            <p className="font-bold text-gray-800 dark:text-white">{driver.name}</p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{driver.phone}</p>
                                                        </div>
                                                    </div>
                                                    <CallButton phone={driver.phone} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">لا يوجد سائقون مناوبون اليوم.</p>
                                )}
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={() => setShowFullWeek(!showFullWeek)}
                                    className="flex items-center gap-2 mx-auto px-4 py-2 font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/50 rounded-lg transition-colors"
                                >
                                    <span>{showFullWeek ? 'إخفاء جدول الأسبوع' : 'عرض جدول الأسبوع بالكامل'}</span>
                                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${showFullWeek ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {showFullWeek && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 justify-center"><CalendarDaysIcon className="w-6 h-6" /> الجدول الأسبوعي الكامل</h2>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md space-y-2">
                                        {transportation.weeklySchedule.map(item => {
                                            const dayName = new Date(`${item.date}T00:00:00`).toLocaleDateString('ar-EG', { weekday: 'long' });
                                            const isToday = dayName === todayDayName;

                                            return (
                                                 <div key={item.date} className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-2 transition-colors ${isToday ? 'bg-cyan-50 dark:bg-cyan-900/50 border-r-4 border-cyan-500' : ''}`}>
                                                    <div className="flex items-baseline gap-3 w-full sm:w-auto">
                                                        <span className={`w-16 font-bold text-lg ${isToday ? 'text-cyan-600 dark:text-cyan-300' : 'text-gray-800 dark:text-white'}`}>{dayName}</span>
                                                        <span className="text-sm font-mono text-gray-500">{item.date}</span>
                                                    </div>
                                                    <div className="w-full sm:w-auto sm:text-left pr-4 sm:pr-0">
                                                        {item.drivers.length > 0 
                                                            ? item.drivers.map((d, i) => <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed">{d.name}</p>) 
                                                            : <p className="text-sm text-gray-400">لا يوجد</p>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'external' && (
                        <div className="space-y-8 animate-fade-in">
                            <SupervisorCard name={transportation.externalSupervisor.name} phone={transportation.externalSupervisor.phone} title="مشرف الباصات الخارجية" iconColor="text-purple-500"/>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {transportation.externalRoutes.map(route => (
                                    <div key={route.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
                                        <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">المواعيد المتاحة:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {route.timings.map(time => (
                                                    <span key={time} className="bg-slate-200 dark:bg-slate-700 text-xs font-mono px-2 py-1 rounded">{time}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                               <MapPinIcon className="w-4 h-4"/>
                                               مكان الانتظار:
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{route.waitingPoint}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PublicTransportationPage;