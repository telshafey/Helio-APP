import React, { useState, useMemo } from 'react';
import { useCommunity } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageBanner from '../components/common/PageBanner';
import { BriefcaseIcon, PlusIcon, MagnifyingGlassIcon, MapPinIcon } from '../components/common/Icons';
import type { JobPosting } from '../types';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { InputField, TextareaField } from '../components/common/FormControls';

const AddJobForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { handleSaveJobPosting } = useCommunity();
    const [formData, setFormData] = useState({
        title: '', companyName: '', description: '', location: 'هليوبوليس الجديدة',
        type: 'دوام كامل' as JobPosting['type'], contactInfo: '', duration: 30,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSaveJobPosting({
            ...formData,
            type: formData.type as JobPosting['type'],
            duration: Number(formData.duration),
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="title" label="المسمى الوظيفي" value={formData.title} onChange={handleChange} required />
            <InputField name="companyName" label="اسم الشركة" value={formData.companyName} onChange={handleChange} required />
            <TextareaField name="description" label="وصف الوظيفة" value={formData.description} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="location" label="الموقع" value={formData.location} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium mb-1">نوع الدوام</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                        <option value="دوام كامل">دوام كامل</option>
                        <option value="دوام جزئي">دوام جزئي</option>
                        <option value="عقد">عقد</option>
                        <option value="تدريب">تدريب</option>
                    </select>
                </div>
            </div>
            <InputField name="contactInfo" label="معلومات التواصل (بريد إلكتروني أو هاتف)" value={formData.contactInfo} onChange={handleChange} required />
            <div>
                <label className="block text-sm font-medium mb-1">مدة عرض الإعلان</label>
                <select name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                    <option value={30}>30 يوم</option>
                    <option value={60}>60 يوم</option>
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">إرسال للمراجعة</button>
            </div>
        </form>
    );
};

const JobPostingCard: React.FC<{ job: JobPosting }> = ({ job }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-transparent hover:border-cyan-500/50 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{job.title}</h3>
                <p className="font-semibold">{job.companyName}</p>
            </div>
            <span className="bg-slate-100 dark:bg-slate-700 text-xs px-2 py-1 rounded-full">{job.type}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm my-3 h-16 overflow-hidden">{job.description}</p>
        <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {job.location}</p>
            <p className="font-mono text-xs">{new Date(job.creationDate).toLocaleDateString('ar-EG-u-nu-latn')}</p>
        </div>
    </div>
);

const PublicJobsPage: React.FC = () => {
    const { jobPostings } = useCommunity();
    const { isPublicAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const approvedJobs = useMemo(() => {
        return jobPostings
            .filter(job => job.status === 'approved')
            .filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    }, [jobPostings, searchTerm]);
    
    const handleAddJobClick = () => {
        if (!isPublicAuthenticated) {
            navigate('/login-user');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in" dir="rtl">
            <PageBanner title="الوظائف المتاحة" subtitle="ابحث عن فرصتك الوظيفية التالية داخل المدينة." icon={<BriefcaseIcon className="w-12 h-12 text-lime-500" />}/>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md sticky top-20 z-10">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input type="text" placeholder="ابحث عن وظيفة أو شركة..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none"/>
                    </div>
                    <button onClick={handleAddJobClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600">
                        <PlusIcon className="w-5 h-5"/>
                        <span>أضف وظيفة</span>
                    </button>
                </div>

                {approvedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {approvedJobs.map(job => <JobPostingCard key={job.id} job={job} />)}
                    </div>
                ) : (
                    <div className="mt-16">
                        <EmptyState icon={<BriefcaseIcon className="w-16 h-16 text-slate-400" />} title="لا توجد وظائف متاحة حالياً" message="سيتم عرض الوظائف هنا عند توفرها." />
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="إضافة إعلان وظيفة">
                <AddJobForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default PublicJobsPage;