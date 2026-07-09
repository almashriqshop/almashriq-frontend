import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon | null) => void;
  discountAmount: number;
  wishlist: string[]; // List of product IDs
  toggleWishlist: (productId: string) => void;
  recentlyViewed: string[]; // List of product slugs
  addToRecentlyViewed: (slug: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('am_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('am_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('am_recent');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('am_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('am_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('am_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('am_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('am_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('am_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: any, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      const img = product.images?.[0] || '/logo.jpg';
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock || 99) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: parseFloat(product.price),
          quantity,
          image: img,
          category: product.category
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const addToRecentlyViewed = (slug: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 5); // Keep last 5 elements
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = cartSubtotal * (appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        discountAmount,
        wishlist,
        toggleWishlist,
        recentlyViewed,
        addToRecentlyViewed
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
