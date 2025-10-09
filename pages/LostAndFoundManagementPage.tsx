import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunity } from '../context/AppContext';
import { ArrowLeftIcon, ArchiveBoxIcon, CheckCircleIcon, XCircleIcon, ClockIcon, TrashIcon } from '../components/common/Icons';
import type { LostAndFoundItem, ListingStatus } from '../types';
import RejectReasonModal from '../components/common/RejectReasonModal';

const StatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => {
    const statusMap = {
        pending: { text: 'قيد المراجعة', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', icon: <ClockIcon className="w-4 h-4"/> },
        approved: { text: 'مقبول', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', icon: <CheckCircleIcon className="w-4 h-4"/> },
        rejected: { text: 'مرفوض', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', icon: <XCircleIcon className="w-4 h-4"/> },
        expired: { text: 'منتهي', classes: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300', icon: <ClockIcon className="w-4 h-4"/> },
    };
    const { text, classes, icon } = statusMap[status];
    return <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{icon}{text}</span>;
};

const LostAndFoundManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const { lostAndFoundItems, handleUpdateLostAndFoundItemStatus, handleDeleteLostAndFoundItem } = useCommunity();
    const [activeTab, setActiveTab] = useState<ListingStatus>('pending');
    const [rejectingItem, setRejectingItem] = useState<LostAndFoundItem | null>(null);

    const filteredItems = useMemo(() => {
        return lostAndFoundItems.filter(item => item.status === activeTab);
    }, [lostAndFoundItems, activeTab]);

    const handleRejectConfirm = (reason: string) => {
        if (rejectingItem) {
            handleUpdateLostAndFoundItemStatus(rejectingItem.id, 'rejected', reason);
        }
        setRejectingItem(null);
    };

    const tabs: { key: ListingStatus, name: string }[] = [
        { key: 'pending', name: 'قيد المراجعة' },
        { key: 'approved', name: 'المقبولة' },
        { key: 'rejected', name: 'المرفوضة' },
    ];

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-6"><ArrowLeftIcon className="w-5 h-5"/><span>العودة</span></button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3"><ArchiveBoxIcon className="w-8 h-8"/>إدارة المفقودات والموجودات</h1>

                <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                    <nav className="-mb-px flex gap-4" aria-label="Tabs">{tabs.map(tab => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === tab.key ? 'border-cyan-500 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tab.name} ({lostAndFoundItems.filter(i => i.status === tab.key).length})
                        </button>
                    ))}</nav>
                </div>
                
                <div className="space-y-4">{filteredItems.length > 0 ? filteredItems.map(item => (
                    <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex gap-4">
                            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />}
                            <div>
                                <p className="font-bold">{item.title} <span className={`text-xs font-semibold ${item.type === 'lost' ? 'text-red-500' : 'text-green-500'}`}>({item.type === 'lost' ? 'مفقود' : 'موجود'})</span></p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                <p className="text-xs text-gray-400 mt-1">بواسطة: {item.username}</p>
                                {item.status === 'rejected' && <p className="text-xs text-red-500">السبب: {item.rejectionReason}</p>}
                            </div>
                        </div>
                        <div className="flex sm:flex-col items-center justify-between sm:justify-start gap-2 flex-shrink-0">
                            <StatusBadge status={item.status} />
                            <div className="flex gap-2">
                                {item.status === 'pending' && <>
                                    <button onClick={() => handleUpdateLostAndFoundItemStatus(item.id, 'approved')} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"><CheckCircleIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setRejectingItem(item)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><XCircleIcon className="w-5 h-5"/></button>
                                </>}
                                <button onClick={() => handleDeleteLostAndFoundItem(item.id)} className="p-2 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center py-8 text-gray-500">لا توجد بلاغات في هذه الفئة.</p>}</div>
            </div>

            {rejectingItem && <RejectReasonModal onClose={() => setRejectingItem(null)} onConfirm={(reason) => { handleUpdateLostAndFoundItemStatus(rejectingItem.id, 'rejected', reason); setRejectingItem(null);}} itemType="البلاغ" />}
        </div>
    );
};

export default LostAndFoundManagementPage;
