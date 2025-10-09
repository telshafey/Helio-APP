import React from 'react';
import { useUI } from '../../context/UIContext';
import Modal from './Modal';
import { ShieldExclamationIcon } from './Icons';

const ConfirmationDialog: React.FC = () => {
    const { confirmation, hideConfirmation } = useUI();

    if (!confirmation.isOpen) {
        return null;
    }

    const handleConfirm = () => {
        confirmation.onConfirm();
        hideConfirmation();
    };

    return (
        <Modal isOpen={confirmation.isOpen} onClose={hideConfirmation} title={confirmation.title}>
            <div className="text-right">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <ShieldExclamationIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                        <p className="text-base leading-6 text-gray-700 dark:text-gray-300">
                            {confirmation.message}
                        </p>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                        onClick={handleConfirm}
                    >
                        تأكيد الحذف
                    </button>
                    <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto"
                        onClick={hideConfirmation}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationDialog;
