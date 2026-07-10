import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, HelpCircle, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ================= ABOUT PAGE =================
export const About: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 max-w-5xl mx-auto px-6 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">OUR ESSENCE</span>
        <h1 className="text-3xl sm:text-5xl font-serif text-luxury-cream">The House of Al Mashriq</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/45 max-w-md mx-auto">Founded on authenticity and absolute luxury perfumery standards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800" alt="" className="border border-white/5 bg-luxury-charcoal aspect-[4/5] object-cover rounded-2xl" />
        <div className="space-y-6 text-sm text-luxury-cream/75 leading-relaxed font-light">
          <h2 className="font-serif text-2xl text-luxury-gold uppercase tracking-wide">The Legacy</h2>
          <p>
            Al Mashriq began as a family-owned apothecary distilling pure botanical oils. Guided by a lineage of attar masters, we set out to create perfumes that reject the mass-produced synthetic trends of today, opting instead for aged extracts.
          </p>
          <p>
            Each bottle is handcrafted, from the aging of Cambodian agarwood to the hand-extraction of white jasmine absolute blossoms. We blend and bottle in limited quantities, making every reserve highly collectible.
          </p>
          <p className="border-l border-luxury-gold pl-4 italic text-luxury-cream/90 font-serif">
            "We do not construct scents. We distill stories of the shifting desert wind, ancient temple resins, and dew-covered gardens."
          </p>
        </div>
      </div>
    </div>
  );
};

// ================= CONTACT PAGE =================
export const Contact: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 max-w-5xl mx-auto px-6 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">CONCIERGE</span>
        <h1 className="text-3xl sm:text-5xl font-serif text-luxury-cream">Connect With Us</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/45">Our customer support agents are ready to assist you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Contact details */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl text-luxury-cream uppercase">Al Mashriq House</h2>
          <p className="text-xs text-luxury-cream/60 leading-relaxed uppercase tracking-widest font-light">
            We deliver premium perfumes all over India, ensuring secure and tracked shipping to your doorstep.
          </p>
          
          <div className="space-y-4 text-xs uppercase tracking-widest text-luxury-cream/80">
            <div className="flex items-center space-x-3">
              <MapPin className="text-luxury-gold" size={16} />
              <span>Jubilee Hills, Road No. 36, Hyderabad, TS, India</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-luxury-gold" size={16} />
              <span>+91 90000 12345 (Concierge Line)</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-luxury-gold" size={16} />
              <span>concierge@almashriq.shop</span>
            </div>
          </div>
        </div>

        {/* Message form */}
        <div className="bg-luxury-charcoal/30 border border-white/5 p-8 rounded-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <ShieldCheck className="text-luxury-gold mx-auto" size={32} />
              <h3 className="font-serif text-lg text-luxury-cream uppercase">Message Received</h3>
              <p className="text-[10px] text-luxury-cream/50 uppercase tracking-widest leading-relaxed">Our concierge will contact you within 12 hours.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-4">Send a Message</h3>
              <div className="space-y-1">
                <input type="text" placeholder="Full Name" className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-xs placeholder-luxury-cream/30 uppercase focus:border-luxury-gold focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <input type="email" placeholder="Email Address" className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-xs placeholder-luxury-cream/30 focus:border-luxury-gold focus:outline-none" required />
              </div>
              <div className="space-y-1">
                <textarea placeholder="Message Details..." className="w-full bg-luxury-black border border-white/10 px-3 py-2 text-xs placeholder-luxury-cream/30 h-28 focus:border-luxury-gold focus:outline-none" required />
              </div>
              <button type="submit" className="w-full btn-gold text-[10px] py-2.5">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= COLLECTIONS PAGE =================
