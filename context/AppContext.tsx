import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockPosts } from '../data/mock-data';
import type { Post, Comment, CommunityContextType } from '../types';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = (): CommunityContextType => {
    const context = useContext(CommunityContext);
    if (context === undefined) {
        throw new Error('useCommunity must be used within a CommunityProvider');
    }
    return context;
};

export const CommunityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentPublicUser } = useAuth();
    const { showToast } = useUI();
    const [posts, setPosts] = useState<Post[]>(mockPosts);

    const addPost = useCallback((postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => {
        if (!currentPublicUser) return;
        const newPost: Post = {
            id: Date.now(),
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
            date: new Date().toISOString(),
            likes: [],
            comments: [],
            isPinned: false,
            ...postData,
            pollOptions: postData.pollOptions ? postData.pollOptions.map(opt => ({ option: opt.option, votes: [] })) : undefined
        };
        setPosts(prev => [newPost, ...prev]);
        showToast('تم نشر منشورك بنجاح!');
    }, [currentPublicUser, showToast]);

    const addComment = useCallback((postId: number, commentData: Omit<Comment, 'id' | 'date' | 'userId' | 'username' | 'avatar'>) => {
        if (!currentPublicUser) return;
        const newComment: Comment = {
            id: Date.now(),
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
            date: new Date().toISOString(),
            ...commentData
        };
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p));
    }, [currentPublicUser]);

    const toggleLikePost = useCallback((postId: number) => {
        if (!currentPublicUser) return;
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(currentPublicUser.id);
                const newLikes = isLiked
                    ? p.likes.filter(id => id !== currentPublicUser.id)
                    : [...p.likes, currentPublicUser.id];
                return { ...p, likes: newLikes };
            }
            return p;
        }));
    }, [currentPublicUser]);
    
    const voteOnPoll = useCallback((postId: number, optionIndex: number) => {
        if (!currentPublicUser) return;
        const userId = currentPublicUser.id;
        
        setPosts(prev => prev.map(p => {
            if (p.id !== postId || !p.pollOptions) {
                return p;
            }

            const alreadyVotedForOption = p.pollOptions[optionIndex]?.votes.includes(userId);

            const newPollOptions = p.pollOptions.map((option, idx) => {
                const newVotes = option.votes.filter(vId => vId !== userId);
                if (idx === optionIndex && !alreadyVotedForOption) {
                    newVotes.push(userId);
                }
                return { ...option, votes: newVotes };
            });

            return { ...p, pollOptions: newPollOptions };
        }));
    }, [currentPublicUser]);

    const deletePost = useCallback((postId: number) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
        showToast('تم حذف المنشور.');
    }, [showToast]);

    const deleteComment = useCallback((postId: number, commentId: number) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p)));
        showToast('تم حذف التعليق.');
    }, [showToast]);

    const togglePinPost = useCallback((postId: number) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p)));
    }, []);

    const editPost = useCallback((postId: number, data: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => {
        setPosts(prev => prev.map(p => (p.id === postId ? { ...p, ...data } : p)));
        showToast('تم تعديل المنشور بنجاح.');
    }, [showToast]);

    const value: CommunityContextType = {
        posts,
        addPost,
        addComment,
        toggleLikePost,
        voteOnPoll,
        deletePost,
        deleteComment,
        togglePinPost,
        editPost,
    };

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};