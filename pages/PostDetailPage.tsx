import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// FIX: Replaced deprecated useAppContext with useData from DataContext.
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import { ArrowLeftIcon, HandThumbUpIcon, ChatBubbleOvalLeftEllipsisIcon } from '../components/common/Icons';
import PageBanner from '../components/common/PageBanner';

const PostDetailPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    // FIX: Get data-related state from useData and auth state from useAuth.
    const { posts, toggleLikePost, addComment } = useData();
    const { currentPublicUser } = useAuth();
    const [newComment, setNewComment] = useState('');

    const post = useMemo(() => posts.find(p => p.id === Number(postId)), [posts, postId]);
    
    if (!post) {
        return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
    }

    const isLiked = currentPublicUser ? post.likes.includes(currentPublicUser.id) : false;

    const handleLikeClick = () => {
        if (!currentPublicUser) {
            navigate('/login-user');
            return;
        }
        toggleLikePost(post.id);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPublicUser) {
            navigate('/login-user');
            return;
        }
        if (newComment.trim()) {
            addComment(post.id, { content: newComment });
            setNewComment('');
        }
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-