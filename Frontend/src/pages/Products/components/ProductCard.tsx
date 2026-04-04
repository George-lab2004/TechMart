import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { addToCart } from "@/slices/cartSlice";
import { useAddToCartMutation } from "@/slices/cartApiSlice";
import toast from "react-hot-toast";

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  brand: string;
  description?: string;
  sku?: string;
  tags?: string[];
  price: number;
  originalPrice?: number;
  currency?: string;
  rating: number;
  numReviews: number;
  badge?: string;
  countInStock: number;
  soldCount?: number;
  images: { url: string; alt: string; isPrimary: boolean }[];
  variantGroups?: { name: string; options: { label: string; value: string; priceModifier: number; inStock: boolean }[] }[];
  colors?: { name: string; hex: string }[];
  quickSpecs?: { icon: string; label: string; value: string }[];
  specs?: { icon: string; label: string; value: string; description: string }[];
  boxItems?: { icon: string; name: string; quantity: string }[];
  ratingBreakdown?: { five: number; four: number; three: number; two: number; one: number };
  deliveryDate?: string;
  returnDays?: number;
  warrantyYears?: number;
  relatedProducts?: {
    product?: string;
    name: string;
    brand: string;
    price: number;
    badge?: string;
    image: string;
    category: string;
  }[];
  cardBgColor?: string;
  cardGlowColor?: string;
  category: { _id: string; name: string; slug: string };
}

function badgeStyle(badge?: string) {
  if (!badge) return "";
  const b = badge.toLowerCase();
  if (b.includes("new")) return "bg-[rgba(79,142,255,0.2)]  text-[#4f8eff] border border-[rgba(79,142,255,0.3)]";
  if (b.includes("hot")) return "bg-[rgba(255,79,142,0.2)]  text-[#ff4f8e] border border-[rgba(255,79,142,0.3)]";
  if (b.includes("sale") || b.includes("%")) return "bg-[rgba(79,255,176,0.2)] text-[#4fffb0] border border-[rgba(79,255,176,0.3)]";
  return "bg-[rgba(255,200,79,0.2)] text-[#ffc84f] border border-[rgba(255,200,79,0.3)]";
}

