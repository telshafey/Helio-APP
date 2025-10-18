import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, BuildingLibraryIcon, BuildingOffice2Icon, UserGroupIcon, UserCircleIcon, 
    EnvelopeIcon, MapIcon, TruckIcon, WrenchScrewdriverIcon 
} from '../components/common/Icons';
import { useData } from '../context/DataContext';
import type { AboutCityPageContent, BoardMember } from '../types';

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }> = ({ isActive, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 font-semibold rounded-t-lg transition-colors focus:outline-none text-sm sm:text-base ${
            isActive
                ? 'bg-white dark:bg-slate-800 text-cyan-500 border-b-2 border-cyan-500'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
        }`}
    >
        {icon}
        {children}
    </button>
);

const CityContent: React.FC<{ content: AboutCityPageContent['city'] }> = ({ content }) => (
    <div className="prose prose-lg dark:prose-invert max-w-none text-right leading-relaxed space-y-8 animate-fade-in" style={{ direction: 'rtl' }}>
        <section>
            {content.mainParagraphs.map((p, i) => <p key={i}>{p}</p>)}
        </section>

        <section>
            <h2 className="flex items-center gap-3"><MapIcon className="w-7 h-7 text-cyan-500" />تخطيط المدينة</h2>
            <p>{content.planning}</p>
        </section>

        <section>
            <h2 className="flex items-center gap-3"><TruckIcon className="w-7 h-7 text-cyan-500" />الطرق والمواصلات</h2>
            <p>{content.roads}</p>
        </section>

        <section>
            <h2 className="flex items-center gap-3"><WrenchScrewdriverIcon className="w-7 h-7 text-cyan-500" />المرافق</h2>
            {content.utilities.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </section>
    </div>
);


const CompanyContent: React.FC<{ content: AboutCityPageContent['company'] }> = ({ content }) => (
    <div className="prose prose-lg dark:prose-invert max-w-none text-right leading-relaxed space-y-6 animate-fade-in" style={{ direction: 'rtl' }}>
        <section>
            <h2>نبذة عن الشركة</h2>
            <p>{content.about}</p>
        </section>
        <section>
            <h2>الرؤية والرسالة</h2>
            <h3>الرؤية:</h3>
            <p>{content.vision}</p>
            <h3>الرسالة:</h3>
            <p>{content.mission}</p>
        </section>
         <section>
            <h2>بيانات الشركة</h2>
            <ul>
                {content.data.map(item => (
                    <li key={item.label}><strong>{item.label}:</strong> {item.value}</li>
                ))}
            </ul>
        </section>
    </div>
);

const BoardContent: React.FC<{ members: BoardMember[] }> = ({ members }) => (
     <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <UserCircleIcon className="w-12 h-12 text-cyan-500 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-gray-800 dark:text-white">{member.name}</h3>
                            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">{member.title}</p>
                        </div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                        {member.details.map((detail, i) => <li key={i}>{detail}</li>)}
                    </ul>
                    {member.email && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                             <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-cyan-500">
                                <EnvelopeIcon className="w-4 h-4" />
                                <span>{member.email}</span>
                             </a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);


const AboutCityPage: React.FC = () => {
    const navigate = useNavigate();
    const { publicPagesContent } = useData();
    const content = publicPagesContent.aboutCity;
    const [activeTab, setActiveTab] = useState<'city' | 'company' | 'board'>('city');

    const renderContent = () => {
        switch (activeTab) {
            case 'city': return <CityContent content={content.city} />;
            case 'company': return <CompanyContent content={content.company} />;
            case 'board': return <BoardContent members={content.board} />;
            default: return null;
        }
    };

    return (
        <div className="animate-fade-in py-6 sm:py-10 px-4" dir="rtl">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>

                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white">عن المدينة والشركة</h1>
                    <p className="mt-2 text-md sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        كل ما تريد معرفته عن مدينة هليوبوليس الجديدة والشركة المطورة لها.
                    </p>
                </div>

                <div className="border-b border-gray-200 dark:border-slate-700 mb-8">
                    <nav className="-mb-px flex justify-center gap-2 sm:gap-4" aria-label="Tabs">
                        <TabButton isActive={activeTab === 'city'} onClick={() => setActiveTab('city')} icon={<BuildingLibraryIcon className="w-6 h-6"/>}>عن المدينة</TabButton>
                        <TabButton isActive={activeTab === 'company'} onClick={() => setActiveTab('company')} icon={<BuildingOffice2Icon className="w-6 h-6"/>}>عن الشركة</TabButton>
                        <TabButton isActive={activeTab === 'board'} onClick={() => setActiveTab('board')} icon={<UserGroupIcon className="w-6 h-6"/>}>مجلس الإدارة</TabButton>
                    </nav>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AboutCityPage;