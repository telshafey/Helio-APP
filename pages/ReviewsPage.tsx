import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, StarIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon, 
    MagnifyingGlassIcon, ArrowTrendingUpIcon, ChatBubbleOvalLeftIcon, SparklesIcon,
    CheckCircleIcon, XCircleIcon
} from '../components/common/Icons';
import type { Review } from '../types';
import { useServices } from '../context/ServicesContext';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import KpiCard from '../components/common/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";
import Spinner from '../components/common/Spinner';

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

// AI Analysis Modal Component
const AnalysisModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    isAnalyzing: boolean;
    analysisResult: AnalysisResult | null;
    error: string | null;
}> = ({ isOpen, onClose, isAnalyzing, analysisResult, error }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تحليل التقييمات بالذكاء الاصطناعي">
            {isAnalyzing && (
                <div className="text-center py-10">
                    <Spinner />
                    <p className="mt-4 font-semibold">جاري تحليل التقييمات...</p>
                    <p className="text-sm text-gray-500">قد تستغرق هذه العملية بضع لحظات.</p>
                </div>
            )}
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {analysisResult && !isAnalyzing && (
                <div className="space-y-6 text-right animate-fade-in">
                    <div>
                        <h3 className="text-lg font-bold mb-2">ملخص عام</h3>
                        <p className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md">{analysisResult.summary}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2">النقاط الإيجابية الرئيسية</h3>
                            <ul className="space-y-2">
                                {analysisResult.positive_points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">نقاط التحسين المقترحة</h3>
                            <ul className="space-y-2">
                                {analysisResult.negative_points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <XCircleIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-2">اقتراح رد عام</h3>
                        <p className="bg-slate-100 dark:bg-slate-700 p-3 rounded-md whitespace-pre-wrap">{analysisResult.suggested_reply}</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};


// Main Page Component
const ReviewsPage: React.FC = () => {
    const navigate = useNavigate();
    // Fix: These properties belong to ServicesContext, not DataContext.
    const { services, handleUpdateReview, handleDeleteReview, handleReplyToReview } = useServices();
    const { hasPermission } = useAuth();
    const canManage = hasPermission(['مسؤول ادارة الخدمات']);
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
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

    const allReviews = useMemo(() => (
        services.flatMap(service =>
            service.reviews.map(review => ({
                ...review,
                serviceId: service.id,
                serviceName: service.name,
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    ), [services]);
    
    const filteredReviews = useMemo(() => {
        return allReviews.filter(review => {
            const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  review.username.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRating = ratingFilter === 0 || review.rating === ratingFilter;
            const matchesService = serviceFilter === 0 || review.serviceId === serviceFilter;
            return matchesSearch && matchesRating && matchesService;
        });
    }, [allReviews, searchTerm, ratingFilter, serviceFilter]);
    
    const kpiData = useMemo(() => {
        const total = allReviews.length;
        const avgRating = total > 0 ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : '0.0';
        const reviewsWithReply = allReviews.filter(r => r.adminReply).length;
        return { total, avgRating, reviewsWithReply };
    }, [allReviews]);

    const ratingDistribution = useMemo(() => {
        const counts = [
            { name: '1 نجمة', value: 0 }, { name: '2 نجوم', value: 0 },
            { name: '3 نجوم', value: 0 }, { name: '4 نجوم', value: 0 },
            { name: '5 نجوم', value: 0 }
        ];
        allReviews.forEach(r => {
            counts[r.rating - 1].value++;
        });
        return counts;
    }, [allReviews]);

    const handleOpenReplyModal = (review: Review & { serviceId: number }) => { setSelectedReview(review); setReplyModalOpen(true); };
    const handleOpenEditModal = (review: Review & { serviceId: number }) => { setSelectedReview(review); setEditModalOpen(true); };

    const handleAnalyzeReviews = async () => {
        if (allReviews.length === 0) {
            alert("لا توجد تقييمات لتحليلها.");
            return;
        }
        
        setIsAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);

        const reviewsText = allReviews.map(r => `الخدمة: ${r.serviceName}, التقييم: ${r.rating}, التعليق: ${r.comment}`).join('\n---\n');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `أنت محلل بيانات متخصص في مراجعات العملاء. قم بتحليل التقييمات التالية باللغة العربية: \n\n${reviewsText}\n\n قدم لي النتائج كملف JSON.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING, description: 'ملخص عام وموجز للانطباع العام من جميع التقييمات.' },
                            positive_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة بأهم 3-5 نقاط إيجابية متكررة.' },
                            negative_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'قائمة بأهم 3-5 نقاط سلبية أو مجالات للتحسين.' },
                            suggested_reply: { type: Type.STRING, description: 'اقتراح رد عام ومهني يمكن استخدامه للرد على العملاء، يشكرهم ويعترف بالنقاط المذكورة.' }
                        }
                    }
                }
            });
            
            const resultText = response.text.trim();
            const resultJson: AnalysisResult = JSON.parse(resultText);
            setAnalysisResult(resultJson);

        } catch (error) {
            console.error("Error analyzing reviews:", error);
            setAnalysisError("حدث خطأ أثناء تحليل التقييمات. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><ChatBubbleOvalLeftIcon className="w-8 h-8"/>إدارة التقييمات</h1>
                        <p className="text-gray-500 dark:text-gray-400">مراجعة والرد على آراء المستخدمين حول الخدمات.</p>
                    </div>
                    {canManage && (
                        <button onClick={handleAnalyzeReviews} disabled={isAnalyzing} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                            <SparklesIcon className="w-5 h-5"/>
                            <span>تحليل جميع التقييمات باستخدام AI</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <KpiCard title="إجمالي التقييمات" value={kpiData.total.toLocaleString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-cyan-400"/>} />
                    <KpiCard title="متوسط التقييم" value={kpiData.avgRating} icon={<StarIcon className="w-8 h-8 text-amber-400"/>} />
                    <KpiCard title="تقييمات تم الرد عليها" value={kpiData.reviewsWithReply.toLocaleString()} icon={<ArrowTrendingUpIcon className="w-8 h-8 text-lime-400"/>} />
                </div>
                
                 <div className="mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">توزيع التقييمات</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={ratingDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155' }}/>
                            <Bar dataKey="value" name="عدد التقييمات" fill="#06b6d4" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input type="text" placeholder="بحث في التعليقات أو أسماء المستخدمين..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <select value={serviceFilter} onChange={e => setServiceFilter(Number(e.target.value))} className="w-full sm:w-56 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value={0}>كل الخدمات</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))} className="w-full sm:w-40 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value={0}>كل التقييمات</option>
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} نجوم</option>)}
                    </select>
                </div>

                <div className="space-y-6">
                    {filteredReviews.map(review => (
                        <div key={review.id} className="border-t border-slate-200 dark:border-slate-700 pt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <div className="flex items-center gap-4">
                                    <img src={review.avatar} alt={review.username} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{review.username} <span className="text-sm font-normal text-gray-500">على "{review.serviceName}"</span></p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                                        <Rating rating={review.rating} />
                                    </div>
                                </div>
                                {canManage && (
                                    <div className="flex items-center gap-1 self-end sm:self-center">
                                        <button onClick={() => handleOpenReplyModal(review)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900/50 rounded-md" title="الرد"><ChatBubbleLeftRightIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleOpenEditModal(review)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDeleteReview(review.serviceId, review.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-gray-700 dark:text-gray-300">{review.comment}</p>
                            {review.adminReply && (
                                <div className="mt-4 mr-10 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                    <p className="font-bold text-sm text-cyan-600 dark:text-cyan-400">رد المدير:</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.adminReply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredReviews.length === 0 && <p className="text-center py-8">لا توجد تقييمات تطابق البحث.</p>}
                </div>
            </div>

            {selectedReview && (
                <>
                    <Modal isOpen={isReplyModalOpen} onClose={() => setReplyModalOpen(false)} title={`الرد على تقييم ${selectedReview.username}`}>
                        <ReplyForm review={selectedReview} onClose={() => setReplyModalOpen(false)} onSave={(reply) => { handleReplyToReview(selectedReview.serviceId, selectedReview.id, reply); setReplyModalOpen(false); }} />
                    </Modal>
                    <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={`تعديل تقييم ${selectedReview.username}`}>
                        <EditReviewForm review={selectedReview} onClose={() => setEditModalOpen(false)} onSave={(comment) => { handleUpdateReview(selectedReview.serviceId, selectedReview.id, comment); setEditModalOpen(false); }} />
                    </Modal>
                </>
            )}
            <AnalysisModal 
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                isAnalyzing={isAnalyzing}
                analysisResult={analysisResult}
                error={analysisError}
            />
        </div>
    );
};

export default ReviewsPage;