export default function ProductCard({ p, isListView }: { p: Product; isListView: boolean }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [addToCartApi] = useAddToCartMutation();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${cx * 7}deg) rotateX(${-cy * 7}deg) translateY(-5px)`;
    el.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const cartItem = {
      _id: p._id,
      name: p.name,
      image: p.images?.[0]?.url ?? "",
      price: p.price,
      qty: 1,
      brand: p.brand,
      category: p.category.name,
      countInStock: p.countInStock || 1,
      product: p._id
    };

    if (userInfo) {
      await addToCartApi(cartItem).unwrap();
    } else {
      dispatch(addToCart(cartItem));
    }

    toast.success(`${p.name} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const primaryImg = p.images?.find(i => i.isPrimary) ?? p.images?.[0];
  const stars = Math.round(p.rating);

  if (isListView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        className="group flex overflow-hidden rounded-2xl border border-gb bg-card cursor-pointer
                   hover:border-white/10 transition-all duration-300 hover:shadow-xl"
      >
        <div className="w-44 shrink-0 relative overflow-hidden bg-surf2 flex items-center justify-center"
          style={p.cardBgColor ? { background: p.cardBgColor } : undefined}>
          {p.cardGlowColor && (
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${p.cardGlowColor}, transparent 60%)` }} />
          )}
          {primaryImg
            ? <img src={primaryImg.url} alt={primaryImg.alt}
              className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105" />
            : <span className="text-4xl">📦</span>
          }
          {p.badge && (
            <span className={`absolute top-3 left-3 z-20 font-mono text-[8px] uppercase tracking-wide px-2 py-1 rounded-md font-medium ${badgeStyle(p.badge)}`}>{p.badge}</span>
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 p-5 border-l border-gb">
          <div>
            <p className="font-mono text-[9px] text-muted uppercase tracking-[2px] mb-1">{p.brand}</p>
            <h3 className="text-xl font-semibold text-text mb-2">{p.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-yellow-400 text-xs">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
              <span className="font-mono text-[10px] text-muted">({(p.numReviews / 1000).toFixed(1)}k)</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              {p.originalPrice && <p className="font-mono text-xs text-muted line-through">${p.originalPrice}</p>}
              <p className={`text-2xl font-bold ${p.originalPrice ? "text-a3" : "text-text"}`}>${p.price.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={e => { e.stopPropagation(); setWished(w => !w); }}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200
                  ${wished ? "bg-a2/20 border-a2" : "bg-glass border-gb hover:bg-a2/15 hover:border-a2"}`}>
                <Heart size={14} className={wished ? "text-a2 fill-a2" : "text-text2"} />
              </button>
              <button onClick={handleAdd}
                className={`px-4 h-9 rounded-xl text-xs font-bold transition-all duration-200
                  ${added ? "bg-a3 text-bg" : "bg-a text-white hover:-translate-y-0.5 hover:shadow-[0_4px_16px_var(--ag)]"}`}>
                {added ? "✓ Added" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      style={{ willChange: "transform", transition: "transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease" }}
      className="group relative overflow-hidden rounded-[22px] border border-gb bg-card cursor-pointer
                 hover:border-white/10 hover:shadow-xl"
    >
      <div className="absolute inset-0 pointer-events-none z-2 rounded-[22px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(circle at var(--sx,50%) var(--sy,50%), rgba(255,255,255,0.05), transparent 50%)" }} />

      <div className="relative w-full h-50 flex items-center justify-center overflow-hidden bg-surf2"
        style={p.cardBgColor ? { background: p.cardBgColor } : undefined}>
        {p.cardGlowColor && (
          <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${p.cardGlowColor}, transparent 60%)` }} />
        )}
        {p.badge && (
          <span className={`absolute top-3 left-3 z-20 font-mono text-[8px] uppercase tracking-wide px-2 py-1 rounded-md font-medium ${badgeStyle(p.badge)}`}>{p.badge}</span>
        )}
        <button onClick={e => { e.stopPropagation(); setWished(w => !w); }}
          className={`absolute top-3 right-3 z-20 w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-200
            ${wished ? "bg-a2/20 border-a2" : "bg-glass border-gb hover:bg-a2/20 hover:scale-110"}`}>
          <Heart size={12} className={wished ? "text-a2 fill-a2" : "text-text2"} />
        </button>
        {primaryImg
          ? <img src={primaryImg.url} alt={primaryImg.alt}
            className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1" />
          : <span className="relative z-10 text-[64px]">📦</span>
        }
        <div className="absolute inset-0 z-30 flex items-center justify-center gap-2 bg-bg/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={handleAdd}
            className={`px-4 py-2 rounded-[10px] mt-28 text-[13px] font-bold transition-all duration-150
              ${added ? "bg-a3 text-bg" : "bg-surf text-text hover:-translate-y-0.5 hover:shadow-xl"}`}>
            {added ? "✓ Added!" : "Quick Add"}
          </button>
          <Link to={`/products/${p._id}`} className="w-9 h-9 bg-glass border mt-28 border-gb rounded-[10px] flex items-center justify-center text-text2 hover:bg-a/20 hover:border-a transition-all"><Eye /></Link>
        </div>
      </div>

      <div className="p-4 border-t border-gb">
        <p className="font-mono text-[9px] text-muted uppercase tracking-[2px] mb-1">{p.brand}</p>
        <h3 className="text-[14px] font-semibold text-text mb-2 leading-snug">{p.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-yellow-400 text-[11px] tracking-[1px]">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
          <span className="font-mono text-[10px] text-muted">({(p.numReviews / 1000).toFixed(1)}k)</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            {p.originalPrice && <p className="font-mono text-[11px] text-muted line-through">${p.originalPrice}</p>}
            <p className={`text-[22px] font-bold leading-none ${p.originalPrice ? "text-a3" : "text-text"}`}>${p.price.toLocaleString()}</p>
          </div>
          <button onClick={handleAdd}
            className={`w-9 h-9 rounded-[10px] border flex items-center justify-center text-[17px] font-light transition-all duration-200
              ${added ? "bg-a3 border-a3 text-bg" : "bg-glass border-gb text-text2 hover:bg-a hover:border-a hover:text-white hover:rotate-90"}`}>
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
