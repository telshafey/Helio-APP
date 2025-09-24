import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon, 
    PencilSquareIcon, TrashIcon, PlusIcon 
} from '../components/common/Icons';
import { useData } from '../context/DataContext';
import { useAuth, useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import type { Driver, ExternalRoute, Supervisor, WeeklyScheduleItem } from '../types';

// Reusable Form Components
const InputField: React.FC<{ label: string, value: string, onChange: (val: string) => void, type?: string, required?: boolean }> = ({ label, value, onChange, type = 'text', required = true }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const TextareaField: React.FC<{ label: string, value: string, onChange: (val: string) => void, rows?: number, required?: boolean }> = ({ label, value, onChange, rows = 3, required = true }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} required={required} rows={rows} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
    </div>
);

// Form Components for Modals
const SupervisorForm: React.FC<{ supervisor: Supervisor; onSave: (data: Supervisor) => void; onClose: () => void; }> = ({ supervisor, onSave, onClose }) => {
    const [name, setName] = useState(supervisor.name);
    const [phone, setPhone] = useState(supervisor.phone);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ name, phone }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="اسم المشرف" value={name} onChange={setName} />
            <InputField label="رقم الهاتف" value={phone} onChange={setPhone} type="tel" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const DriverForm: React.FC<{ driver: Driver | null; onSave: (data: Omit<Driver, 'id'> & { id?: number }) => void; onClose: () => void; }> = ({ driver, onSave, onClose }) => {
    const [name, setName] = useState(driver?.name || '');
    const [phone, setPhone] = useState(driver?.phone || '');
    const [avatar, setAvatar] = useState(driver?.avatar ? [driver.avatar] : []);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: driver?.id, name, phone, avatar: avatar[0] || `https://i.pravatar.cc/150?u=${name}` });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="صورة السائق" />
            <InputField label="اسم السائق" value={name} onChange={setName} />
            <InputField label="رقم الهاتف" value={phone} onChange={setPhone} type="tel" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const RouteForm: React.FC<{ route: ExternalRoute | null; onSave: (data: Omit<ExternalRoute, 'id'> & { id?: number }) => void; onClose: () => void; }> = ({ route, onSave, onClose }) => {
    const [name, setName] = useState(route?.name || '');
    const [timings, setTimings] = useState(route?.timings.join(', ') || '');
    const [waitingPoint, setWaitingPoint] = useState(route?.waitingPoint || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: route?.id, name, timings: timings.split(',').map(t => t.trim()), waitingPoint });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="اسم المسار" value={name} onChange={setName} />
            <InputField label="المواعيد (مفصولة بفاصلة)" value={timings} onChange={setTimings} />
            <TextareaField label="نقطة الانتظار" value={waitingPoint} onChange={setWaitingPoint} />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const ScheduleForm: React.FC<{ schedule: WeeklyScheduleItem[]; drivers: Driver[]; onSave: (data: WeeklyScheduleItem[]) => void; onClose: () => void; }> = ({ schedule, drivers, onSave, onClose }) => {
    const [currentSchedule, setCurrentSchedule] = useState(schedule);

    const handleDriverChange = (day: string, selectedDrivers: string[]) => {
        const newSchedule = currentSchedule.map(item => {
            if (item.day === day) {
                return { ...item, drivers: selectedDrivers.map(name => {
                    const driver = drivers.find(d => d.name === name);
                    return { name: name, phone: driver?.phone || '' };
                })};
            }
            return item;
        });
        setCurrentSchedule(newSchedule);
    };
    
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(currentSchedule); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {currentSchedule.map(item => (
                <div key={item.day}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{item.day}</label>
                    <select
                        multiple
                        value={item.drivers.map(d => d.name)}
                        onChange={e => handleDriverChange(item.day, Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value))}
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 h-24"
                    >
                        {drivers.map(driver => <option key={driver.id} value={driver.name}>{driver.name}</option>)}
                    </select>
                     <p className="text-xs text-gray-400 mt-1">اضغط على Ctrl/Cmd للاختيار المتعدد.</p>
                </div>
            ))}
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md">حفظ الجدول</button>
            </div>
        </form>
    );
};

