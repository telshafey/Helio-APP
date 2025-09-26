import React, { useState, useCallback, ReactNode } from 'react';
// FIX: Replaced deprecated useAppContext with useData from DataContext.
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, HomeIcon, InformationCircleIcon, QuestionMarkCircleIcon, BookOpenIcon, PlusIcon, TrashIcon, PencilSquareIcon, BuildingLibraryIcon } from '../components/common/Icons';
import type { HomePageContent, AboutPageContent, FaqPageContent, PolicyPageContent, PublicPagesContent, AboutCityPageContent, BoardMember } from '../types';

// Reusable Components
const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input type="text" value={value} onChange={onChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const TextareaField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, value, onChange, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} rows={rows} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const SaveButton: React.FC<{ onClick: () => void; isSaving: boolean }> = ({ onClick, isSaving }) => (
    <button onClick={onClick} disabled={isSaving} className="px-6 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600 disabled:bg-slate-400">
        {isSaving ? '...جاري الحفظ' : 'حفظ التغييرات'}
    </button>
);

// Form Components per Tab
const HomePageForm: React.FC<{ content: HomePageContent; onSave: (data: HomePageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (field: keyof HomePageContent, value: string) => setData(prev => ({ ...prev, [field]: value }));
    const handleFeatureChange = (index: number, field: keyof typeof data.features[0], value: string) => {
        const newFeatures = [...data.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setData(prev => ({ ...prev, features: newFeatures }));
    };

    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => setIsSaving(false), 1000); // Simulate save
    };
    
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى الصفحة الرئيسية</h3>
            <InputField label="العنوان الرئيسي (سطر 1)" value={data.heroTitleLine1} onChange={e => handleChange('heroTitleLine1', e.target.value)} />
            <InputField label="العنوان الرئيسي (سطر 2)" value={data.heroTitleLine2} onChange={e => handleChange('heroTitleLine2', e.target.value)} />
            <TextareaField label="النص التعريفي" value={data.heroSubtitle} onChange={e => handleChange('heroSubtitle', e.target.value)} />
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold mb-2">قسم المميزات</h3>
                <InputField label="عنوان القسم" value={data.featuresSectionTitle} onChange={e => handleChange('featuresSectionTitle', e.target.value)} />
                <TextareaField label="الوصف" value={data.featuresSectionSubtitle} onChange={e => handleChange('featuresSectionSubtitle', e.target.value)} />
                {data.features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-md mt-2 bg-slate-50 dark:bg-slate-700/50">
                        <InputField label={`الميزة ${index + 1}: العنوان`} value={feature.title} onChange={e => handleFeatureChange(index, 'title', e.target.value)} />
                        <TextareaField label={`الميزة ${index + 1}: الوصف`} value={feature.description} onChange={e => handleFeatureChange(index, 'description', e.target.value)} />
                    </div>
                ))}
            </div>
             <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                 <h3 className="text-lg font-semibold mb-2">قسم الروابط</h3>
                 <InputField label="عنوان القسم" value={data.infoLinksSectionTitle} onChange={e => handleChange('infoLinksSectionTitle', e.target.value)} />
            </div>
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const AboutPageForm: React.FC<{ content: AboutPageContent; onSave: (data: AboutPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "حول التطبيق"</h3>
            <InputField label="العنوان" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <TextareaField label="المقدمة" value={data.intro} onChange={e => setData(d => ({ ...d, intro: e.target.value }))} rows={5} />
            <InputField label="عنوان الرؤية" value={data.vision.title} onChange={e => setData(d => ({ ...d, vision: {...d.vision, title: e.target.value }}))} />
            {/* FIX: Added missing onChange handler to the TextareaField. */}
            <TextareaField label="نص الرؤية" value={data.vision.text} onChange={e => setData(d => ({ ...d, vision: { ...d.vision, text: e.target.value }}))} />
            <InputField label="عنوان المهمة" value={data.mission.title} onChange={e => setData(d => ({ ...d, mission: {...d.mission, title: e.target.value }}))} />
            <TextareaField label="نص المهمة" value={data.mission.text} onChange={e => setData(d => ({ ...d, mission: { ...d.mission, text: e.target.value } }))} />
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};