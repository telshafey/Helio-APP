import React from 'react';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
}

export interface Activity {
  id: string;
  type: 'NEW_SERVICE' | 'EMERGENCY_REPORT' | 'NEWS_PUBLISHED' | 'NEW_PROPERTY';
  description: string;
  time: string;
  user?: {
    name: string;
    avatarUrl: string;
  };
}

export interface Alert {
  id: string;
  message: string;
  time: string;
  type: 'new_inquiry' | 'user_registered' | 'property_listed';
}

export interface Review {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  adminReply?: string;
  helpfulCount?: number;
}

export interface Service {
  id: number;
  subCategoryId: number; // Links to a sub-category
  name: string;
  images: string[];
  address: string;
  phone: string[];
  whatsapp: string[];
  about: string;
  rating: number; // This would typically be calculated
  reviews: Review[];
  facebookUrl?: string;
  instagramUrl?: string;
  locationUrl?: string; // Optional Google Maps link
  workingHours?: string; // Optional text for working hours
  isFavorite: boolean;
  views: number;
  creationDate: string;
}

export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string; // The name of the icon component
  subCategories: SubCategory[];
}

export interface News {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
  externalUrl?: string;
  views: number;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  externalUrl?: string;
  serviceId?: number; // Link to a service
  startDate: string;
  endDate: string;
}

export interface Advertisement {
  id: number;
  title: string;
  imageUrl: string;
  serviceId?: number;
  externalUrl?: string;
  startDate: string;
  endDate: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  images: string[];
  location: {
    address: string;
  };
  type: 'sale' | 'rent';
  price: number;
  contact: {
    name: string;
    phone: string;
  };
  amenities: string[];
  views: number;
  creationDate: string;
}

export interface EmergencyContact {
    id: number;
    title: string;
    number: string;
    type: 'city' | 'national';
}

export interface ServiceGuide {
  id: number;
  title: string;
  steps: string[];
  documents: string[];
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf';
}

export type UserStatus = 'active' | 'pending' | 'banned' | 'deletion_requested';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  status: UserStatus;
  joinDate: string;
}

// FIX: Added AdminUser type for admin panel authentication and roles.
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: 'مدير عام' | 'مسؤول ادارة الخدمات' | 'مسؤول العقارات' | 'مسؤول الاخبار والاعلانات والاشعارات' | 'مسؤول الباصات';
}

// FIX: Added AuditLog type for tracking admin actions.
export interface AuditLog {
    id: number;
    user: string;
    action: string;
    details: string;
    timestamp: string;
}


// Transportation Types
export interface Driver {
    id: number;
    name: string;
    phone: string;
    avatar: string;
}
export interface ScheduleDriver {
    name: string;
    phone: string;
}
export interface WeeklyScheduleItem {
    date: string; // YYYY-MM-DD format
    drivers: ScheduleDriver[];
}
export interface ExternalRoute {
    id: number;
    name: string;
    timings: string[];
    waitingPoint: string;
}
export interface Supervisor {
    name: string;
    phone: string;
}

// New Types for Public Page Content Management
export interface PolicySection {
  title: string;
  content: (string | { list: string[] })[]; // string is a paragraph, object is a list
}

export interface PolicyPageContent {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export interface FaqItem {
  q: string;
  a: string; // Storing as simple string for easier editing.
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export interface FaqPageContent {
  title: string;
  subtitle: string;
  categories: FaqCategory[];
}

export interface AboutPageContent {
  title: string;
  intro: string;
  vision: { title: string; text: string };
  mission: { title: string; text: string };
}

export interface HomePageFeature {
  title: string;
  description: string;
}

export interface HomePageContent {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: HomePageFeature[];
  infoLinksSectionTitle: string;
}

export interface BoardMember {
  name: string;
  title: string;
  email?: string;
  details: string[];
}

export interface AboutCityPageContent {
  city: {
    mainParagraphs: string[];
    planning: string;
    roads: string;
    utilities: string;
  };
  company: {
    about: string;
    vision: string;
    mission: string;
    data: { label: string; value: string }[];
  };
  board: BoardMember[];
}

export interface PublicPagesContent {
  home: HomePageContent;
  about: AboutPageContent;
  faq: FaqPageContent;
  privacy: PolicyPageContent;
  terms: PolicyPageContent;
  aboutCity: AboutCityPageContent;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface SearchResult {
  id: string; // e.g., 'service-1'
  type: 'خدمة' | 'عقار' | 'خبر' | 'مستخدم';
  title: string;
  subtitle?: string;
  link: string;
  icon: React.ReactNode;
}

// Community Forum Types
export type PostCategory = 'نقاش عام' | 'نقاش خاص' | 'سؤال' | 'حدث' | 'استطلاع رأي';

export interface Comment {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  content: string;
  date: string;
}

export interface PollOption {
  option: string;
  votes: number[]; // Array of user IDs who voted
}

export interface Post {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  title?: string;
  content: string;
  category: PostCategory;
  date: string;
  likes: number[]; // Array of user IDs who liked the post
  comments: Comment[];
  isPinned?: boolean;
  pollOptions?: PollOption[];
  targetAudience?: string; // For 'نقاش خاص'
}

// New Marketplace and Jobs Types
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface MarketplaceItem {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  contactPhone: string;
  status: ListingStatus;
  creationDate: string;
  expirationDate: string;
  rejectionReason?: string;
}

export interface JobPosting {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  type: 'دوام كامل' | 'دوام جزئي' | 'عقد' | 'تدريب';
  contactInfo: string;
  status: ListingStatus;
  creationDate: string;
  expirationDate: string;
  rejectionReason?: string;
}

// --- CONTEXT TYPES ---
export type Theme = 'light' | 'dark' | 'system';

export interface UIContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean; // Derived from theme and system preference
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  dismissToast: (id: number) => void;
}

// FIX: Added admin auth state and methods to the context type.
export interface AuthContextType {
  // Admin auth
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  // FIX: Corrected type for hasPermission to accept an array of roles.
  hasPermission: (roles: Array<AdminUser['role']>) => boolean;