// Main Component
const TransportationPage: React.FC = () => {
    const navigate = useNavigate();
    const { transportation, handleSaveSupervisor, handleSaveDriver, handleDeleteDriver, handleSaveRoute, handleDeleteRoute, handleSaveSchedule } = useData();
    const { isAuthenticated } = useAuth();
    const canManage = useHasPermission(['مسؤول الباصات']);

    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);
    
    // Modal states
    const [modalState, setModalState] = useState<{ type: 'supervisor' | 'driver' | 'route' | 'schedule' | null, data?: any }>({ type: null });

    const openModal = (type: 'supervisor' | 'driver' | 'route' | 'schedule', data?: any) => setModalState({ type, data });
    const closeModal = () => setModalState({ type: null });

    const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
    const todaySchedule = transportation.weeklySchedule.find(d => d.day === today);
    
    const renderModalContent = () => {
        switch (modalState.type) {
            case 'supervisor':
                return <SupervisorForm supervisor={modalState.data.supervisor} onClose={closeModal} onSave={(data) => { handleSaveSupervisor(modalState.data.type, data); closeModal(); }} />;
            case 'driver':
                return <DriverForm driver={modalState.data} onClose={closeModal} onSave={(data) => { handleSaveDriver(data); closeModal(); }} />;
            case 'route':
                return <RouteForm route={modalState.data} onClose={closeModal} onSave={(data) => { handleSaveRoute(data); closeModal(); }} />;
            case 'schedule':
                return <ScheduleForm schedule={transportation.weeklySchedule} drivers={transportation.internalDrivers} onClose={closeModal} onSave={(data) => { handleSaveSchedule(data); closeModal(); }} />;
            default: return null;
        }
    };
    
    const getModalTitle = () => {
        switch (modalState.type) {
            case 'supervisor': return 'تعديل بيانات المشرف';
            case 'driver': return modalState.data ? 'تعديل بيانات السائق' : 'إضافة سائق جديد';
            case 'route': return modalState.data ? 'تعديل بيانات المسار' : 'إضافة مسار جديد';
            case 'schedule': return 'تعديل الجدول الأسبوعي';
            default: return '';
        }
    };
    
    const AdminButton: React.FC<{ onClick: () => void, title: string, children: React.ReactNode}> = ({ onClick, title, children }) => (
        canManage ? <button onClick={onClick} title={title} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">{children}</button> : null
    );

    // ... (CallButton, SupervisorCard, TabButton components remain the same as in your file) ...
    const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
        <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
            <PhoneIcon className="w-4 h-4" />
            <span>اتصال</span>
        </a>
    );

    const SupervisorCard: React.FC<{ supervisor: Supervisor; type: 'internal' | 'external'; title: string; iconColor?: string }> = ({ supervisor, type, title, iconColor = 'text-cyan-500' }) => (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <UserCircleIcon className={`w-10 h-10 ${iconColor}`} />
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{supervisor.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isAuthenticated && <AdminButton onClick={() => openModal('supervisor', { supervisor, type })} title="تعديل"><PencilSquareIcon className="w-5 h-5"/></AdminButton>}
                <CallButton phone={supervisor.phone} />
            </div>
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

    if(!isAuthenticated) {
        // Public View JSX (same as your provided code)
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
                                <SupervisorCard supervisor={transportation.internalSupervisor} type="internal" title="مشرف الباصات الداخلية" iconColor="text-cyan-500"/>
                                
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
                                <SupervisorCard supervisor={transportation.externalSupervisor} type="external" title="مشرف الباصات الخارجية" iconColor="text-purple-500"/>
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
    
    // Admin View JSX with CRUD
    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><BusIcon className="w-8 h-8" />إدارة الباصات</h1>
            <div className="border-b border-gray-200 dark:border-slate-700"><nav className="-mb-px flex gap-4"><TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton><TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton></nav></div>
            
            {activeTab === 'internal' && (
                <div className="space-y-8">
                    <SupervisorCard supervisor={transportation.internalSupervisor} type="internal" title="مشرف الباصات الداخلية" />
                    <div>
                        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">قائمة السائقين</h2>{canManage && <button onClick={() => openModal('driver')} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5"/>إضافة سائق</button>}</div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                            <table className="w-full text-right">
                                {/* driver table head */}
                                <tbody>{transportation.internalDrivers.map(driver => (<tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700">
                                    <td className="p-3"><div className="flex items-center gap-3"><img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/><span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span></div></td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{driver.phone}</td>
                                    <td className="p-3"><div className="flex items-center gap-2">{canManage && <><AdminButton onClick={() => openModal('driver', driver)} title="تعديل"><PencilSquareIcon className="w-5 h-5"/></AdminButton><button onClick={() => handleDeleteDriver(driver.id)} title="حذف" className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button></>}</div></td>
                                </tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6"/>الجدول الأسبوعي</h2>{canManage && <AdminButton onClick={() => openModal('schedule')} title="تعديل الجدول"><PencilSquareIcon className="w-5 h-5"/></AdminButton>}</div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                           {/* schedule table */}
                           <table className="w-full text-right">
                                <thead className="text-sm text-gray-600 dark:text-gray-400"><tr><th className="p-3">اليوم</th><th className="p-3">السائقون المناوبون</th></tr></thead>
                                <tbody>{transportation.weeklySchedule.map(item => (<tr key={item.day} className="border-t border-slate-200 dark:border-slate-700"><td className="p-3 font-semibold text-gray-800 dark:text-white">{item.day}</td><td className="p-3 text-gray-600 dark:text-gray-300">{item.drivers.map(d => d.name).join('، ') || 'لا يوجد'}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'external' && (
                <div className="space-y-8">
                    <SupervisorCard supervisor={transportation.externalSupervisor} type="external" title="مشرف الباصات الخارجية" iconColor="text-purple-500" />
                     <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">المسارات الخارجية</h2>{canManage && <button onClick={() => openModal('route')} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5"/>إضافة مسار</button>}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {transportation.externalRoutes.map(route => (<div key={route.id} className="relative group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
                             {canManage && <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><AdminButton onClick={() => openModal('route', route)} title="تعديل"><PencilSquareIcon className="w-4 h-4"/></AdminButton><button onClick={() => handleDeleteRoute(route.id)} title="حذف" className="p-2 text-red-500 bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-4 h-4"/></button></div>}
                            <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                            <div><h4 className="text-sm font-semibold mb-2">المواعيد:</h4><div className="flex flex-wrap gap-2">{route.timings.map(time => (<span key={time} className="bg-slate-200 dark:bg-slate-700 text-xs font-mono px-2 py-1 rounded">{time}</span>))}</div></div>
                            <div><h4 className="text-sm font-semibold mb-2 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>مكان الانتظار:</h4><p className="text-sm text-gray-600 dark:text-gray-400">{route.waitingPoint}</p></div>
                        </div>))}
                    </div>
                </div>
            )}

            <Modal isOpen={modalState.type !== null} onClose={closeModal} title={getModalTitle()}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default TransportationPage;