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
            <TextareaField label="نص الرؤية" value={data.vision.text} onChange={e => setData(d => ({ ...d, vision: {...d.vision, text: e.target.value }}))} />
            <InputField label="عنوان المهمة" value={data.mission.title} onChange={e => setData(d => ({ ...d, mission: {...d.mission, title: e.target.value }}))} />
            <TextareaField label="نص المهمة" value={data.mission.text} onChange={e => setData(d => ({ ...d, mission: {...d.mission, text: e.target.value }}))} />
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const FaqPageForm: React.FC<{ content: FaqPageContent; onSave: (data: FaqPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);

    const handleCategoryChange = (catIndex: number, value: string) => {
        const newData = { ...data };
        newData.categories[catIndex].category = value;
        setData(newData);
    };
    const handleItemChange = (catIndex: number, itemIndex: number, field: 'q' | 'a', value: string) => {
        const newData = { ...data };
        newData.categories[catIndex].items[itemIndex][field] = value;
        setData(newData);
    };

    const addCategory = () => setData(prev => ({...prev, categories: [...prev.categories, { category: 'فئة جديدة', items: [{q: 'سؤال جديد', a: 'إجابة جديدة'}]}]}));
    const removeCategory = (catIndex: number) => setData(prev => ({...prev, categories: prev.categories.filter((_, i) => i !== catIndex)}));
    const addItem = (catIndex: number) => {
        const newData = { ...data };
        newData.categories[catIndex].items.push({q: 'سؤال جديد', a: 'إجابة جديدة'});
        setData(newData);
    };
    const removeItem = (catIndex: number, itemIndex: number) => {
        const newData = { ...data };
        newData.categories[catIndex].items = newData.categories[catIndex].items.filter((_, i) => i !== itemIndex);
        setData(newData);
    };
     const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "الأسئلة الشائعة"</h3>
            <InputField label="العنوان" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <InputField label="العنوان الفرعي" value={data.subtitle} onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))} />
            
            {data.categories.map((cat, catIndex) => (
                <div key={catIndex} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-4">
                    <div className="flex justify-between items-center">
                        <input type="text" value={cat.category} onChange={e => handleCategoryChange(catIndex, e.target.value)} className="w-full text-lg font-bold bg-transparent focus:outline-none focus:ring-0 border-b border-slate-300 dark:border-slate-600"/>
                        <button onClick={() => removeCategory(catIndex)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    {cat.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-3 border rounded-md bg-white dark:bg-slate-800">
                             <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium">السؤال #{itemIndex+1}</label>
                                <button onClick={() => removeItem(catIndex, itemIndex)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                             </div>
                            <TextareaField label="السؤال" value={item.q} onChange={e => handleItemChange(catIndex, itemIndex, 'q', e.target.value)} rows={2} />
                            <TextareaField label="الإجابة" value={item.a} onChange={e => handleItemChange(catIndex, itemIndex, 'a', e.target.value)} rows={4} />
                        </div>
                    ))}
                    <button onClick={() => addItem(catIndex)} className="flex items-center gap-2 text-sm text-cyan-600 font-semibold mt-2"><PlusIcon className="w-4 h-4"/>إضافة سؤال</button>
                </div>
            ))}
            <button onClick={addCategory} className="flex items-center gap-2 text-sm font-semibold p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-md hover:bg-cyan-200"><PlusIcon className="w-5 h-5"/>إضافة فئة جديدة</button>
             <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const PolicyPageForm: React.FC<{ content: PolicyPageContent; onSave: (data: PolicyPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);

    const parseContentToString = (content: (string | { list: string[] })[]): string => {
        return content.map(item => {
            if (typeof item === 'string') return item;
            return item.list.map(li => `- ${li}`).join('\n');
        }).join('\n\n');
    };

    const parseStringToContent = (text: string): (string | { list: string[] })[] => {
        const blocks = text.split('\n\n');
        return blocks.map(block => {
            const lines = block.split('\n');
            if (lines.every(line => line.startsWith('- '))) {
                return { list: lines.map(line => line.substring(2)) };
            }
            return block;
        }).filter(item => (typeof item === 'string' && item.trim() !== '') || (typeof item === 'object' && item.list.length > 0));
    };

    const handleSectionChange = (secIndex: number, field: 'title' | 'content', value: string) => {
        const newData = { ...data };
        if (field === 'title') {
            newData.sections[secIndex].title = value;
        } else {
            newData.sections[secIndex].content = parseStringToContent(value);
        }
        setData(newData);
    };
    
    const addSection = () => setData(prev => ({...prev, sections: [...prev.sections, { title: 'قسم جديد', content: ['نص جديد.']}]}));
    const removeSection = (secIndex: number) => setData(prev => ({...prev, sections: prev.sections.filter((_, i) => i !== secIndex)}));
    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "{data.title}"</h3>
            <InputField label="العنوان" value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <InputField label="آخر تحديث" value={data.lastUpdated} onChange={e => setData(d => ({ ...d, lastUpdated: e.target.value }))} />
            
            {data.sections.map((section, secIndex) => (
                <div key={secIndex} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-4">
                     <div className="flex justify-between items-center">
                        <input type="text" value={section.title} onChange={e => handleSectionChange(secIndex, 'title', e.target.value)} className="w-full text-lg font-bold bg-transparent focus:outline-none focus:ring-0 border-b border-slate-300 dark:border-slate-600"/>
                        <button onClick={() => removeSection(secIndex)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    <TextareaField 
                        label="المحتوى (استخدم '-' لبدء قائمة نقطية)"
                        value={parseContentToString(section.content)}
                        onChange={e => handleSectionChange(secIndex, 'content', e.target.value)}
                        rows={8}
                    />
                </div>
            ))}

            <button onClick={addSection} className="flex items-center gap-2 text-sm font-semibold p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-md hover:bg-cyan-200"><PlusIcon className="w-5 h-5"/>إضافة قسم</button>
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};

const AboutCityPageForm: React.FC<{ content: AboutCityPageContent; onSave: (data: AboutCityPageContent) => void }> = ({ content, onSave }) => {
    const [data, setData] = useState(content);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState<'city' | 'company' | 'board'>('city');

    const handleSaveClick = () => {
        setIsSaving(true);
        onSave(data);
        setTimeout(() => setIsSaving(false), 1000);
    };

    // FIX: Simplified generics and corrected array/object update logic to resolve type errors and runtime bugs.
    const handleNestedChange = (
        part: keyof AboutCityPageContent,
        field: string,
        value: any,
        index?: number
    ) => {
        setData(prev => {
            if (index !== undefined && Array.isArray(prev[part])) {
                const newArray = [...(prev[part] as any[])];
                if (typeof newArray[index] === 'object' && newArray[index] !== null) {
                    newArray[index] = { ...newArray[index], [field]: value };
                }
                return { ...prev, [part]: newArray };
            } else {
                const newObject = { ...(prev[part] as object), [field]: value };
                return { ...prev, [part]: newObject };
            }
        });
    };
    
    const handleBoardDetailChange = (memberIndex: number, detailIndex: number, value: string) => {
        setData(prev => {
            const newBoard = [...prev.board];
            newBoard[memberIndex].details[detailIndex] = value;
            return { ...prev, board: newBoard };
        });
    };
    const addBoardDetail = (memberIndex: number) => {
        setData(prev => {
            const newBoard = [...prev.board];
            newBoard[memberIndex].details.push('');
            return { ...prev, board: newBoard };
        });
    };
    const removeBoardDetail = (memberIndex: number, detailIndex: number) => {
        setData(prev => {
            const newBoard = [...prev.board];
            newBoard[memberIndex].details = newBoard[memberIndex].details.filter((_, i) => i !== detailIndex);
            return { ...prev, board: newBoard };
        });
    };

    const addBoardMember = () => {
        setData(prev => ({ ...prev, board: [...prev.board, { name: 'عضو جديد', title: 'منصب', details: ['تفاصيل جديدة'] }] }));
    };
    const removeBoardMember = (index: number) => {
        setData(prev => ({ ...prev, board: prev.board.filter((_, i) => i !== index) }));
    };


    const renderCityForm = () => (
        <div className="space-y-4">
            <TextareaField label="الفقرات الرئيسية (افصل بينها بسطر فارغ)" value={data.city.mainParagraphs.join('\n\n')} onChange={e => handleNestedChange('city', 'mainParagraphs', e.target.value.split('\n\n'))} rows={5}/>
            <TextareaField label="محتوى قسم التخطيط" value={data.city.planning} onChange={e => handleNestedChange('city', 'planning', e.target.value)} rows={5}/>
            <TextareaField label="محتوى قسم الطرق" value={data.city.roads} onChange={e => handleNestedChange('city', 'roads', e.target.value)} rows={4}/>
            <TextareaField label="محتوى قسم المرافق" value={data.city.utilities} onChange={e => handleNestedChange('city', 'utilities', e.target.value)} rows={6}/>
        </div>
    );
    const renderCompanyForm = () => (
        <div className="space-y-4">
             <TextareaField label="نبذة عن الشركة" value={data.company.about} onChange={e => handleNestedChange('company', 'about', e.target.value)} rows={5}/>
             <TextareaField label="الرؤية" value={data.company.vision} onChange={e => handleNestedChange('company', 'vision', e.target.value)} rows={3}/>
             <TextareaField label="الرسالة" value={data.company.mission} onChange={e => handleNestedChange('company', 'mission', e.target.value)} rows={4}/>
        </div>
    );
    const renderBoardForm = () => (
        <div className="space-y-4">
            {data.board.map((member, index) => (
                 <div key={index} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-700/50 space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="font-semibold">عضو مجلس الإدارة #{index+1}</h4>
                        <button onClick={() => removeBoardMember(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                    <InputField label="الاسم" value={member.name} onChange={e => handleNestedChange('board', 'name', e.target.value, index)} />
                    <InputField label="المنصب" value={member.title} onChange={e => handleNestedChange('board', 'title', e.target.value, index)} />
                    <InputField label="البريد الإلكتروني (اختياري)" value={member.email || ''} onChange={e => handleNestedChange('board', 'email', e.target.value, index)} />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التفاصيل</label>
                        {member.details.map((detail, dIndex) => (
                             <div key={dIndex} className="flex items-center gap-2 mb-2">
                                <input type="text" value={detail} onChange={e => handleBoardDetailChange(index, dIndex, e.target.value)} className="w-full bg-white dark:bg-slate-800 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"/>
                                <button type="button" onClick={() => removeBoardDetail(index, dIndex)} className="p-2 text-red-500"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={() => addBoardDetail(index)} className="text-sm text-cyan-600 flex items-center gap-1"><PlusIcon className="w-4 h-4"/>إضافة تفصيلة</button>
                    </div>
                 </div>
            ))}
            <button onClick={addBoardMember} className="flex items-center gap-2 text-sm font-semibold p-2 bg-cyan-100 dark:bg-cyan-900/50 rounded-md hover:bg-cyan-200"><PlusIcon className="w-5 h-5"/>إضافة عضو</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">محتوى صفحة "عن المدينة والشركة"</h3>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <button onClick={() => setActiveSubTab('city')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold ${activeSubTab === 'city' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>المدينة</button>
                <button onClick={() => setActiveSubTab('company')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold ${activeSubTab === 'company' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>الشركة</button>
                <button onClick={() => setActiveSubTab('board')} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold ${activeSubTab === 'board' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>مجلس الإدارة</button>
            </div>
            {activeSubTab === 'city' && renderCityForm()}
            {activeSubTab === 'company' && renderCompanyForm()}
            {activeSubTab === 'board' && renderBoardForm()}
            <div className="flex justify-end pt-4"><SaveButton onClick={handleSaveClick} isSaving={isSaving} /></div>
        </div>
    );
};


// Main Component
type Tab = 'home' | 'about' | 'faq' | 'privacy' | 'terms' | 'aboutCity';

const ContentManagementPage: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Replaced deprecated useAppContext with useData.
    const { publicPagesContent, handleUpdatePublicPageContent } = useData();
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [data, setData] = useState(publicPagesContent);

    const handleSave = useCallback(<K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => {
        const updatedData = { ...data, [page]: newContent };
        setData(updatedData);
        handleUpdatePublicPageContent(page, newContent);
    }, [data, handleUpdatePublicPageContent]);


    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomePageForm content={data.home} onSave={(d) => handleSave('home', d)} />;
            case 'about':
                return <AboutPageForm content={data.about} onSave={(d) => handleSave('about', d)} />;
            case 'faq':
                return <FaqPageForm content={data.faq} onSave={(d) => handleSave('faq', d)} />;
            case 'privacy':
                return <PolicyPageForm content={data.privacy} onSave={(d) => handleSave('privacy', d)} />;
            case 'terms':
                return <PolicyPageForm content={data.terms} onSave={(d) => handleSave('terms', d)} />;
            case 'aboutCity':
                return <AboutCityPageForm content={data.aboutCity} onSave={(d) => handleSave('aboutCity', d)} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tab: Tab; label: string; icon: ReactNode }> = ({ tab, label, icon }) => (
        <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-3 px-4 py-3 text-right rounded-lg transition-colors w-full ${activeTab === tab ? 'bg-cyan-500 text-white shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                <PencilSquareIcon className="w-8 h-8"/>
                إدارة محتوى الموقع العام
            </h1>
            
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                    <div className="space-y-2">
                        <TabButton tab="home" label="الصفحة الرئيسية" icon={<HomeIcon className="w-6 h-6" />} />
                        <TabButton tab="about" label="حول التطبيق" icon={<InformationCircleIcon className="w-6 h-6" />} />
                        <TabButton tab="aboutCity" label="عن المدينة والشركة" icon={<BuildingLibraryIcon className="w-6 h-6" />} />
                        <TabButton tab="faq" label="الأسئلة الشائعة" icon={<QuestionMarkCircleIcon className="w-6 h-6" />} />
                        <TabButton tab="privacy" label="سياسة الخصوصية" icon={<BookOpenIcon className="w-6 h-6" />} />
                        <TabButton tab="terms" label="شروط الاستخدام" icon={<BookOpenIcon className="w-6 h-6" />} />
                    </div>
                </div>
                <div className="lg:w-3/4">
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg min-h-[300px]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagementPage;