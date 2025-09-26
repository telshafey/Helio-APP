import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Review } from '../types';
import { ArrowLeftIcon, StarIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon } from '../components/common/Icons';
import { useServices } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';

const Rating: React.FC<{ rating: number; size?: string }> = ({ rating, size = 'w-5 h-5' }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`${size} ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }`} />
        ))}
    </div>
);

const ReplyForm: React.FC<{ review: Review; onSave: (reply: string) => void; onClose: () => void; }> = ({ review, onSave, onClose }) => {
    const [reply, setReply] = useState(review.adminReply || '');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(reply); };
    return (
        <form onSubmit={handleSubmit}>
            <textarea value={reply} onChange={e => setReply(e.target.value)} required rows={5} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none" placeholder="اكتب ردك هنا..."></textarea>
            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ الرد</button>
            </div>
        </form>
    );
};

const EditReviewForm: React.FC<{ review: Review; onSave: (comment: string) => void; onClose: () => void; }> = ({ review, onSave, onClose }) => {
    const [comment, setComment] = useState(review.comment);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(comment); };
    return (
        <form onSubmit={handleSubmit}>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تعليق المستخدم</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={5} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 border border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none"></textarea>
            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ التعديل</button>
            </div>
        </form>
    );
};


const ServiceDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { serviceId: serviceIdStr } = useParams<{ serviceId: string }>();
    const serviceId = Number(serviceIdStr);
    
    const { services, handleUpdateReview, handleDeleteReview, handleReplyToReview } = useServices();
    const { hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول ادارة الخدمات']);
    const service = services.find(s => s.id === serviceId);

    const [isReplyModalOpen, setReplyModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);

    const handleOpenReplyModal = (review: Review) => {
        setSelectedReview(review);
        setReplyModalOpen(true);
    };
    
    const handleOpenEditModal = (review: Review) => {
        setSelectedReview(review);
        setEditModalOpen(true);
    };

    if (!service) return <div>Service not found!</div>;
    
    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى قائمة الخدمات</span>
            </button>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="relative">
                    <img src={service.images[0]} alt={service.name} className="w-full h-48 sm:h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 p-4 sm:p-6">
                        <h1 className="text-3xl font-bold text-white">{service.name}</h1>
                        <p className="text-gray-200">{service.address}</p>
                    </div>
                </div>

                <div className="p-4 sm:p-6">
                    <h2 className