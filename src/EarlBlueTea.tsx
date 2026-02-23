import { useState, useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Tea {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price: number;
  color: string;
  emoji: string;
  origin: string;
  caffeine: string;
}

interface CartItem extends Tea {
  quantity: number;
}

interface Config {
  brand_name: string;
  hero_title: string;
  hero_subtitle: string;
  cta_button_text: string;
  background_color: string;
  primary_color: string;
  text_color: string;
  accent_color: string;
  card_color: string;
  font_family: string;
  font_size: number;
}

interface EarlBlueTeaProps {
  config?: Partial<Config>;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const teas: Tea[] = [
  { id: 1, name: "Earl Grey Classic", tagline: "Timeless Elegance", description: "Our signature bergamot-infused black tea with a citrusy aroma.", price: 18, color: "#1e40af", emoji: "🫖", origin: "Sri Lanka", caffeine: "Medium" },
  { id: 2, name: "Jade Dragon", tagline: "Serene & Smooth", description: "Premium green tea with delicate floral notes and a refreshing finish.", price: 22, color: "#16a34a", emoji: "🍵", origin: "China", caffeine: "Low" },
  { id: 3, name: "Golden Sunrise", tagline: "Bright & Bold", description: "Energizing breakfast blend with malty undertones.", price: 16, color: "#f59e0b", emoji: "☀️", origin: "India", caffeine: "High" },
  { id: 4, name: "Midnight Chai", tagline: "Spiced & Warming", description: "Rich masala chai with cinnamon, cardamom, and ginger.", price: 19, color: "#7c2d12", emoji: "🌙", origin: "India", caffeine: "Medium" },
  { id: 5, name: "Jasmine Dreams", tagline: "Floral & Fragrant", description: "Delicate jasmine pearls that unfurl into aromatic bliss.", price: 24, color: "#ec4899", emoji: "🌸", origin: "China", caffeine: "Low" },
  { id: 6, name: "Arctic Mint", tagline: "Cool & Refreshing", description: "Invigorating peppermint blend perfect for any time.", price: 14, color: "#06b6d4", emoji: "❄️", origin: "Morocco", caffeine: "None" },
  { id: 7, name: "Berry Blush", tagline: "Sweet & Fruity", description: "Vibrant hibiscus with mixed berries and rose petals.", price: 17, color: "#dc2626", emoji: "🍓", origin: "Kenya", caffeine: "None" },
  { id: 8, name: "Smoky Lapsang", tagline: "Bold & Distinctive", description: "Pine-smoked black tea with a campfire mystique.", price: 21, color: "#4b5563", emoji: "🔥", origin: "China", caffeine: "Medium" },
];

const defaultConfig: Config = {
  brand_name: "EarlBlue Tea",
  hero_title: "Discover Your Perfect Brew",
  hero_subtitle: "Handcrafted teas from around the world, blended with passion and delivered fresh to your doorstep.",
  cta_button_text: "Shop All Teas",
  background_color: "#f0f9ff",
  primary_color: "#1e40af",
  text_color: "#334155",
  accent_color: "#3b82f6",
  card_color: "#ffffff",
  font_family: "Playfair Display",
  font_size: 16,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "240, 249, 255";
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TeaCardProps {
  tea: Tea;
  onOpen: (id: number) => void;
  onAddToCart: (id: number) => void;
  index: number;
}

function TeaCard({ tea, onOpen, onAddToCart, index }: TeaCardProps) {
  return (
    <div
      className="tea-card rounded-2xl overflow-hidden cursor-pointer shadow-lg"
      style={{ background: "#ffffff", animationDelay: `${index * 0.1}s` }}
      onClick={() => onOpen(tea.id)}
    >
      <div
        className="relative h-48 flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${tea.color}15, ${tea.color}30)` }}
      >
        <span className="tea-image text-7xl">{tea.emoji}</span>
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: tea.color, color: "white" }}
        >
          ${tea.price}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: tea.color }}>
          {tea.tagline}
        </p>
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: "#0f172a" }}>
          {tea.name}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "#64748b" }}>
          {tea.description}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(tea.id); }}
          className="w-full py-2.5 rounded-full font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: tea.color, color: "white" }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

interface TeaModalProps {
  tea: Tea | null;
  onClose: () => void;
  onAddToCart: (id: number) => void;
}

