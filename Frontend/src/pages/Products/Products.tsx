import { type CSSProperties, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mouse, Laptop, Smartphone, Headphones, Gamepad2, Tv2, Watch, Camera, Zap } from "lucide-react";
import GridBackground from "@/Components/GridBackground";
import HeroHeadline from "@/Components/HeroHeadline";
import CountUp from "@/Components/CountUp";
import type { Product } from "./components/ProductCard";
import ProductsGrid from "./components/ProductsGrid";
import Loader from "@/Components/Loader";
import { useGetProductsQuery } from "@/slices/productApiSlice";

const stats = [
  { value: 12, suffix: "K", label: "Users" },
  { value: 8,  suffix: "K", label: "Orders" },
  { value: 12, suffix: "K", label: "Products" },
];

const floatingIcons: { icon: React.ElementType; style: CSSProperties; delay: number; size: number }[] = [
  { icon: Mouse,      style: { top: "4%",  left: "50%", marginLeft: -28 }, delay: 0.2, size: 28 },
  { icon: Smartphone, style: { top: "12%", left: "12%"  },                  delay: 0,   size: 28 },
  { icon: Headphones, style: { top: "12%", right: "8%"  },                  delay: 0.4, size: 28 },
  { icon: Gamepad2,   style: { top: "44%", left: "2%"   },                  delay: 0.8, size: 26 },
  { icon: Tv2,        style: { top: "44%", right: "2%"  },                  delay: 1.2, size: 26 },
  { icon: Watch,      style: { top: "74%", left: "12%"  },                  delay: 0.6, size: 26 },
  { icon: Camera,     style: { top: "74%", right: "8%"  },                  delay: 1.0, size: 26 },
];

const filterData = [
  { icon: <Zap size={16} />, label: "All Products", count: 200, cat: "all"         },
  { icon: <Zap size={16} />, label: "Laptops",      count: 120, cat: "laptops"     },
  { icon: <Zap size={16} />, label: "Mobiles",      count: 80,  cat: "mobiles"     },
  { icon: <Zap size={16} />, label: "Accessories",  count: 65,  cat: "accessories" },
  { icon: <Zap size={16} />, label: "Gaming",       count: 45,  cat: "gaming"      },
  { icon: <Zap size={16} />, label: "Audio",        count: 32,  cat: "audio"       },
];

// ─── Pure helpers (outside component, no re-creation on every render) ───────

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

function filterProducts(
  products: Product[],
  activeCategory: string,
  searchQuery: string,
  priceRange: number,
  priceActive: boolean,
  selectedBrands: string[],
  selectedRatings: number[],
): Product[] {
  return products.filter(p => {
    const matchCat    = activeCategory === "all" || p.category?.slug === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice  = !priceActive || p.price <= priceRange;
    const matchBrand  = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchRating = selectedRatings.length === 0 || selectedRatings.some(s => p.rating >= s);
    return matchCat && matchSearch && matchPrice && matchBrand && matchRating;
  });
}

function sortProducts(products: Product[], sortKey: string): Product[] {
  return [...products].sort((a, b) => {
    if (sortKey === "price-asc")  return a.price - b.price;
    if (sortKey === "price-desc") return b.price - a.price;
    if (sortKey === "rating")     return b.rating - a.rating;
    return 0;
  });
}

// async function fetchProducts(setProducts: React.Dispatch<React.SetStateAction<Product[]>>) {
//   const { data } = await api.get("/api/products");
//   setProducts(data.result);
// }

// ─── Component ───────────────────────────────────────────────────────────────

