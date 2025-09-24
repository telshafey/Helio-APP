import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeftIcon, TrashIcon, ChatBubbleOvalLeftEllipsisIcon } from '../components/common/Icons';
import EmptyState from '../components/common/EmptyState';

const CommunityManagementPage: React.FC = () => {
    const navigate = useNavigate();
    const { posts, deletePost } = useAppContext();

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-500 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5"/>
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8"/>
                    إدارة المجتمع
                </h1>

                 {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                             <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-3">المستخدم</th>
                                    <th className="px-6 py-3">المنشور</th>
                                    <th className="px-6 py-3">الفئة</th>
                                    <th className="px-6 py-3">التاريخ</th>
                                    <th className="px-6 py-3">الإجراءات</th>
                                </tr>
                             </thead>
                             <tbody>
                                 {posts.map(post => (
                                     <tr key={post.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={post.avatar} alt={post.username} className="w-10 h-10 rounded-full object-cover" />
                                                <span className="font-semibold">{post.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm">
                                            {post.title && <p className="font-bold truncate">{post.title}</p>}
                                            <p className="text-gray-500 dark:text-gray-400 truncate">{post.content}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">{post.category}</span>
                                        </td>
                                        <td className="px-6 py-4">{post.date}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deletePost(post.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف المنشور">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </td>
                                     </tr>
                                 ))}
                             </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        icon={<ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 text-slate-400" />}
                        title="لا توجد منشورات لإدارتها"
                        message="عندما يقوم المستخدمون بإضافة منشورات، ستظهر هنا لتتمكن من إدارتها."
                    />
                )}
            </div>
        </div>
    );
};

export default CommunityManagementPage;
