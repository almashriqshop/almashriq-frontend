// ================= PRODUCT TYPES =================
export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'oudh' | 'woody' | 'jasmine';
  price: string | number;
  stock: number;
  description: string;
  fragrance_story?: string;
  fragranceStory?: string;
  top_notes?: string[];
  middle_notes?: string[];
  base_notes?: string[];
  longevity?: string;
  projection?: string;
  season?: string;
  occasion?: string;
  gender?: string;
  ingredients?: string;
  images?: string[];
  average_rating?: number;
  ratings_count?: number;
  reviews?: Review[];
  seo_title?: string;
  seo_title_seo?: string;
  seo_description?: string;
  created_at?: string;
  createdAt?: string;
}

// ================= USER TYPES =================
export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  pincode: string;
  state: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  fullName?: string;
  role: 'customer' | 'admin';
  addresses: UserAddress[];
  reward_points?: number;
  rewardPoints?: number;
}

// ================= CART TYPES =================
export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
}

// ================= ORDER TYPES =================
export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  order_number?: string;
  items: string | OrderItem[];
  totalAmount?: string;
  total_amount?: string;
  status: 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  createdAt?: string;
  created_at?: string;
  couponCode?: string;
  discountAmount?: number;
  email?: string;
  fullName?: string;
  contactNumber?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  pincode: string;
  state: string;
}

// ================= REVIEW TYPES =================
export interface Review {
  id: string;
  productId: string;
  userId?: string;
  rating: number;
  title: string;
  comment: string;
  user_name?: string;
  userName?: string;
  created_at?: string;
  createdAt?: string;
}

// ================= BLOG TYPES =================
export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  coverImage?: string;
  cover_image?: string;
  publishedAt?: string;
  published_at?: string;
  created_at?: string;
  createdAt?: string;
}

// ================= API TYPES =================
export interface PaginatedResponse<T> {
  products: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ApiError {
  message: string;
  error?: string;
}

// ================= COLLECTION TYPES =================
export interface Collection {
  title: string;
  slug: string;
  desc: string;
  image: string;
  category: 'oudh' | 'woody' | 'jasmine';
}

// ================= ADMIN TYPES =================
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: Product[];
  salesChart: { month: string; revenue: number }[];
}

// ================= SETTINGS TYPES =================
export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  maintenanceMode?: boolean;
  freeShippingThreshold?: number;
  [key: string]: any;
}
