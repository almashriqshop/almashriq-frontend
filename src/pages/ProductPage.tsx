import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, Heart, Share2, Shield, Calendar, Compass, Layers, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, addToRecentlyViewed, recentlyViewed } = useCart();
  const { apiUrl, token, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [copiedShare, setCopiedShare] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/products/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        setActiveImage(data.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600');
        addToRecentlyViewed(slug || '');

        // Fetch related products (same category)
        const relRes = await fetch(`${apiUrl}/products?category=${data.category}&limit=3`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated(relData.products.filter((p: any) => p.id !== data.id));
        }
      } else {
        navigate('/404');
      }
    } catch (err) {
      console.error('Error fetching product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/products/${product.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.id,
          rating,
          title: reviewTitle,
          comment: reviewComment
        })
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setReviewTitle('');
        setReviewComment('');
        fetchProductData(); // Refresh reviews
      } else {
        const err = await response.json();
        setSubmitError(err.message || 'Failed to submit review.');
      }
    } catch (err) {
      setSubmitError('Network error submitting review.');
    }
  };

  if (loading) {
    return (
      <div className="pt-32 min-h-screen bg-luxury-black text-center text-luxury-gold flex flex-col justify-center items-center">
        <div className="w-10 h-10 border-t-2 border-luxury-gold animate-spin rounded-full mb-4" />
        <span className="text-xs uppercase tracking-widest">Entering Private Boutique...</span>
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="pt-28 min-h-screen bg-luxury-black pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Gallery & Zoom */}
          <div className="space-y-4">
            <div className="aspect-[3/4] w-full border border-white/5 bg-luxury-charcoal overflow-hidden relative group rounded-2xl">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Thumbnail catalog */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-14 h-16 sm:w-20 sm:h-24 border rounded-lg snap-start ${
                      activeImage === img ? 'border-luxury-gold' : 'border-white/5'
                    } overflow-hidden bg-luxury-charcoal`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & checkout CTA */}
          <div className="space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gold block mb-1">
                {product.category} COLLECTION
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-serif tracking-wide text-luxury-cream leading-tight">
                {product.name}
              </h1>
              
              {/* Rating review aggregate */}
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex text-luxury-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.average_rating || 4.5) ? 'fill-luxury-gold' : 'text-white/10'}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-luxury-cream/45 uppercase tracking-widest">
                  {product.ratings_count || 0} Customer Reviews
                </span>
              </div>
            </div>

            {/* Price display */}
            <p className="text-xl sm:text-2xl font-semibold text-luxury-gold">
              INR {parseFloat(product.price).toLocaleString('en-IN')}
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-luxury-cream/70 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Delivery Alert box */}
            <div className="border border-white/5 bg-luxury-charcoal/30 p-4 space-y-2 rounded-xl">
              <span className="text-[10px] text-luxury-gold uppercase tracking-wider block font-semibold">
                Delivery Restrictions
              </span>
              <p className="text-xs text-luxury-cream/60 uppercase tracking-widest leading-relaxed">
                Hand-delivered by official Al Mashriq representatives. Available exclusively inside municipal bounds of Hyderabad, India. Free same-day or next-day shipping.
              </p>
            </div>

            {/* Call to Actions */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:space-x-6">
                <span className="text-xs uppercase tracking-widest text-luxury-cream/50">Quantity</span>
                <div className="flex items-center border border-white/10 bg-luxury-charcoal rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 sm:py-2 text-luxury-cream/70 hover:text-luxury-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    className="px-4 py-3 sm:py-2 text-luxury-cream/70 hover:text-luxury-gold min-w-[44px] min-h-[44px] flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-luxury-cream/45">
                  {product.stock > 0 ? `${product.stock} pieces remaining` : 'Sold Out'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 btn-gold text-xs tracking-widest py-3.5 min-h-[44px] disabled:opacity-30 disabled:cursor-not-allowed uppercase font-semibold"
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart Bag'}
                </button>

                <div className="flex gap-3 sm:flex-shrink-0">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex-1 sm:flex-initial border border-white/10 px-5 py-3 rounded-full hover:border-luxury-gold transition-colors flex items-center justify-center min-h-[44px] ${
                      isWishlisted ? 'text-luxury-gold border-luxury-gold/50' : 'text-luxury-cream/70'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart size={16} className={isWishlisted ? 'fill-luxury-gold' : ''} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 sm:flex-initial border border-white/10 px-5 py-3 rounded-full hover:border-luxury-gold transition-colors text-luxury-cream/70 flex items-center justify-center min-h-[44px]"
                    title="Share fragrance"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
              {copiedShare && <p className="text-[10px] text-luxury-gold uppercase tracking-wider text-right">URL copied to clipboard.</p>}
            </div>
          </div>
        </div>

        {/* Detailed specs sections */}
          <div className="mt-16 sm:mt-24 border-t border-white/5 pt-10 sm:pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            
            {/* Olfactory profile */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl tracking-wide text-luxury-gold flex items-center">
                <Compass size={18} className="mr-2" />
                Olfactory Pyramid
              </h3>
              <div className="space-y-3 pt-2 text-xs uppercase tracking-widest">
                <div>
                  <span className="text-luxury-cream/40 block text-[9px] mb-0.5">Top Notes</span>
                  <span className="text-luxury-cream font-medium">{(product.top_notes || []).join(', ')}</span>
                </div>
                <div>
                  <span className="text-luxury-cream/40 block text-[9px] mb-0.5">Heart Notes</span>
                  <span className="text-luxury-cream font-medium">{(product.middle_notes || []).join(', ')}</span>
                </div>
                <div>
                  <span className="text-luxury-cream/40 block text-[9px] mb-0.5">Base Notes</span>
                  <span className="text-luxury-cream font-medium">{(product.base_notes || []).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Perfume Architecture specs */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl tracking-wide text-luxury-gold flex items-center">
                <Layers size={18} className="mr-2" />
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-widest pt-2">
                <div>
                  <span className="text-luxury-cream/45 block text-[9px] mb-0.5">Longevity</span>
                  <span className="text-luxury-cream font-medium">{product.longevity || 'Eternal'}</span>
                </div>
                <div>
                  <span className="text-luxury-cream/45 block text-[9px] mb-0.5">Projection</span>
                  <span className="text-luxury-cream font-medium">{product.projection || 'Strong'}</span>
                </div>
                <div>
                  <span className="text-luxury-cream/45 block text-[9px] mb-0.5">Season</span>
                  <span className="text-luxury-cream font-medium">{product.season || 'All Seasons'}</span>
                </div>
                <div>
                  <span className="text-luxury-cream/45 block text-[9px] mb-0.5">Occasion</span>
                  <span className="text-luxury-cream font-medium">{product.occasion || 'Evening Wear'}</span>
                </div>
                <div>
                  <span className="text-luxury-cream/45 block text-[9px] mb-0.5">Gender</span>
                  <span className="text-luxury-cream font-medium">{product.gender || 'Unisex'}</span>
                </div>
              </div>
            </div>

            {/* Fragrance Story column */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl tracking-wide text-luxury-gold flex items-center">
                <Shield size={18} className="mr-2" />
                The Story
              </h3>
              <p className="text-xs text-luxury-cream/65 leading-relaxed font-light italic pt-2">
                "{product.fragrance_story || product.description}"
              </p>
              <div>
                <span className="text-luxury-cream/45 uppercase tracking-widest text-[9px] block mt-4">Ingredients</span>
                <p className="text-[10px] text-luxury-cream/40 break-words font-sans mt-1">
                  {product.ingredients || 'Alcohol Denat., Fragrance (Parfum), Aqua (Water)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer reviews block */}
        <div className="mt-16 sm:mt-24 border-t border-white/5 pt-10 sm:pt-16 grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="font-serif text-2xl tracking-wide text-luxury-cream">Customer Reviews</h2>
            <div className="flex items-center space-x-4">
              <span className="text-5xl font-serif text-luxury-gold">{product.average_rating || '4.8'}</span>
              <div>
                <div className="flex text-luxury-gold mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.average_rating || 4.8) ? 'fill-luxury-gold' : 'text-white/10'}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-luxury-cream/45 uppercase tracking-widest">
                  Based on {product.ratings_count || 12} reviews
                </span>
              </div>
            </div>

            {/* Write a review form */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4 pt-6 border-t border-white/5">
                <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold">Write a Review</h3>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-luxury-cream/50 block mb-1">Rating</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRating(num)}
                        className="text-luxury-cream/30 hover:text-luxury-gold"
                      >
                        <Star size={16} className={num <= rating ? 'fill-luxury-gold text-luxury-gold' : ''} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Review Title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2 text-xs placeholder-luxury-cream/30 uppercase tracking-widest focus:border-luxury-gold focus:outline-none rounded-lg"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Describe your olfactory experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-luxury-charcoal border border-white/10 px-3 py-2 text-xs placeholder-luxury-cream/30 tracking-wider h-24 focus:border-luxury-gold focus:outline-none rounded-lg"
                    required
                  />
                </div>

                {submitError && <p className="text-[10px] text-red-400 uppercase tracking-wider">{submitError}</p>}
                {submitSuccess && <p className="text-[10px] text-green-400 uppercase tracking-wider flex items-center"><CheckCircle size={10} className="mr-1" /> Review submitted and approved!</p>}

                <button type="submit" className="btn-gold text-[10px] py-2 px-6">
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="pt-6 border-t border-white/5 text-center bg-luxury-charcoal/20 p-4 border border-dashed border-white/10 rounded-2xl">
                <p className="text-[10px] text-luxury-cream/45 uppercase tracking-widest mb-4">
                  Only logged-in customers who purchased this bottle may post a review.
                </p>
                <Link to="/login" className="text-xs uppercase tracking-widest text-luxury-gold hover:underline">
                  Login & Write Review
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6 max-h-[600px] overflow-y-auto sm:pr-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev: any) => (
                <div key={rev.id} className="border-b border-white/5 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-sm text-luxury-cream tracking-wide uppercase">
                        {rev.title}
                      </h4>
                      <span className="text-[9px] text-luxury-cream/40 uppercase tracking-widest">
                        By {rev.user_name || rev.userName} • {new Date(rev.created_at || rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-luxury-gold">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={10} className={idx < rev.rating ? 'fill-luxury-gold' : 'text-white/5'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-luxury-cream/65 leading-relaxed font-light mt-3">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex justify-center items-center text-center p-8 text-luxury-cream/35">
                <span className="text-xs uppercase tracking-widest">No reviews posted yet for this reserve.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