function TeaModal({ tea, onClose, onAddToCart }: TeaModalProps) {
  if (!tea) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      style={{ background: "rgba(15, 23, 42, 0.8)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-3xl max-w-lg w-full max-h-[90%] overflow-auto shadow-2xl"
        style={{ background: "#ffffff" }}
      >
        <div className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            style={{ color: "#64748b" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative h-56 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: `linear-gradient(135deg, ${tea.color}20, ${tea.color}40)` }}
          >
            <span className="text-8xl">{tea.emoji}</span>
          </div>
          <p className="text-sm font-semibold tracking-wider uppercase mb-2" style={{ color: tea.color }}>
            {tea.tagline}
          </p>
          <h3 className="font-display text-3xl font-bold mb-4" style={{ color: "#0f172a" }}>
            {tea.name}
          </h3>
          <p className="text-base mb-6" style={{ color: "#64748b" }}>{tea.description}</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 rounded-xl" style={{ background: "#f1f5f9" }}>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>Origin</p>
              <p className="font-semibold text-sm" style={{ color: "#334155" }}>{tea.origin}</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "#f1f5f9" }}>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>Caffeine</p>
              <p className="font-semibold text-sm" style={{ color: "#334155" }}>{tea.caffeine}</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "#f1f5f9" }}>
              <p className="text-xs mb-1" style={{ color: "#64748b" }}>Price</p>
              <p className="font-semibold text-sm" style={{ color: "#334155" }}>${tea.price}</p>
            </div>
          </div>
          <button
            onClick={() => { onAddToCart(tea.id); onClose(); }}
            className="w-full py-4 rounded-full font-semibold text-lg transition-all hover:opacity-90"
            style={{ background: tea.color, color: "white" }}
          >
            Add to Cart - ${tea.price}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}

