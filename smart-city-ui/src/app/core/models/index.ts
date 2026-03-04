// ============================================
// CORE TYPES & INTERFACES - Enterprise Grade
// ============================================

// User & Authentication Models
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  OFFICER = 'ROLE_OFFICER',
  CITIZEN = 'ROLE_CITIZEN'
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

// Complaint Models
export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  location: Location;
  images: string[];
  citizenId: string;
  citizenName: string;
  assignedTo?: string;
  assignedOfficerName?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export enum ComplaintCategory {
  INFRASTRUCTURE = 'Infrastructure',
  SANITATION = 'Sanitation',
  TRANSPORTATION = 'Transportation',
  UTILITIES = 'Utilities',
  SAFETY = 'Safety',
  ENVIRONMENT = 'Environment',
  OTHER = 'Other'
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected',
  ESCALATED = 'Escalated'
}

export enum ComplaintPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Dashboard Statistics
export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  todayComplaints: number;
  averageResolutionTime: number;
  satisfactionRate: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

// Notification Model
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  link?: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

// Base Filter Interface
export interface ComplaintFilter {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// State Management
export interface AppState {
  auth: AuthState;
  complaints: ComplaintsState;
  notifications: NotificationsState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ComplaintsState {
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  filters: ComplaintFilter;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}
