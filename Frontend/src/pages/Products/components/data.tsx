import { Mouse, Smartphone, Headphones, Gamepad2, Tv2, Watch, Camera } from "lucide-react";
import { Zap } from "lucide-react";
import { useState, type CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  badge: string;
  badgeType: string;
  cat: string;
  emoji: string;
  bg: string;
  glow: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const stats = [
  { value: 12, suffix: "K", label: "Users" },
  { value: 8,  suffix: "K", label: "Orders" },
  { value: 12, suffix: "K", label: "Products" },
];

export const brands = [
  { brand: "Apple",   count: 48 },
  { brand: "Samsung", count: 35 },
  { brand: "Sony",    count: 27 },
  { brand: "Dell",    count: 22 },
  { brand: "LG",      count: 18 },
  { brand: "Bose",    count: 14 },
];

export const ratings = [
  { stars: 5, count: 84 },
  { stars: 4, count: 63 },
  { stars: 3, count: 41 },
  { stars: 2, count: 18 },
  { stars: 1, count: 9 },
];

export const floatingIcons: {
  icon: React.ElementType;
  style: CSSProperties;
  delay: number;
  size: number;
}[] = [
  { icon: Mouse,      style: { top: "4%",  left: "50%", marginLeft: -28 }, delay: 0.2, size: 28 },
  { icon: Smartphone, style: { top: "12%", left: "12%"  },                  delay: 0,   size: 28 },
  { icon: Headphones, style: { top: "12%", right: "8%"  },                  delay: 0.4, size: 28 },
  { icon: Gamepad2,   style: { top: "44%", left: "2%"   },                  delay: 0.8, size: 26 },
  { icon: Tv2,        style: { top: "44%", right: "2%"  },                  delay: 1.2, size: 26 },
  { icon: Watch,      style: { top: "74%", left: "12%"  },                  delay: 0.6, size: 26 },
  { icon: Camera,     style: { top: "74%", right: "8%"  },                  delay: 1.0, size: 26 },
];

export const filterData = [
  { icon: <Zap size={16} />, label: "All Products", count: 200, cat: "all"      },
  { icon: <Zap size={16} />, label: "Laptops",      count: 120, cat: "laptops"  },
  { icon: <Zap size={16} />, label: "Mobiles",      count: 80,  cat: "mobiles"  },
  { icon: <Zap size={16} />, label: "Accessories",  count: 65,  cat: "accessories" },
  { icon: <Zap size={16} />, label: "Gaming",       count: 45,  cat: "gaming"   },
  { icon: <Zap size={16} />, label: "Audio",        count: 32,  cat: "audio"    },
];

export const products: Product[] = [
  { id:1, name:"MacBook Pro M4",     brand:"Apple",   price:2199, oldPrice:2499, rating:5, reviews:2400, badge:"New",   badgeType:"new",  cat:"laptops",   emoji:"💻", bg:"from-[#070e20] to-[#14082a]", glow:"rgba(79,142,255,0.28)"  },
  { id:2, name:"iPhone 16 Pro Max",  brand:"Apple",   price:1199, oldPrice:1299, rating:5, reviews:3100, badge:"Hot",   badgeType:"hot",  cat:"mobiles",   emoji:"📱", bg:"from-[#1a0708] to-[#08071a]", glow:"rgba(255,79,142,0.22)"  },
  { id:3, name:"WH-1000XM6",         brand:"Sony",    price:299,  oldPrice:399,  rating:5, reviews:1800, badge:"−25%", badgeType:"sale", cat:"audio",     emoji:"🎧", bg:"from-[#1a0f07] to-[#070f1a]", glow:"rgba(255,160,79,0.2)"   },
  { id:4, name:"PS5 Pro Bundle",     brand:"Sony",    price:699,  oldPrice:799,  rating:5, reviews:3800, badge:"Hot",   badgeType:"hot",  cat:"gaming",    emoji:"🎮", bg:"from-[#0e071a] to-[#1a070e]", glow:"rgba(142,79,255,0.22)"  },
  { id:5, name:"Watch Ultra 2",      brand:"Apple",   price:799,  oldPrice:999,  rating:5, reviews:987,  badge:"−20%", badgeType:"sale", cat:"wearables", emoji:"⌚", bg:"from-[#071a1a] to-[#1a0714]", glow:"rgba(79,220,255,0.22)"  },
  { id:6, name:"Galaxy Book4 Ultra", brand:"Samsung", price:2199, oldPrice:null, rating:4, reviews:876,  badge:"New",   badgeType:"new",  cat:"laptops",   emoji:"💻", bg:"from-[#070e20] to-[#14082a]", glow:"rgba(79,142,255,0.28)"  },
  { id:7, name:"Alpha A7R V",        brand:"Sony",    price:2999, oldPrice:3499, rating:5, reviews:654,  badge:"Ltd",   badgeType:"ltd",  cat:"cameras",   emoji:"📷", bg:"from-[#071a0e] to-[#1a0708]", glow:"rgba(79,255,176,0.22)"  },
  { id:8, name:"QuietComfort Ultra", brand:"Bose",    price:379,  oldPrice:429,  rating:5, reviews:1200, badge:"New",   badgeType:"new",  cat:"audio",     emoji:"🎵", bg:"from-[#1a0f07] to-[#070f1a]", glow:"rgba(255,160,79,0.2)"   },
  { id:9, name:"Galaxy S25 Ultra",   brand:"Samsung", price:1099, oldPrice:1299, rating:4, reviews:2100, badge:"−15%", badgeType:"sale", cat:"mobiles",   emoji:"📱", bg:"from-[#0e071a] to-[#1a070e]", glow:"rgba(142,79,255,0.22)"  },
  { id:10,name:"Dell XPS 15",        brand:"Dell",    price:1599, oldPrice:1799, rating:4, reviews:1340, badge:"New",   badgeType:"new",  cat:"laptops",   emoji:"💻", bg:"from-[#070e20] to-[#14082a]", glow:"rgba(79,142,255,0.28)"  },
  { id:11,name:"Galaxy Tab S10",     brand:"Samsung", price:899,  oldPrice:999,  rating:4, reviews:780,  badge:"−10%", badgeType:"sale", cat:"tablets",   emoji:"📱", bg:"from-[#0e071a] to-[#1a070e]", glow:"rgba(142,79,255,0.22)"  },
  { id:12,name:"LG OLED C4 65\"",   brand:"LG",      price:1799, oldPrice:2199, rating:5, reviews:930,  badge:"−18%", badgeType:"sale", cat:"tv",        emoji:"📺", bg:"from-[#071a0e] to-[#1a0708]", glow:"rgba(79,255,176,0.22)"  },
];

export const SORT_OPTIONS = [
  { label: "Featured",          key: "featured"   },
  { label: "Price: Low → High", key: "price-asc"  },
  { label: "Price: High → Low", key: "price-desc" },
  { label: "Top Rated",         key: "rating"     },
];