  // Public user auth
  currentPublicUser: AppUser | null;
  isPublicAuthenticated: boolean;
  publicLogin: (email: string, password?: string) => boolean;
  publicLogout: () => void;
  register: (user: Omit<AppUser, 'id' | 'joinDate' | 'avatar' | 'status'>) => boolean;
  // FIX: updateProfile should not require password, status, etc.
  updateProfile: (user: Omit<AppUser, 'joinDate' | 'status' | 'password'>) => void;
}

export interface CommunityContextType {
  posts: Post[];
  addPost: (postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => void;
  addComment: (postId: number, commentData: Omit<Comment, 'id' | 'date' | 'userId' | 'username' | 'avatar'>) => void;
  toggleLikePost: (postId: number) => void;
  voteOnPoll: (postId: number, optionIndex: number) => void;
  deletePost: (postId: number) => void;
  deleteComment: (postId: number, commentId: number) => void;
  togglePinPost: (postId: number) => void;
  editPost: (postId: number, data: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments' | 'isPinned'>) => void;
}

// FIX: Added all missing state and handler methods to the context type.
export interface DataContextType {
  // Services & Categories
  categories: Category[];
  services: Service[];
  
  // Service methods
  handleSaveService: (serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => void;
  handleDeleteService: (serviceId: number) => void;
  handleToggleFavorite: (serviceId: number) => void;
  
  // Review methods
  handleToggleHelpfulReview: (serviceId: number, reviewId: number) => void;
  addReview: (serviceId: number, reviewData: Omit<Review, 'id' | 'date' | 'adminReply' | 'username' | 'avatar' | 'userId'>) => void;
  handleUpdateReview: (serviceId: number, reviewId: number, comment: string) => void;
  handleDeleteReview: (serviceId: number, reviewId: number) => void;
  handleReplyToReview: (serviceId: number, reviewId: number, reply: string) => void;

  // Properties
  properties: Property[];
  handleSaveProperty: (property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => void;
  handleDeleteProperty: (propertyId: number) => void;

  // Other Data
  news: News[];
  notifications: Notification[];
  advertisements: Advertisement[];
  emergencyContacts: EmergencyContact[];
  serviceGuides: ServiceGuide[];
  users: AppUser[];
  admins: AdminUser[];
  auditLogs: AuditLog[];
  transportation: {
      internalSupervisor: Supervisor;
      externalSupervisor: Supervisor;
      internalDrivers: Driver[];
      weeklySchedule: WeeklyScheduleItem[];
      externalRoutes: ExternalRoute[];
  };
  publicPagesContent: PublicPagesContent;
  marketplaceItems: MarketplaceItem[];
  jobPostings: JobPosting[];

  // User methods
  requestAccountDeletion: (userId: number) => void;
  // FIX: Corrected type for handleSaveUser to accept optional id.
  handleSaveUser: (userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => void;
  handleDeleteUser: (userId: number) => void;

  // Admin methods
  handleSaveAdmin: (adminData: Omit<AdminUser, 'id'> & { id?: number }) => void;
  handleDeleteAdmin: (adminId: number) => void;

  // Other entity methods
  handleSaveNews: (newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => void;
  handleDeleteNews: (newsId: number) => void;
  handleSaveNotification: (notification: Omit<Notification, 'id'> & { id?: number }) => void;
  handleDeleteNotification: (notificationId: number) => void;
  handleSaveAdvertisement: (ad: Omit<Advertisement, 'id'> & { id?: number }) => void;
  handleDeleteAdvertisement: (adId: number) => void;
  handleSaveEmergencyContact: (contact: Omit<EmergencyContact, 'id'> & { id?: number }) => void;
  handleDeleteEmergencyContact: (contactId: number) => void;
  handleSaveServiceGuide: (guide: Omit<ServiceGuide, 'id'> & { id?: number }) => void;
  handleDeleteServiceGuide: (guideId: number) => void;

  // Transportation methods
  handleSaveSupervisor: (type: 'internal' | 'external', supervisor: Supervisor) => void;
  handleSaveDriver: (driver: Omit<Driver, 'id'> & { id?: number }) => void;
  handleDeleteDriver: (driverId: number) => void;
  handleSaveRoute: (route: Omit<ExternalRoute, 'id'> & { id?: number }) => void;
  handleDeleteRoute: (routeId: number) => void;
  handleSaveSchedule: (schedule: WeeklyScheduleItem[]) => void;
  
  // Content Management methods
  handleUpdatePublicPageContent: <K extends keyof PublicPagesContent>(page: K, content: PublicPagesContent[K]) => void;

  // Marketplace methods
  handleSaveMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: number, duration: number }) => void;
  handleDeleteMarketplaceItem: (itemId: number) => void;
  handleUpdateMarketplaceItemStatus: (itemId: number, status: ListingStatus, rejectionReason?: string) => void;
  
  // Job methods
  handleSaveJobPosting: (job: Omit<JobPosting, 'id' | 'status' | 'creationDate' | 'expirationDate' | 'userId' | 'username' | 'avatar'> & { id?: number, duration: number }) => void;
  handleDeleteJobPosting: (jobId: number) => void;
  handleUpdateJobPostingStatus: (jobId: number, status: ListingStatus, rejectionReason?: string) => void;
}
