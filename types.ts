import type { ReactNode } from 'react';

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

export type UserStatus = 'active' | 'pending' | 'banned';

export interface AppUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  status: UserStatus;
  joinDate: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'مسؤول العقارات' | 'مسؤول الاخبار والاعلانات والاشعارات' | 'مسؤول الباصات' | 'مسؤول ادارة الخدمات' | 'مدير عام';
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
    day: string;
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

export interface AuditLog {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
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

export interface PublicPagesContent {
  home: HomePageContent;
  about: AboutPageContent;
  faq: FaqPageContent;
  privacy: PolicyPageContent;
  terms: PolicyPageContent;
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
  icon: ReactNode;
}

// Community Forum Types
export type PostCategory = 'نقاش عام' | 'سؤال' | 'للبيع' | 'حدث';

export interface Comment {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  content: string;
  date: string;
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
}

export interface AppContextType {
  // Admin Auth
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
  
  // Public User Auth
  currentPublicUser: AppUser | null;
  isPublicAuthenticated: boolean;
  publicLogin: (email: string, password?: string) => boolean;
  publicLogout: () => void;
  register: (user: Omit<AppUser, 'id' | 'joinDate' | 'avatar' | 'status'>) => boolean;
  updateProfile: (user: Omit<AppUser, 'joinDate'>) => void;

  // Data
  categories: Category[];
  services: Service[];
  news: News[];
  notifications: Notification[];
  advertisements: Advertisement[];
  properties: Property[];
  emergencyContacts: EmergencyContact[];
  serviceGuides: ServiceGuide[];
  users: AppUser[];
  admins: AdminUser[];
  posts: Post[];
  transportation: {
      internalSupervisor: Supervisor;
      externalSupervisor: Supervisor;
      internalDrivers: Driver[];
      weeklySchedule: WeeklyScheduleItem[];
      externalRoutes: ExternalRoute[];
  };
  auditLogs: AuditLog[];
  publicPagesContent: PublicPagesContent;
  
  // Handlers
  logActivity: (action: string, details: string) => void;
  handleUpdateReview: (serviceId: number, reviewId: number, newComment: string) => void;
  handleDeleteReview: (serviceId: number, reviewId: number) => void;
  handleReplyToReview: (serviceId: number, reviewId: number, reply: string) => void;
  handleToggleHelpfulReview: (serviceId: number, reviewId: number) => void;
  addReview: (serviceId: number, reviewData: Omit<Review, 'id' | 'date' | 'adminReply' | 'username' | 'avatar' | 'userId'>) => void;
  handleSaveService: (service: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => void;
  handleDeleteService: (id: number) => void;
  handleToggleFavorite: (serviceId: number) => void;
  handleSaveNews: (newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => void;
  handleDeleteNews: (id: number) => void;
  handleSaveNotification: (notification: Omit<Notification, 'id'> & { id?: number }) => void;
  handleDeleteNotification: (id: number) => void;
  handleSaveAdvertisement: (ad: Omit<Advertisement, 'id'> & { id?: number }) => void;
  handleDeleteAdvertisement: (id: number) => void;
  handleSaveProperty: (property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => void;
  handleDeleteProperty: (id: number) => void;
  handleSaveEmergencyContact: (contact: Omit<EmergencyContact, 'id'> & { id?: number }) => void;
  handleDeleteEmergencyContact: (id: number) => void;
  handleSaveServiceGuide: (guide: Omit<ServiceGuide, 'id'> & { id?: number }) => void;
  handleDeleteServiceGuide: (id: number) => void;
  handleSaveUser: (user: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => void;
  handleDeleteUser: (id: number) => void;
  handleSaveAdmin: (admin: Omit<AdminUser, 'id'> & { id?: number }) => void;
  handleDeleteAdmin: (id: number) => void;
  handleSaveDriver: (driver: Omit<Driver, 'id'> & { id?: number }) => void;
  handleDeleteDriver: (id: number) => void;
  handleSaveRoute: (route: Omit<ExternalRoute, 'id'> & { id?: number }) => void;
  handleDeleteRoute: (id: number) => void;
  handleSaveSchedule: (schedule: WeeklyScheduleItem[]) => void;
  handleSaveSupervisor: (type: 'internal' | 'external', supervisor: Supervisor) => void;
  handleUpdatePublicPageContent: <K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => void;
  addPost: (postData: Omit<Post, 'id' | 'date' | 'userId' | 'username' | 'avatar' | 'likes' | 'comments'>) => void;
  deletePost: (postId: number) => void;
  addComment: (postId: number, commentData: Omit<Comment, 'id' | 'date' | 'userId' | 'username' | 'avatar'>) => void;
  toggleLikePost: (postId: number) => void;

  // UI
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type: 'success' | 'error') => void;
  dismissToast: (id: number) => void;
}