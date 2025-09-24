import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon } from './common/Icons';
import { useAppContext } from '../context/AppContext';

const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
        <PhoneIcon className="w-4 h-4" />
        <span>اتصال</span>
    </a>
);

const SupervisorCard: React.FC<{ name: string; phone: string; title: string; iconColor?: string }> = ({ name, phone, title, iconColor = 'text-cyan-500' }) => (
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
        className={`px-6 py-3 font-semibold rounded-t-lg transition-colors focus:outline-none ${
            active
                ? 'bg-slate-100 dark:bg-slate-800 text-cyan-500 border-b-2 border-cyan-500'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
        }`}
    >
        {children}
    </button>
);


const TransportationPage: React.FC = () => {
    const navigate = useNavigate();
    const { transportation, isAuthenticated } = useAppContext();
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);

    const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
    const todaySchedule = transportation.weeklySchedule.find(d => d.day === today);

    // Public View
    if (!isAuthenticated) {
        return (
             <div className="animate-fade-in bg-slate-100 dark:bg-slate-900" dir="rtl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                     <div className="text-center mb-10">
                        <div className="inline-block p-4 bg-lime-100 dark:bg-lime-900/50 rounded-full mb-4">
                            <BusIcon className="w-12 h-12 text-lime-500" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">دليل المواصلات</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">كل ما تحتاجه لمعرفة مواعيد وخطوط سير الباصات.</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
                        <nav className="-mb-px flex justify-center gap-4" aria-label="Tabs">
                            <TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton>
                            <TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton>
                        </nav>
                    </div>

                    <div>
                        {activeTab === 'internal' && (
                            <div className="space-y-8 animate-fade-in">
                                <SupervisorCard name={transportation.internalSupervisor.name} phone={transportation.internalSupervisor.phone} title="مشرف الباصات الداخلية" iconColor="text-cyan-500"/>
                                
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">مناوبة اليوم ({today})</h2>
                                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md space-y-3">
                                        {todaySchedule && todaySchedule.drivers.length > 0 ? (
                                            todaySchedule.drivers.map((driver, index) => {
                                                const driverDetails = transportation.internalDrivers.find(d => d.name === driver.name);
                                                return (
                                                    <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                                        <div className="flex items-center gap-3">
                                                            <img src={driverDetails?.avatar || `https://i.pravatar.cc/150?u=${driver.name}`} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                                                            <span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span>
                                                        </div>
                                                        <CallButton phone={driver.phone} />
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">لا يوجد سائقين مناوبين اليوم.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-center mt-6">
                                    <button onClick={() => setShowWeeklySchedule(!showWeeklySchedule)} className="px-6 py-2 text-cyan-600 dark:text-cyan-400 font-semibold border-2 border-cyan-500 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/50 transition-colors">
                                        {showWeeklySchedule ? 'إخفاء جدول الأسبوع' : 'إظهار جدول الأسبوع'}
                                    </button>
                                </div>

                                {showWeeklySchedule && (
                                    <div className="mt-6 animate-fade-in">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 justify-center"><CalendarDaysIcon className="w-6 h-6" /> الجدول الأسبوعي</h2>
                                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md space-y-2">
                                            {transportation.weeklySchedule.map(item => (
                                                <div key={item.day} className={`p-3 rounded-md flex justify-between items-center ${item.day === today ? 'bg-cyan-50 dark:bg-cyan-900/50' : ''}`}>
                                                    <span className={`font-semibold ${item.day === today ? 'text-cyan-600 dark:text-cyan-300' : 'text-gray-800 dark:text-white'}`}>{item.day}</span>
                                                    <div className="text-left">
                                                        {item.drivers.length > 0 ? item.drivers.map((d, i) => <p key={i} className="text-sm text-gray-600 dark:text-gray-300">{d.name}</p>) : <p className="text-sm text-gray-400">لا يوجد</p>}
                                                    </div>
                                                </div>
                                            ))}
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
    }

    // Admin View
    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <BusIcon className="w-8 h-8" />
                إدارة الباصات
            </h1>

            <div className="border-b border-gray-200 dark:border-slate-700">
                <nav className="-mb-px flex gap-4" aria-label="Tabs">
                    <TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton>
                    <TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton>
                </nav>
            </div>

            <div>
                {activeTab === 'internal' && (
                    <div className="space-y-8">
                        <SupervisorCard name={transportation.internalSupervisor.name} phone={transportation.internalSupervisor.phone} title="مشرف الباصات الداخلية" />
                        
                        <div>
                            <h2 className="text-xl font-bold mb-4">قائمة السائقين</h2>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="text-sm text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="p-3">السائق</th>
                                            <th className="p-3">رقم الهاتف</th>
                                            <th className="p-3">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transportation.internalDrivers.map(driver => (
                                            <tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                                        <span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{driver.phone}</td>
                                                <td className="p-3"><CallButton phone={driver.phone} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6" /> الجدول الأسبوعي</h2>
                             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-right">
                                     <thead className="text-sm text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="p-3">اليوم</th>
                                            <th className="p-3">السائقون المناوبون</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transportation.weeklySchedule.map(item => (
                                            <tr key={item.day} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-3 font-semibold text-gray-800 dark:text-white">{item.day}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300">
                                                    {item.drivers.map(d => d.name).join('، ') || 'لا يوجد'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'external' && (
                    <div className="space-y-8">
                        <SupervisorCard name={transportation.externalSupervisor.name} phone={transportation.externalSupervisor.phone} title="مشرف الباصات الخارجية" />
                        
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
    );
};

export default TransportationPage;