export default function Products() {
  const [priceRange, setPriceRange]             = useState(3000);
  const [priceActive, setPriceActive]           = useState(false);
  const [selectedBrands, setSelectedBrands]     = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings]   = useState<number[]>([]);
  const [activeCategory, setActiveCategory]     = useState("all");
  const [searchQuery, setSearchQuery]           = useState("");
  const [sortKey, setSortKey]                   = useState("featured");
  const [isListView, setIsListView]             = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFiltering, setIsFiltering]           = useState(false);
  const { data, isLoading, isError }            = useGetProductsQuery();
  const products: Product[]                     = data?.result ?? [];


  // Trigger filtering animation whenever filters change
  useEffect(() => {
    const t1 = setTimeout(() => setIsFiltering(true), 0);
    const t2 = setTimeout(() => setIsFiltering(false), 320);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [priceRange, selectedBrands, selectedRatings, activeCategory, searchQuery, sortKey]);

  const toggleBrand  = (brand: string) => setSelectedBrands(prev => toggleItem(prev, brand));
  const toggleRating = (stars: number) => setSelectedRatings(prev => toggleItem(prev, stars));
  const clearAll = () => {
    setSelectedBrands([]); setSelectedRatings([]);
    setPriceRange(3000);   setPriceActive(false);   setActiveCategory("all");
    setSearchQuery("");    setSortKey("featured");
  };

  const sorted = sortProducts(
    filterProducts(products, activeCategory, searchQuery, priceRange, priceActive, selectedBrands, selectedRatings),
    sortKey,
  );

  if (isLoading) return <Loader />;
  if (isError)   return <p className="text-center py-20 text-muted">Failed to load products.</p>;

  return (
    <>
      <GridBackground />

      {/* Breadcrumb */}
      <div className="font-mono flex text-[0.75rem] text-muted">
        <span className="text-text2">Home</span>&nbsp;/ ALL Products
      </div>

      {/* Hero */}
      <HeroHeadline
        line1="All" line2="Products" line3="Catalog" size="text-8xl"
        line1Side={
          <div className="flex lg:hidden items-end gap-1.5 self-end pb-3">
            {[Laptop, Smartphone, Headphones, Gamepad2].map((Icon, i) => (
              <motion.div key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.8 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
                className="w-7 h-7 rounded-xl bg-surf border border-gb flex items-center justify-center shadow-sm">
                <Icon size={13} className="text-a" />
              </motion.div>
            ))}
          </div>
        }
      />

      {/* Stats + floating icons */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
        <div className="flex flex-col gap-6">
          <p className="text-text2">Discover 12,000+ premium electronics — curated, tested, delivered.</p>
          <div className="flex flex-wrap gap-4">
            {stats.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="flex flex-col items-center justify-center px-6 py-4
                           bg-surf border border-gb rounded-2xl shadow-sm
                           hover:bg-surf2 hover:shadow-md transition duration-300">
                <div className="text-xl font-bold text-text">
                  <CountUp to={item.value} suffix={item.suffix} /><span className="text-a">+</span>
                </div>
                <div className="mt-2 text-xs text-muted uppercase tracking-wide">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating icons — desktop only */}
        <div className="hidden lg:block relative w-72 h-96 shrink-0 -mt-72 me-20 overflow-visible">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-40 rounded-full bg-a/10 blur-3xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-2xl bg-surf border border-gb shadow-xl flex items-center justify-center">
              <Laptop size={38} className="text-a" />
            </div>
          </div>
          {floatingIcons.map(({ icon: Icon, style: s, delay, size }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { duration: 0.4, delay: i * 0.1 },
                scale:   { duration: 0.4, delay: i * 0.1 },
                y:       { duration: 2.5 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay },
              }}
              style={s}
              className="absolute z-20 w-14 h-14 rounded-2xl bg-surf border border-gb shadow-sm flex items-center justify-center">
              <Icon size={size} className="text-a" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="mt-10 flex flex-wrap gap-2">
        {filterData.map((item, i) => {
          const active = activeCategory === item.cat;
          return (
            <motion.button key={i}
              onClick={() => setActiveCategory(item.cat)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full border text-text cursor-pointer transition-all duration-200
                ${active ? "bg-a/15 border-a text-a" : "bg-surf border-gb hover:bg-surf2 hover:border-a/30 hover:scale-105"}`}>
              <span className="text-a">{item.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${active ? "bg-a/20 text-a" : "bg-gb text-text2"}`}>
                <CountUp to={item.count} suffix="" />
              </span>
            </motion.button>
          );
        })}
      </div>

      <ProductsGrid
        sorted={sorted}
        isFiltering={isFiltering}
        isListView={isListView}
        setIsListView={setIsListView}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        priceActive={priceActive}
        setPriceActive={setPriceActive}
        selectedBrands={selectedBrands}
        toggleBrand={toggleBrand}
        setSelectedBrands={setSelectedBrands}
        selectedRatings={selectedRatings}
        toggleRating={toggleRating}
        setSelectedRatings={setSelectedRatings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortKey={sortKey}
        setSortKey={setSortKey}
        filterDrawerOpen={filterDrawerOpen}
        setFilterDrawerOpen={setFilterDrawerOpen}
        clearAll={clearAll}
      />
    </>
  );
}
