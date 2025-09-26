import React, { useState } from 'react';
import Modal from './Modal';

interface RejectReasonModalProps {
    onClose: () => void;
    onConfirm: (reason: string) => void;
    itemType?: 'الإعلان' | 'الوظيفة';
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({ onClose, onConfirm, itemType = 'الإعلان' }) => {
    const [reason, setReason] = useState('');
    return (
        <Modal isOpen={true} onClose={onClose} title="سبب الرفض">
            <div className="space-y-4">
                <textarea 
                    value={reason} 
                    onChange={e => setReason(e.target.value)} 
                    rows={3} 
                    placeholder={`اكتب سبب رفض ${itemType}...`} 
                    className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    aria-label="Reason for rejection"
                />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">إلغاء</button>
                    <button 
                        onClick={() => onConfirm(reason)} 
                        disabled={!reason.trim()}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
                    >
                        تأكيد الرفض
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default RejectReasonModal;