// ================= API CONFIGURATION =================
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ================= BRAND CONSTANTS =================
export const BRAND = {
  name: 'Al Mashriq',
  tagline: 'Luxury Perfume House',
  description: 'An ultra-luxury fragrance house dedicated to the art of pure agarwood distilling, Mysore sandalwood curing, and absolute organic perfumery.',
  domain: 'https://almashriq.shop',
  email: 'concierge@almashriq.shop',
  phone: '+91 90000 12345',
  address: 'Jubilee Hills, Road No. 36, Hyderabad, TS, India',
  deliveryCity: 'Hyderabad',
  deliveryState: 'Telangana',
  deliveryPincodePrefix: '500',
} as const;

// ================= COLOR PALETTE =================
export const COLORS = {
  luxuryBlack: '#0A0A0A',
  luxuryCharcoal: '#121212',
  luxuryDarkGray: '#1A1A1A',
  luxuryGold: '#D4AF37',
  luxuryGoldLight: '#F3E5AB',
  luxuryGoldDark: '#C5A028',
  luxuryCream: '#F9F6F0',
} as const;

// ================= COLLECTION DATA =================
export const COLLECTIONS = [
  {
    title: 'Oudh Collection',
    slug: 'oudh',
    desc: 'Cambodi Agarwood & Warm Ambers',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    category: 'oudh' as const,
  },
  {
    title: 'Woody Collection',
    slug: 'woody',
    desc: 'Mysore Sandalwood & Earthy Vetiver',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    category: 'woody' as const,
  },
  {
    title: 'Jasmine Collection',
    slug: 'jasmine',
    desc: 'Nocturnal Blooms & absolute Nectars',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    category: 'jasmine' as const,
  },
] as const;

// ================= CATEGORY DATA =================
export const CATEGORIES = [
  { label: 'ALL PERFUMES', slug: '' },
  { label: 'OUDH', slug: 'oudh' },
  { label: 'WOODY', slug: 'woody' },
  { label: 'JASMINE', slug: 'jasmine' },
] as const;

// ================= SORT OPTIONS =================
export const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name_asc' },
] as const;

// ================= NAVIGATION LINKS =================
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Collections', path: '/collections' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
] as const;

// ================= FOOTER LINKS =================
export const FOOTER_LINKS = {
  vaults: [
    { label: 'Oudh Reserves', path: '/shop?category=oudh' },
    { label: 'Woody Sanctuary', path: '/shop?category=woody' },
    { label: 'Jasmine absolute', path: '/shop?category=jasmine' },
  ],
  concierge: [
    { label: 'The House story', path: '/about' },
    { label: 'General Inquiries', path: '/faq' },
    { label: 'Private Booking', path: '/contact' },
    { label: 'Journal Logs', path: '/blog' },
  ],
  policies: [
    { label: 'Discretion Act', path: '/privacy' },
    { label: 'Exchange Policy', path: '/refund' },
    { label: 'Deliveries Scope', path: '/terms' },
  ],
} as const;

// ================= FAQ DATA =================
export const FAQ_DATA = [
  {
    q: 'Why do you deliver only within Hyderabad?',
    a: 'To protect the delicate absolute ingredients of our perfumes from temperature spikes and courier mishandling, we use our own local brand representatives to hand-deliver reserves under controlled environments.',
  },
  {
    q: 'What is the concentration of your fragrances?',
    a: 'All Al Mashriq creations are bottled at Extrait de Parfum levels (25-30% pure oil concentrate), ensuring longevity that easily exceeds 8-12 hours.',
  },
  {
    q: 'Are your boxes suitable for gifting?',
    a: 'Yes. Every reserve bottle is nestled inside a black lacquered timber casket wrapped in thick raw silk, accompanied by an envelope containing notes certificates.',
  },
  {
    q: 'Can I apply cash on delivery?',
    a: 'Certainly. Cash on delivery and UPI scan-on-delivery are fully integrated at checkout. Both are free.',
  },
] as const;

// ================= COUPON DATA =================
export const COUPON_DATA = [
  { code: 'WELCOME10', reward: '10% OFF orders over 5k', details: 'Perfect for first reserve selections.' },
  { code: 'HYDOUD', reward: 'INR 1,500 OFF orders over 10k', details: 'Special discount celebrating our Hyderabad focus.' },
  { code: 'JASMINE5', reward: '5% OFF orders over 2k', details: 'Applicable to any perfume absolute.' },
] as const;

// ================= PLACEHOLDER IMAGES =================
export const PLACEHOLDER_IMAGES = {
  oudh: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=600',
  woody: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
  jasmine: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
  default: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
  hero: 'https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=1920',
  about: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
} as const;

// ================= TEST CREDENTIALS =================
export const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@almashriq.shop',
    password: 'almashriq786#',
  },
  customer: {
    email: 'customer@almashriq.shop',
    password: 'AlMashriqCustomer2026',
  },
} as const;

// ================= PINCODE VALIDATION =================
export const VALID_PINCODE_PREFIXES = ['500'] as const;