function CartItemRow({ item, onRemove, onUpdateQuantity }: CartItemRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "#f8fafc" }}>
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${item.color}20` }}
      >
        <span className="text-2xl">{item.emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate" style={{ color: "#0f172a" }}>{item.name}</h4>
        <p className="text-sm" style={{ color: "#64748b" }}>${item.price} each</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, -1)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#e2e8f0", color: "#334155" }}
        >
          −
        </button>
        <span className="w-8 text-center font-semibold" style={{ color: "#334155" }}>{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#e2e8f0", color: "#334155" }}
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 rounded-full hover:bg-red-100 transition-colors"
        style={{ color: "#ef4444" }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EarlBlueTea({ config: configProp }: EarlBlueTeaProps) {
  const cfg: Config = { ...defaultConfig, ...configProp };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentTea, setCurrentTea] = useState<Tea | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll listener for navbar shadow
  useEffect(() => {
    const handleScroll = () => setNavShadow(window.pageYOffset > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart helpers
  function addToCart(teaId: number) {
    const tea = teas.find((t) => t.id === teaId)!;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === teaId);
      if (existing) {
        return prev.map((i) => (i.id === teaId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...tea, quantity: 1 }];
    });
    showToast(`${tea.name} added to cart!`);
  }

  function removeFromCart(teaId: number) {
    setCart((prev) => prev.filter((i) => i.id !== teaId));
  }

  function updateQuantity(teaId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === teaId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function showToast(message: string) {
    setToast({ visible: true, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const bgGradient = `linear-gradient(180deg, ${cfg.background_color} 0%, ${adjustColor(cfg.background_color, -10)} 50%, ${cfg.background_color} 100%)`;
  const navBg = `rgba(${hexToRgb(cfg.background_color)}, 0.9)`;

  return (
    <>
      {/* Fonts + Styles */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .font-display { font-family: '${cfg.font_family}', Georgia, serif; }
        .font-body { font-family: 'DM Sans', system-ui, sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes steam {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.6; }
          100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(30, 64, 175, 0.3); }
          50% { box-shadow: 0 0 40px rgba(30, 64, 175, 0.6); }
        }
        .float-animation { animation: float 6s ease-in-out infinite; }
        .steam { animation: steam 3s ease-out infinite; }
        .slide-in { animation: slideIn 0.6s ease-out forwards; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .tea-card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .tea-card:hover { transform: translateY(-12px) scale(1.02); }
        .tea-card:hover .tea-image { transform: scale(1.1) rotate(5deg); }
        .tea-image { transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: currentColor; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .gradient-text { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .blob { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        .modal-overlay { backdrop-filter: blur(8px); }
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { width: 100%; overflow-x: hidden; margin: 0; padding: 0; }
      `}</style>

      <div className="w-full min-h-screen overflow-x-hidden font-body" style={{ background: bgGradient }}>

        {/* Navigation */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{ background: navBg, backdropFilter: "blur(12px)", boxShadow: navShadow ? "0 4px 20px rgba(0,0,0,0.1)" : "none" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: cfg.primary_color }}>
                  <svg className="w-6 h-6" fill="none" stroke="#f0f9ff" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    <path strokeLinecap="round" d="M8 14c0 2 1.5 4 4 4s4-2 4-4" />
                  </svg>
                </div>
                <span className="font-display text-2xl font-bold" style={{ color: cfg.primary_color }}>{cfg.brand_name}</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="#flavours" className="nav-link font-medium" style={{ color: cfg.text_color }}>Flavours</a>
                <a href="#about" className="nav-link font-medium" style={{ color: cfg.text_color }}>Our Story</a>
                <a href="#order" className="nav-link font-medium" style={{ color: cfg.text_color }}>Order</a>
                <button className="px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105" style={{ background: cfg.primary_color, color: "#f0f9ff" }}>
                  Shop Now
                </button>
              </div>
              <button className="md:hidden p-2" style={{ color: cfg.primary_color }} onClick={() => setMobileMenuOpen(true)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40" style={{ background: "rgba(240, 249, 255, 0.98)" }}>
            <div className="flex flex-col items-center justify-center h-full gap-8">
              <a href="#flavours" className="text-2xl font-display font-semibold" style={{ color: cfg.primary_color }} onClick={() => setMobileMenuOpen(false)}>Flavours</a>
              <a href="#about" className="text-2xl font-display font-semibold" style={{ color: cfg.primary_color }} onClick={() => setMobileMenuOpen(false)}>Our Story</a>
              <a href="#order" className="text-2xl font-display font-semibold" style={{ color: cfg.primary_color }} onClick={() => setMobileMenuOpen(false)}>Order</a>
              <button className="px-8 py-3 rounded-full font-semibold text-lg" style={{ background: cfg.primary_color, color: "#f0f9ff" }}>Shop Now</button>
              <button className="absolute top-6 right-6 p-2" style={{ color: cfg.primary_color }} onClick={() => setMobileMenuOpen(false)}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 blob opacity-30 float-animation" style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 blob opacity-20" style={{ background: "linear-gradient(135deg, #1e40af, #8b5cf6)", animation: "float 8s ease-in-out infinite reverse" }} />
          <div className="w-full max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="slide-in">
              <p className="font-medium tracking-widest uppercase mb-4" style={{ color: cfg.accent_color }}>Premium Artisan Teas</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 gradient-text">{cfg.hero_title}</h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed" style={{ color: "#475569" }}>{cfg.hero_subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 pulse-glow" style={{ background: cfg.primary_color, color: "#f0f9ff" }}>
                  {cfg.cta_button_text}
                </button>
                <button className="px-8 py-4 rounded-full font-semibold text-lg border-2 transition-all hover:scale-105" style={{ borderColor: cfg.primary_color, color: cfg.primary_color, background: "transparent" }}>
                  Learn More
                </button>
              </div>
              <div className="flex items-center gap-4 md:gap-8 mt-12 flex-wrap">
                <div className="text-center">
                  <p className="font-display text-3xl font-bold" style={{ color: cfg.primary_color }}>8+</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>Unique Flavours</p>
                </div>
                <div className="w-px h-12" style={{ background: "#cbd5e1" }} />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold" style={{ color: cfg.primary_color }}>100%</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>Organic</p>
                </div>
                <div className="w-px h-12" style={{ background: "#cbd5e1" }} />
                <div className="text-center">
                  <p className="font-display text-3xl font-bold" style={{ color: cfg.primary_color }}>24hr</p>
                  <p className="text-sm" style={{ color: "#64748b" }}>Fresh Delivery</p>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center py-8">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 float-animation">
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  <ellipse cx="100" cy="160" rx="80" ry="15" fill="#e2e8f0" />
                  <ellipse cx="100" cy="157" rx="70" ry="12" fill="#f1f5f9" />
                  <path d="M40 80 Q40 150 100 155 Q160 150 160 80 L160 60 Q160 55 155 55 L45 55 Q40 55 40 60 Z" fill="#f8fafc" stroke="#1e40af" strokeWidth="3" />
                  <ellipse cx="100" cy="65" rx="55" ry="12" fill="#1e40af" />
                  <ellipse cx="100" cy="63" rx="50" ry="10" fill="#3b82f6" />
                  <path d="M160 75 Q190 75 190 110 Q190 140 160 140" fill="none" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
                  <g className="steam" style={{ animationDelay: "0s" }}>
                    <path d="M80 45 Q75 30 85 20" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <g className="steam" style={{ animationDelay: "1s" }}>
                    <path d="M100 40 Q95 25 105 15" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <g className="steam" style={{ animationDelay: "2s" }}>
                    <path d="M120 45 Q115 30 125 20" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  <path d="M70 100 Q80 90 90 100 Q80 110 70 100" fill="#22c55e" opacity="0.7" />
                  <path d="M110 120 Q120 110 130 120 Q120 130 110 120" fill="#22c55e" opacity="0.7" />
                </svg>
                <div className="absolute -top-2 -left-2 text-2xl md:text-4xl" style={{ animation: "float 4s ease-in-out infinite" }}>🍃</div>
                <div className="absolute top-8 -right-4 text-xl md:text-3xl" style={{ animation: "float 5s ease-in-out infinite 1s" }}>🌿</div>
                <div className="absolute bottom-8 -left-4 text-lg md:text-2xl" style={{ animation: "float 6s ease-in-out infinite 0.5s" }}>🍂</div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animation: "float 2s ease-in-out infinite" }}>
            <span className="text-sm font-medium" style={{ color: "#64748b" }}>Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="#64748b" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </section>

        {/* Flavours Section */}
        <section id="flavours" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-medium tracking-widest uppercase mb-4" style={{ color: cfg.accent_color }}>Our Collection</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: "#0f172a" }}>8 Exquisite Flavours</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>Each blend is carefully crafted to deliver a unique sensory experience. From classic to adventurous, find your perfect cup.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teas.map((tea, index) => (
                <TeaCard key={tea.id} tea={tea} index={index} onOpen={setCurrentTea.bind(null, teas.find(t => t.id === tea.id)!)} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24" style={{ background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-medium tracking-widest uppercase mb-4" style={{ color: "#93c5fd" }}>Our Story</p>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: "#f0f9ff" }}>Brewed with Passion Since 2015</h2>
                <p className="text-lg mb-6 leading-relaxed" style={{ color: "#bfdbfe" }}>EarlBlue Tea was born from a simple belief: everyone deserves access to extraordinary tea. We travel the world to source the finest leaves, working directly with farmers who share our commitment to quality and sustainability.</p>
                <p className="text-lg mb-8 leading-relaxed" style={{ color: "#bfdbfe" }}>Every cup tells a story of distant mountains, morning mists, and generations of tea-making tradition. We're not just selling tea – we're sharing moments of tranquility.</p>
                <div className="flex flex-wrap gap-6">
                  {[
                    { emoji: "🌱", title: "Organic", sub: "100% Natural" },
                    { emoji: "🌍", title: "Ethical", sub: "Fair Trade" },
                    { emoji: "♻️", title: "Sustainable", sub: "Eco Packaging" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(240, 249, 255, 0.2)" }}>
                        <span className="text-2xl">{item.emoji}</span>
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "#f0f9ff" }}>{item.title}</p>
                        <p className="text-sm" style={{ color: "#93c5fd" }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative mt-8 lg:mt-0">
                <div className="w-full max-w-sm mx-auto aspect-square rounded-3xl overflow-hidden" style={{ background: "rgba(240, 249, 255, 0.1)" }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 300 300" className="w-4/5 h-4/5">
                      <rect x="0" y="200" width="300" height="100" fill="#166534" />
                      <ellipse cx="150" cy="200" rx="140" ry="30" fill="#22c55e" />
                      <g fill="#16a34a">
                        <circle cx="60" cy="190" r="25" />
                        <circle cx="120" cy="185" r="30" />
                        <circle cx="180" cy="185" r="30" />
                        <circle cx="240" cy="190" r="25" />
                        <circle cx="90" cy="175" r="28" />
                        <circle cx="150" cy="170" r="32" />
                        <circle cx="210" cy="175" r="28" />
                      </g>
                      <path d="M0 150 L80 80 L150 130 L220 60 L300 140 L300 200 L0 200 Z" fill="#1e40af" opacity="0.3" />
                      <path d="M0 180 L100 120 L180 160 L260 100 L300 150 L300 200 L0 200 Z" fill="#3b82f6" opacity="0.3" />
                      <circle cx="250" cy="60" r="30" fill="#fbbf24" />
                      <circle cx="250" cy="60" r="25" fill="#fcd34d" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 p-4 md:p-6 rounded-2xl shadow-xl" style={{ background: "#f0f9ff" }}>
                  <p className="font-display text-4xl font-bold" style={{ color: cfg.primary_color }}>9+</p>
                  <p className="text-sm font-medium" style={{ color: "#64748b" }}>Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order / Cart Section */}
        <section id="order" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="font-medium tracking-widest uppercase mb-4" style={{ color: cfg.accent_color }}>Quick Order</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6" style={{ color: "#0f172a" }}>Ready to Sip?</h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>Choose your favorites and we'll deliver them fresh to your door.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-3xl p-8 md:p-12 shadow-xl" style={{ background: "#ffffff" }}>
                <div className="space-y-4 mb-8">
                  {cart.length === 0 ? (
                    <div className="text-center py-8" style={{ color: "#94a3b8" }}>
                      <span className="text-5xl mb-4 block">🛒</span>
                      <p>Your cart is empty. Click on a tea to add it!</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <CartItemRow key={item.id} item={item} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
                    ))
                  )}
                </div>
                <div className="border-t pt-6" style={{ borderColor: "#e2e8f0" }}>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold" style={{ color: "#334155" }}>Total:</span>
                    <span className="text-2xl font-display font-bold" style={{ color: cfg.primary_color }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    disabled={cart.length === 0}
                    className="w-full py-4 rounded-full font-semibold text-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: cfg.primary_color, color: "#f0f9ff" }}
                  >
                    Proceed to Checkout
                  </button>
                  <p className="text-center text-sm mt-4" style={{ color: "#94a3b8" }}>Free shipping on orders over $50</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="font-display text-3xl font-bold mb-4" style={{ color: "#f0f9ff" }}>Join the Tea Circle</h3>
            <p className="mb-8" style={{ color: "#94a3b8" }}>Get exclusive offers, brewing tips, and first access to new flavours.</p>
            <form
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              onSubmit={(e) => { e.preventDefault(); setNewsletterSubmitted(true); (e.target as HTMLFormElement).reset(); }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-3 rounded-full text-base outline-none focus:ring-2"
                style={{ background: "#334155", color: "#f1f5f9", border: "none" }}
                aria-label="Email address"
              />
              <button type="submit" className="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105" style={{ background: cfg.accent_color, color: "#f0f9ff" }}>
                Subscribe
              </button>
            </form>
            {newsletterSubmitted && (
              <p className="mt-4 text-sm" style={{ color: "#22c55e" }}>Thanks for subscribing! ☕</p>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12" style={{ background: "#0f172a" }}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: cfg.primary_color }}>
                    <svg className="w-4 h-4" fill="none" stroke="#f0f9ff" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <span className="font-display text-lg font-bold" style={{ color: "#f0f9ff" }}>{cfg.brand_name}</span>
                </div>
                <p className="text-sm" style={{ color: "#64748b" }}>Premium artisan teas crafted with love.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4" style={{ color: "#f0f9ff" }}>Shop</h4>
                <ul className="space-y-2 text-sm" style={{ color: "#64748b" }}>
                  {["All Teas", "Gift Sets", "Accessories", "Subscriptions"].map((l) => (
                    <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4" style={{ color: "#f0f9ff" }}>Company</h4>
                <ul className="space-y-2 text-sm" style={{ color: "#64748b" }}>
                  {["About Us", "Sustainability", "Careers", "Press"].map((l) => (
                    <li key={l}><a href="#" className="hover:text-blue-400 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4" style={{ color: "#f0f9ff" }}>Connect</h4>
                <div className="flex gap-4">
                  {/* Instagram */}
                  <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "#1e293b" }} aria-label="Instagram">
                    <svg className="w-5 h-5" fill="#64748b" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  {/* Twitter */}
                  <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "#1e293b" }} aria-label="Twitter">
                    <svg className="w-5 h-5" fill="#64748b" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: "#1e293b" }} aria-label="Facebook">
                    <svg className="w-5 h-5" fill="#64748b" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderColor: "#1e293b" }}>
              <p className="text-sm" style={{ color: "#64748b" }}>© 2024 EarlBlue Tea. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-sm hover:text-blue-400 transition-colors" style={{ color: "#64748b" }}>Privacy Policy</a>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors" style={{ color: "#64748b" }}>Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Tea Detail Modal */}
        {currentTea && (
          <TeaModal
            tea={currentTea}
            onClose={() => setCurrentTea(null)}
            onAddToCart={addToCart}
          />
        )}

        {/* Toast Notification */}
        <div
          className={`fixed bottom-6 right-6 px-6 py-3 rounded-full shadow-lg transform transition-all duration-300 z-50 ${toast.visible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          style={{ background: "#22c55e", color: "#ffffff" }}
        >
          {toast.message}
        </div>
      </div>
    </>
  );
}