export const Collections: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const list = [
    {
      title: 'Oudh Private Reserves',
      slug: 'oudh',
      desc: 'Formulated around high-strength Cambodian and Indian agarwood. Rich, smoky, sweet, and animalic.',
      image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Woody Sanctuary',
      slug: 'woody',
      desc: 'Earthy Haitian vetiver, creamy Mysore sandalwood, and dry polished cedar wood chips.',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'Jasmine Absolute',
      slug: 'jasmine',
      desc: 'Blooming jasmine grandiflorum and sambac, sweetened by nectars and backed by skin musks.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 max-w-5xl mx-auto px-6 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">THE COLLECTIONS</span>
        <h1 className="text-3xl sm:text-5xl font-serif text-luxury-cream">Olfactory Families</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/45">Bespoke fragrance groups cataloged by base oil.</p>
      </div>

      <div className="space-y-12">
        {list.map((coll, idx) => (
          <div key={idx} className="border border-white/5 bg-luxury-charcoal/20 p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-2xl">
            <img src={coll.image} alt="" className="md:col-span-4 w-full h-48 object-cover border border-white/5 rounded-xl" />
            <div className="md:col-span-8 space-y-4">
              <h3 className="font-serif text-xl text-luxury-gold uppercase tracking-wide">{coll.title}</h3>
              <p className="text-xs text-luxury-cream/70 leading-relaxed font-light uppercase tracking-wider">{coll.desc}</p>
              <button
                onClick={() => navigate(`/shop?category=${coll.slug}`)}
                className="btn-gold text-[10px] py-2 px-6"
              >
                Browse Collection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= BLOG INDEX PAGE =================
export const Blog: React.FC = () => {
  const { apiUrl } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${apiUrl}/blogs`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchBlogs();
  }, [apiUrl]);

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 max-w-5xl mx-auto px-6 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">EDITORIALS</span>
        <h1 className="text-3xl sm:text-5xl font-serif text-luxury-cream">The Al Mashriq Journal</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/45">Private logs on fragrance selection, notes layering, and perfume histories.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-gold">Loading journal articles...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-xs uppercase tracking-widest text-luxury-cream/40">No entries written yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="border border-white/5 bg-luxury-charcoal/20 p-6 space-y-4 rounded-2xl">
              <img src={post.coverImage || post.cover_image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400'} alt="" className="w-full h-48 object-cover border border-white/5 bg-luxury-black rounded-xl" />
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold block">By {post.author} • {new Date(post.publishedAt || post.published_at).toLocaleDateString()}</span>
              <h3 className="font-serif text-lg text-luxury-cream uppercase line-clamp-1">{post.title}</h3>
              <p className="text-xs text-luxury-cream/60 leading-relaxed line-clamp-3 uppercase tracking-wider">{post.summary}</p>
              <div className="pt-2">
                <button onClick={() => alert(post.content)} className="text-[10px] uppercase tracking-widest text-luxury-gold hover:underline flex items-center space-x-1 font-semibold">
                  <span>Read Article</span>
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================= FAQ PAGE =================
export const FAQ: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const faqs = [
    { q: 'How do you ship your perfumes across India?', a: 'We ship all our bespoke reserves in temperature-controlled, shock-absorbent luxury packaging via expedited, tracked domestic shipping to ensure they reach you in pristine condition.' },
    { q: 'What is the concentration of your fragrances?', a: 'All Al Mashriq creations are bottled at Extrait de Parfum levels (25-30% pure oil concentrate), ensuring longevity that easily exceeds 8-12 hours.' },
    { q: 'Are your boxes suitable for gifting?', a: 'Yes. Every reserve bottle is nestled inside a black lacquered timber casket wrapped in thick raw silk, accompanied by an envelope containing notes certificates.' },
    { q: 'Can I apply cash on delivery?', a: 'Certainly. Cash on delivery and UPI scan-on-delivery are fully integrated at checkout. Both are free.' }
  ];

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 max-w-3xl mx-auto px-6 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gold font-semibold">FAQ</span>
        <h1 className="text-3xl sm:text-5xl font-serif text-luxury-cream">General Inquiries</h1>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-white/5 p-6 bg-luxury-charcoal/20 space-y-2 rounded-2xl">
            <h3 className="font-serif text-sm text-luxury-gold uppercase flex items-start">
              <HelpCircle size={14} className="mr-2 mt-0.5 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-luxury-cream/70 leading-relaxed font-light pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ================= NOT FOUND (404) PAGE =================
export const NotFound: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 flex items-center justify-center text-center">
      <div className="space-y-6 px-6">
        <Compass className="text-luxury-gold mx-auto animate-spin" size={40} />
        <h1 className="font-serif text-5xl text-luxury-cream">404</h1>
        <p className="text-xs uppercase tracking-widest text-luxury-cream/45 max-w-sm mx-auto">
          The private reserve you searched for does not exist in our vaults.
        </p>
        <div className="pt-4">
          <Link to="/shop" className="btn-gold text-[10px] py-2.5">
            Browse Boutique
          </Link>
        </div>
      </div>
    </div>
  );
};

// ================= LEGAL TEMPLATE PAGES =================
export const LegalPages: React.FC<{ type: 'privacy' | 'refund' | 'terms' }> = ({ type }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: 'The guild respects customer discretion. All logs regarding user profiles, address history, and transactions are encrypted using secure protocols and are never sold or shared with external analytics brokers.'
        };
      case 'refund':
        return {
          title: 'Refunds & Vault Exchanges',
          content: 'Due to the sanitary and bespoke nature of luxury fragrances, we do not accept returns or refunds once a perfume seal has been opened. We offer complementary decant samples with every order so you can test before breaking the seal.'
        };
      default:
        return {
          title: 'Terms of Service',
          content: 'By placing an order on almashriq.shop, you verify that your delivery location is a valid shipping address within India. We ship to all major cities and states across the country.'
        };
    }
  };

  const data = getContent();

  return (
    <div className="pt-24 min-h-screen bg-luxury-black pb-24 max-w-2xl mx-auto px-6 space-y-12">
      <h1 className="font-serif text-3xl text-luxury-cream border-b border-white/5 pb-4 uppercase tracking-wide">{data.title}</h1>
      <p className="text-xs text-luxury-cream/70 leading-relaxed font-light uppercase tracking-widest">
        {data.content}
      </p>
    </div>
  );
};
