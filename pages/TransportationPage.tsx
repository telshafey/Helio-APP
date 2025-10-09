import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransportation } from '../context/TransportationContext';
import { useAuth } from '../context/AuthContext';
import type { Driver, ExternalRoute, Supervisor, WeeklyScheduleItem } from '../types';
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, BusIcon, UserCircleIcon, MapIcon, CalendarDaysIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import { InputField } from '../components/common/FormControls';

// Form for editing a supervisor
const SupervisorForm: React.FC<{ supervisor: Supervisor; onSave: (supervisor: Supervisor) => void; onClose: () => void }> = ({ supervisor, onSave, onClose }) => {
    const [name, setName] = useState(supervisor.name);
    const [phone, setPhone] = useState(supervisor.phone);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, phone });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="name" label="الاسم" value={name} onChange={e => setName(e.target.value)} required />
            <InputField name="phone" label="رقم الهاتف" value={phone} onChange={e => setPhone(e.target.value)} required />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

// Form for adding/editing a driver
const DriverForm: React.FC<{ driver: Driver | null; onSave: (driver: Omit<Driver, 'id'> & { id?: number }) => void; onClose: () => void }> = ({ driver, onSave, onClose }) => {
    const [name, setName] = useState(driver?.name || '');
    const [phone, setPhone] = useState(driver?.phone || '');
    const [avatar, setAvatar] = useState(driver?.avatar ? [driver.avatar] : []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: driver?.id, name, phone, avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}` });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="name" label="الاسم" value={name} onChange={e => setName(e.target.value)} required />
            <InputField name="phone" label="رقم الهاتف" value={phone} onChange={e => setPhone(e.target.value)} required />
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="صورة السائق" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

// Form for adding/editing a route
const RouteForm: React.FC<{ route: ExternalRoute | null; onSave: (route: Omit<ExternalRoute, 'id'> & { id?: number }) => void; onClose: () => void }> = ({ route, onSave, onClose }) => {
    const [name, setName] = useState(route?.name || '');
    const [waitingPoint, setWaitingPoint] = useState(route?.waitingPoint || '');
    const [timings, setTimings] = useState(route?.timings.join(', ') || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: route?.id, name, waitingPoint, timings: timings.split(',').map(t => t.trim()).filter(Boolean) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="name" label="اسم المسار" value={name} onChange={e => setName(e.target.value)} required />
            <InputField name="waitingPoint" label="نقطة الانتظار" value={waitingPoint} onChange={e => setWaitingPoint(e.target.value)} required />
            <InputField name="timings" label="المواعيد (مفصولة بفاصلة)" value={timings} onChange={e => setTimings(e.target.value)} required />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const ScheduleEditor: React.FC<{ schedule: WeeklyScheduleItem[]; drivers: Driver[]; onSave: (schedule: WeeklyScheduleItem[]) => void }> = ({ schedule, drivers, onSave }) => {
    const [localSchedule, setLocalSchedule] = useState(schedule);

    const handleDriverChange = (date: string, driverName: string, isChecked: boolean) => {
        const driver = drivers.find(d => d.name === driverName);
        if (!driver) return;

        setLocalSchedule(prev => prev.map(day => {
            if (day.date === date) {
                const newDrivers = isChecked
                    ? [...day.drivers, { name: driver.name, phone: driver.phone }]
                    : day.drivers.filter(d => d.name !== driverName);
                return { ...day, drivers: newDrivers };
            }
            return day;
        }));
    };

    const dayName = (dateString: string) => {
        return new Date(`${dateString}T00:00:00`).toLocaleDateString('ar-EG', { weekday: 'long' });
    };

    return (
        <div>
            <div className="space-y-4">
                {localSchedule.map(day => (
                    <div key={day.date} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <h4 className="font-bold mb-3">{dayName(day.date)} <span className="text-sm font-mono text-gray-500">{day.date}</span></h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {drivers.map(driver => (
                                <label key={driver.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-md">
                                    <input
                                        type="checkbox"
                                        checked={day.drivers.some(d => d.name === driver.name)}
                                        onChange={e => handleDriverChange(day.date, driver.name, e.target.checked)}
                                        className="form-checkbox h-4 w-4 rounded text-cyan-500"
                                    />
                                    <span className="text-sm">{driver.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={() => onSave(localSchedule)} className="px-6 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ الجدول</button>
            </div>
        </div>
    );
};


const TransportationPage: React.FC = () => {
    const navigate = useNavigate();
    const { transportation, handleSaveDriver, handleDeleteDriver, handleSaveRoute, handleDeleteRoute, handleSaveSchedule, handleSaveSupervisor } = useTransportation();
    const { hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول الباصات']);
    
    const [modal, setModal] = useState<'supervisor' | 'driver' | 'route' | null>(null);
    const [editingData, setEditingData] = useState<any>(null);
    const [supervisorType, setSupervisorType] = useState<'internal' | 'external'>('internal');

    const openSupervisorModal = (type: 'internal' | 'external') => {
        setSupervisorType(type);
        setEditingData(type === 'internal' ? transportation.internalSupervisor : transportation.externalSupervisor);
        setModal('supervisor');
    };

    const openDriverModal = (driver: Driver | null) => {
        setEditingData(driver);
        setModal('driver');
    };

    const openRouteModal = (route: ExternalRoute | null) => {
        setEditingData(route);
        setModal('route');
    };
    
    const closeModal = () => {
        setModal(null);
        setEditingData(null);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3"><BusIcon className="w-8 h-8"/>إدارة النقل والمواصلات</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Internal Transport */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold border-b pb-2">النقل الداخلي</h2>
                        {/* Supervisor */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold flex items-center gap-2"><UserCircleIcon className="w-5 h-5"/>المشرف الداخلي</h3>
                                {canManage && <button onClick={() => openSupervisorModal('internal')} className="p-1.5 text-blue-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"><PencilSquareIcon className="w-5 h-5"/></button>}
                            </div>
                            <p>{transportation.internalSupervisor.name} - {transportation.internalSupervisor.phone}</p>
                        </div>
                        {/* Drivers */}
                        <div>
                             <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">السائقون الداخليون</h3>
                                {canManage && <button onClick={() => openDriverModal(null)} className="flex items-center gap-1 text-sm bg-cyan-500 text-white px-3 py-1.5 rounded-md hover:bg-cyan-600"><PlusIcon className="w-4 h-4"/>إضافة سائق</button>}
                            </div>
                            <div className="space-y-2">
                                {transportation.internalDrivers.map(driver => (
                                    <div key={driver.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <div>
                                                <p className="font-medium">{driver.name}</p>
                                                <p className="text-sm text-gray-500 font-mono">{driver.phone}</p>
                                            </div>
                                        </div>
                                        {canManage && <div className="flex gap-1">
                                            <button onClick={() => openDriverModal(driver)} className="p-2 text-blue-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"><PencilSquareIcon className="w-4 h-4"/></button>
                                            <button onClick={() => handleDeleteDriver(driver.id)} className="p-2 text-red-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"><TrashIcon className="w-4 h-4"/></button>
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    
                    {/* External Transport */}
                    <section className="space-y-6">
                         <h2 className="text-xl font-bold border-b pb-2">النقل الخارجي</h2>
                        {/* Supervisor */}
                         <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold flex items-center gap-2"><UserCircleIcon className="w-5 h-5"/>المشرف الخارجي</h3>
                                {canManage && <button onClick={() => openSupervisorModal('external')} className="p-1.5 text-blue-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"><PencilSquareIcon className="w-5 h-5"/></button>}
                            </div>
                            <p>{transportation.externalSupervisor.name} - {transportation.externalSupervisor.phone}</p>
                        </div>
                        {/* Routes */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">المسارات الخارجية</h3>
                                {canManage && <button onClick={() => openRouteModal(null)} className="flex items-center gap-1 text-sm bg-cyan-500 text-white px-3 py-1.5 rounded-md hover:bg-cyan-600"><PlusIcon className="w-4 h-4"/>إضافة مسار</button>}
                            </div>
                            <div className="space-y-2">
                                {transportation.externalRoutes.map(route => (
                                     <div key={route.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                         <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium flex items-center gap-2"><MapIcon className="w-4 h-4"/>{route.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">نقطة الانتظار: {route.waitingPoint}</p>
                                                <p className="text-xs text-gray-500 mt-1">المواعيد: {route.timings.join(' - ')}</p>
                                            </div>
                                            {canManage && <div className="flex gap-1">
                                                <button onClick={() => openRouteModal(route)} className="p-2 text-blue-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"><PencilSquareIcon className="w-4 h-4"/></button>
                                                <button onClick={() => handleDeleteRoute(route.id)} className="p-2 text-red-500 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600"><TrashIcon className="w-4 h-4"/></button>
                                            </div>}
                                         </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Weekly Schedule */}
                <section className="mt-12 pt-6 border-t">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6"/>الجدول الأسبوعي للمناوبات الداخلية</h2>
                    <ScheduleEditor schedule={transportation.weeklySchedule} drivers={transportation.internalDrivers} onSave={handleSaveSchedule} />
                </section>
            </div>

            {/* Modals */}
            <Modal isOpen={modal === 'supervisor'} onClose={closeModal} title="تعديل بيانات المشرف">
                <SupervisorForm supervisor={editingData} onClose={closeModal} onSave={(data) => { handleSaveSupervisor(supervisorType, data); closeModal(); }} />
            </Modal>
            <Modal isOpen={modal === 'driver'} onClose={closeModal} title={editingData ? "تعديل بيانات السائق" : "إضافة سائق جديد"}>
                <DriverForm driver={editingData} onClose={closeModal} onSave={(data) => { handleSaveDriver(data); closeModal(); }} />
            </Modal>
             <Modal isOpen={modal === 'route'} onClose={closeModal} title={editingData ? "تعديل بيانات المسار" : "إضافة مسار جديد"}>
                <RouteForm route={editingData} onClose={closeModal} onSave={(data) => { handleSaveRoute(data); closeModal(); }} />
            </Modal>
        </div>
    );
};

export default TransportationPage;