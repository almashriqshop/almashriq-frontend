import { VALID_PINCODE_PREFIXES, BRAND } from './constants';

// ================= FORMAT HELPERS =================
export const formatPrice = (price: number | string): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `INR ${num.toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ================= VALIDATION HELPERS =================
export const isValidPincode = (pincode: string): boolean => {
  return VALID_PINCODE_PREFIXES.some((prefix) => pincode.startsWith(prefix));
};

export const isValidHyderabad = (city: string): boolean => {
  return city.toLowerCase() === BRAND.deliveryCity.toLowerCase();
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return /^[+]?[0-9\s\-()]{10,}$/.test(phone);
};

// ================= PRODUCT HELPERS =================
export const getProductImage = (images?: string[], _category?: string): string => {
  if (images && images.length > 0 && images[0]) {
    return images[0];
  }
  return `https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600`;
};

export const getCollectionImage = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'oudh':
      return 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800';
    case 'woody':
      return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800';
    case 'jasmine':
      return 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800';
    default:
      return 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800';
  }
};

// ================= ORDER HELPERS =================
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'text-green-400 bg-green-400/10 border-green-500/20';
    case 'processing':
      return 'text-blue-400 bg-blue-400/10 border-blue-500/20';
    case 'dispatched':
    case 'out_for_delivery':
      return 'text-luxury-gold bg-luxury-gold/10 border-luxury-gold/20';
    case 'cancelled':
      return 'text-red-400 bg-red-400/10 border-red-500/20';
    default:
      return 'text-luxury-cream/60 bg-white/5 border-white/10';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'dispatched':
    case 'out_for_delivery':
      return 'Out for Delivery';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  }
};

// ================= ARRAY HELPERS =================
export const parseOrderItems = (items: string | any[]): any[] => {
  if (typeof items === 'string') {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }
  return Array.isArray(items) ? items : [];
};

// ================= STRING HELPERS =================
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// ================= TIMER HELPERS =================
export const formatTimer = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ================= DEBOUNCE =================
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ================= SCROLL HELPERS =================
export const scrollToTop = (smooth = true): void => {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'instant',
  });
};

export const scrollToElement = (elementId: string, smooth = true): void => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
      block: 'start',
    });
  }
};
