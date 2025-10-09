import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { mockPosts, mockMarketplaceItems, mockJobPostings, mockCircles, mockOffers, mockLostAndFoundItems } from '../data/mock-data';
import type { Post, Comment, CommunityContextType, MarketplaceItem, JobPosting, ListingStatus, Circle, ExclusiveOffer, LostAndFoundItem } from '../types';
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
    const { showToast, showConfirmation } = useUI();
    const [posts, setPosts] = useState<Post[]>(mockPosts);
    const [circles, setCircles] = useState<Circle[]>(mockCircles);
    const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(mockMarketplaceItems);
    const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);
    const [offers, setOffers] = useState<ExclusiveOffer[]>(mockOffers);
    const [lostAndFoundItems, setLostAndFoundItems] = useState<LostAndFoundItem[]>(mockLostAndFoundItems);

    // --- GENERIC HELPERS ---
    const genericSave = <T extends { id?: number }>(
        items: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        newItemData: Partial<T> & { id?: number },
        defaults: Partial<Omit<T, 'id'>>,
        itemName: string
    ) => {
        if (newItemData.id) {
            setItems(prev => prev.map(item => item.id === newItemData.id ? { ...item, ...newItemData } : item));
            showToast(`تم تحديث ${itemName}.`);
        } else {
            const newItem = {
                ...defaults,
                ...newItemData,
                id: Math.max(0, ...items.map(i => i.id ?? 0)) + 1,
            };
            setItems(prev => [newItem as T, ...prev]);
            showToast(`تمت إضافة ${itemName}.`);
        }
    };
    
    const genericDelete = <T extends {id: number}>(
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        itemId: number,
        itemType: string
    ) => {
        showConfirmation(
            `تأكيد حذف ${itemType}`,
            `هل أنت متأكد أنك تريد حذف هذا الـ ${itemType}؟ لا يمكن التراجع عن هذا الإجراء.`,
            () => {
                setItems(prev => prev.filter(item => item.id !== itemId));
                showToast(`تم حذف ${itemType}.`);
            }
        );
    };

    // --- POSTS ---
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
        genericDelete(setPosts, postId, 'المنشور');
    }, [genericDelete]);

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

    // --- MARKETPLACE ---
    const handleSaveMarketplaceItem = useCallback((item: Omit<MarketplaceItem, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: number, duration: number }) => {
        if (!currentPublicUser) {
            showToast('يجب تسجيل الدخول لإضافة إعلان.', 'error');
            return;
        }
        const creationDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(creationDate.getDate() + item.duration);

        const newItemData = {
            ...item,
            status: 'pending' as ListingStatus,
            creationDate: creationDate.toISOString().split('T')[0],
            expirationDate: expirationDate.toISOString().split('T')[0],
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
        };
        
        genericSave<MarketplaceItem>(marketplaceItems, setMarketplaceItems, newItemData, {}, 'الإعلان');
        showToast('تم إرسال إعلانك للمراجعة.');
    }, [marketplaceItems, currentPublicUser, showToast, genericSave]);

    const handleDeleteMarketplaceItem = useCallback((itemId: number) => {
        genericDelete(setMarketplaceItems, itemId, 'إعلان البيع');
    }, [genericDelete]);

    const handleUpdateMarketplaceItemStatus = useCallback((itemId: number, status: ListingStatus, rejectionReason?: string) => {
        setMarketplaceItems(prev => prev.map(item => item.id === itemId ? { ...item, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : item));
        showToast(`تم تحديث حالة الإعلان إلى "${status}".`);
    }, [showToast]);
    
    // --- JOBS ---
    const handleSaveJobPosting = useCallback((job: Omit<JobPosting, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: number, duration: number }) => {
        if (!currentPublicUser) {
            showToast('يجب تسجيل الدخول لإضافة وظيفة.', 'error');
            return;
        }
        const creationDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(creationDate.getDate() + job.duration);
        
        const newJobData = {
             ...job,
            status: 'pending' as ListingStatus,
            creationDate: creationDate.toISOString().split('T')[0],
            expirationDate: expirationDate.toISOString().split('T')[0],
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
        };
        
        genericSave<JobPosting>(jobPostings, setJobPostings, newJobData, {}, 'إعلان الوظيفة');
        showToast('تم إرسال إعلان الوظيفة للمراجعة.');
    }, [jobPostings, currentPublicUser, showToast, genericSave]);
    
    const handleDeleteJobPosting = useCallback((jobId: number) => {
        genericDelete(setJobPostings, jobId, 'إعلان الوظيفة');
    }, [genericDelete]);
    
    const handleUpdateJobPostingStatus = useCallback((jobId: number, status: ListingStatus, rejectionReason?: string) => {
        setJobPostings(prev => prev.map(job => job.id === jobId ? { ...job, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : job));
        showToast(`تم تحديث حالة الوظيفة إلى "${status}".`);
    }, [showToast]);

    // --- OFFERS ---
    const handleSaveOffer = useCallback((offer: Omit<ExclusiveOffer, 'id' | 'status' | 'creationDate' | 'rejectionReason'> & { id?: number }) => {
        const newOfferData = {
            ...offer,
            status: 'pending' as ListingStatus,
            creationDate: new Date().toISOString().split('T')[0],
        };
        genericSave<ExclusiveOffer>(offers, setOffers, newOfferData, {}, 'العرض');
        showToast('تم إرسال العرض للمراجعة.');
    }, [offers, showToast, genericSave]);
    
    const handleUpdateOfferStatus = useCallback((offerId: number, status: ListingStatus, rejectionReason?: string) => {
        setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : o));
        showToast(`تم تحديث حالة العرض إلى "${status}".`);
    }, [showToast]);

    const handleDeleteOffer = useCallback((offerId: number) => {
        genericDelete(setOffers, offerId, 'العرض');
    }, [genericDelete]);

    // --- LOST & FOUND ---
    const handleSaveLostAndFoundItem = useCallback((item: Omit<LostAndFoundItem, 'id' | 'status' | 'creationDate' | 'rejectionReason' | 'userId' | 'username' | 'avatar'> & { id?: number }) => {
        if (!currentPublicUser) {
            showToast('يجب تسجيل الدخول لإضافة بلاغ.', 'error');
            return;
        }
        const newItemData = {
            ...item,
            status: 'pending' as ListingStatus,
            creationDate: new Date().toISOString().split('T')[0],
            userId: currentPublicUser.id,
            username: currentPublicUser.name,
            avatar: currentPublicUser.avatar,
        };
        genericSave<LostAndFoundItem>(lostAndFoundItems, setLostAndFoundItems, newItemData, {}, 'البلاغ');
        showToast('تم إرسال بلاغك للمراجعة.');
    }, [lostAndFoundItems, currentPublicUser, showToast, genericSave]);
    
    const handleUpdateLostAndFoundItemStatus = useCallback((itemId: number, status: ListingStatus, rejectionReason?: string) => {
        setLostAndFoundItems(prev => prev.map(i => i.id === itemId ? { ...i, status, rejectionReason: status === 'rejected' ? rejectionReason : undefined } : i));
        showToast(`تم تحديث حالة البلاغ إلى "${status}".`);
    }, [showToast]);

    const handleDeleteLostAndFoundItem = useCallback((itemId: number) => {
        genericDelete(setLostAndFoundItems, itemId, 'البلاغ');
    }, [genericDelete]);

    const value: CommunityContextType = {
        posts,
        circles,
        marketplaceItems,
        jobPostings,
        offers,
        lostAndFoundItems,
        addPost,
        addComment,
        toggleLikePost,
        voteOnPoll,
        deletePost,
        deleteComment,
        togglePinPost,
        editPost,
        handleSaveMarketplaceItem, 
        handleDeleteMarketplaceItem, 
        handleUpdateMarketplaceItemStatus,
        handleSaveJobPosting, 
        handleDeleteJobPosting, 
        handleUpdateJobPostingStatus,
        handleSaveOffer,
        handleUpdateOfferStatus,
        handleDeleteOffer,
        handleSaveLostAndFoundItem,
        handleUpdateLostAndFoundItemStatus,
        handleDeleteLostAndFoundItem,
    };

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};