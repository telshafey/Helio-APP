import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, StarIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon, 
    MagnifyingGlassIcon, ArrowTrendingUpIcon, ChatBubbleOvalLeftIcon, SparklesIcon,
    CheckCircleIcon, XCircleIcon
} from '../components/common/Icons';
import type { Review } from '../types';
import { useAppContext, useHasPermission } from '../context/AppContext';
import Modal from '../components/common/Modal';
import KpiCard from '../components/common/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

// AI Analysis Types
interface AnalysisResult {
    summary: string;
    positive_points: string[];
    negative_points: string[];
    suggested_reply: string;
}

// Components copied from other files to keep changes minimal
const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-4 h-4 ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }`} />
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

// Main Page Component
const ReviewsPage: React.FC = () => {
    const navigate = useNavigate();
    const { services, handleUpdateReview, handleDeleteReview, handleReplyToReview } = useAppContext();
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [serviceFilter, setServiceFilter] = useState<number>(0);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isReplyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<(Review & { serviceId: number }) | null>(null);

    // AI Analysis State
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [