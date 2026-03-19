import { useEffect, useMemo, useState } from "react";
import { useGetSingleProductQuery } from "@/slices/productApiSlice";
import { useParams } from "react-router-dom";
import Loader from "@/Components/Loader";
import GridBackground from "@/Components/GridBackground";
import ProductCard, { type Product } from "@/pages/Products/components/ProductCard";
import { PowerGlitch } from "powerglitch";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import {useDispatch} from "react-redux"
import {addToCart} from "@/slices/cartSlice"
import {useNavigate} from "react-router-dom"
export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetSingleProductQuery(id!);
  const product = data?.result;
  const [qty, setqty] = useState(1)
  function qtyController(action: string) {
  setqty((prev) => {
    if (action === "plus" && product?.countInStock && prev < product.countInStock) {
      return prev + 1;
    } else if (action === "minus" && prev > 1) {
      return prev - 1;
    } else {
      return prev;
    }
  });
}
const dispatch = useDispatch()
const navigate = useNavigate()

useEffect(() => {
  if (!product) return;

PowerGlitch.glitch(".glitch", {
  playMode: "always",

  timing: {
    duration: 600,     // glitch duration
    iterations: 1,     // only once per cycle
  },

  glitchTimeSpan: {
    start: 0.2,
    end: 0.8
  },

  shake: {
    velocity: 10,
    amplitudeX: 0.15,
    amplitudeY: 0.15
  },

  slice: {
    count: 6,
    velocity: 15,
    minHeight: 0.02,
    maxHeight: 0.2
  },

  pulse: {
    scale: 1.05
  }
});
}, [product]);

  const images = useMemo(
    () =>
      product?.images
        ? [
            ...product.images.filter((i) => i.isPrimary),
            ...product.images.filter((i) => !i.isPrimary),
          ]
        : [],
    [product?.images],
  );

  const [activeImage, setActiveImage] = useState(images[0]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [activeTechTab, setActiveTechTab] = useState<"specs" | "box">("specs");
const addToCartHandler = () => {
  if (!product) return;
  const cartItem = {
    _id: product._id,
    name: product.name,
    image: product.images?.[0]?.url ?? "",
    price: product.price,
    qty,
    brand: product.brand,
    category: product.category?.name ?? "",
  };
  dispatch(addToCart(cartItem));
  navigate('/cart');
}
  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);

  useEffect(() => {
    if (!product) return;
    const initialVariants: Record<string, string> = {};
    product.variantGroups?.forEach((group) => {
      const firstAvailable = group.options.find((o) => o.inStock) ?? group.options[0];
      if (firstAvailable) initialVariants[group.name] = firstAvailable.value;
    });
    setSelectedVariants(initialVariants);
    setSelectedColor(product.colors?.[0]?.hex ?? null);
    setActiveTechTab(product.specs?.length ? "specs" : "box");
  }, [product]);

  const relatedCards: Product[] = useMemo(
    () =>
      (product?.relatedProducts ?? []).map((rp, idx) => ({
        _id: rp.product ?? `related-${idx}`,
        name: rp.name,
        brand: rp.brand,
        price: rp.price,
        originalPrice: undefined,
        rating: product?.rating ?? 0,
        numReviews: product?.numReviews ?? 0,
        badge: rp.badge,
        countInStock: 1,
        images: [{ url: rp.image, alt: rp.name, isPrimary: true }],
        category: {
          _id: product?.category?._id ?? "",
          name: rp.category,
          slug: rp.category.toLowerCase().replace(/\s+/g, "-"),
        },
      })),
    [product],
  );

  if (isLoading) return <Loader />;
  if (isError || !product) return <p className="text-center py-20 text-muted">Product not found.</p>;

  const stars = Math.round(product.rating);
  const currency = product.currency ?? "USD";

  const variantPriceDelta = (product.variantGroups ?? []).reduce((total, group) => {
    const selectedValue = selectedVariants[group.name];
    const selectedOption = group.options.find((opt) => opt.value === selectedValue);
    return total + (selectedOption?.priceModifier ?? 0);
  }, 0);

  const displayPrice = product.price + variantPriceDelta;
  const displayOriginalPrice = product.originalPrice ? product.originalPrice + variantPriceDelta : undefined;
  const savedAmount = displayOriginalPrice ? displayOriginalPrice - displayPrice : 0;
  const savedPct = displayOriginalPrice ? Math.round((savedAmount / displayOriginalPrice) * 100) : 0;

  const ratingRows = [
    { label: "5★", value: product.ratingBreakdown?.five ?? 0 },
    { label: "4★", value: product.ratingBreakdown?.four ?? 0 },
    { label: "3★", value: product.ratingBreakdown?.three ?? 0 },
    { label: "2★", value: product.ratingBreakdown?.two ?? 0 },
    { label: "1★", value: product.ratingBreakdown?.one ?? 0 },
  ];

  return (
    <div className="space-y-6 px-3 sm:px-5 lg:px-8 pb-8">
      <div className="font-mono flex flex-wrap gap-1 text-[0.75rem] text-muted m-1 sm:m-3">
        <span className="text-text2">Home</span>
        <span>/</span>
        <span className="text-text2">{product.category.slug}</span>
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-gb bg-surf2 flex items-center justify-center min-h-105">
            <GridBackground ratio={3} contained />

            {product.cardGlowColor && (
              <div className="absolute inset-0 z-1" style={{ background: `radial-gradient(circle at 50% 100%, ${product.cardGlowColor}, transparent 60%)` }} />
            )}

            {activeImage ? (
              <img
                className="relative z-2 w-[78%] max-w-140 h-auto object-contain py-8 sm:py-10 drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)] transition-transform duration-500 hover:scale-105"
                src={activeImage.url}
                alt={activeImage.alt ?? product.name}
              />
            ) : (
              <span className="relative z-2 text-[80px]">📦</span>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {images.map((img, idx) => {
              const selected = activeImage?.url === img.url;
              return (
                <button
                  key={`${img.url}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`rounded-xl border overflow-hidden bg-surf2 transition-all ${selected ? "border-a shadow-[0_0_0_1px_var(--color-a)]" : "border-gb hover:border-a/60"}`}
                  aria-label={`Preview image ${idx + 1}`}
                >
                  <img src={img.url} alt={img.alt ?? `${product.name} preview ${idx + 1}`} className="w-full h-20 object-cover" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-5 md:pt-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-a font-mono tracking-wider uppercase">{product.brand}</span>
            {product.badge && (
              <span className="text-a2 glitch px-3 py-1 text-[10px] sm:text-xs text-center rounded-2xl border border-a2/30 bg-a2/15 font-mono uppercase tracking-wide">
                {product.badge}
              </span>
            )}
          </div>

          <h1 className="text-3xl  md:text-4xl lg:text-5xl font-bold tracking-wide text-text leading-tight">{product.name}</h1>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-a3 text-sm tracking-[1px]">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
            <span className="text-muted font-mono text-xs">{product.rating.toFixed(1)} ({product.numReviews.toLocaleString()} reviews)</span>
          </div>

          <div className="flex flex-wrap items-end gap-2 sm:gap-3">
            <p className="text-4xl font-bold text-a3 leading-none">{currency} {displayPrice.toLocaleString()}</p>
            {displayOriginalPrice && <p className="text-muted line-through font-mono">{currency} {displayOriginalPrice.toLocaleString()}</p>}
            {!!savedAmount && <span className="text-xs font-mono text-a px-2 py-1 rounded-lg bg-a/10 border border-a/20">Save ${savedAmount.toLocaleString()} ({savedPct}%)</span>}
          </div>

          {!!product.quickSpecs?.length && (
            <div className="rounded-xl border border-gb bg-card p-3 sm:p-4">
              <p className="text-[11px] text-muted font-mono uppercase tracking-wide mb-3">Quick Specs</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {product.quickSpecs.map((item, idx) => (
                  <div key={`${item.label}-${idx}`} className="rounded-lg border border-gb bg-surf px-3 py-2">
                    <p className="text-[11px] text-muted font-mono uppercase">{item.icon} {item.label}</p>
                    <p className="text-sm sm:text-base text-text font-semibold mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className={`font-semibold ${product.countInStock > 0 ? "text-a3" : "text-a2"}`}>
              {product.countInStock > 0 ? `${product.countInStock} available` : "Out of stock"}
            </span>
            <span className="text-muted">{(product.soldCount ?? 0).toLocaleString()} sold</span>
            <span className="text-text2">Category: <span className="text-text font-medium">{product.category.name}</span></span>
            <span className="text-muted font-mono">{product.category.slug}</span>
          </div>

          {product.description && <p className="text-text2 leading-relaxed">{product.description}</p>}

          {!!product.variantGroups?.length && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Configurable Options</h3>
              {product.variantGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <p className="text-xs font-mono text-muted uppercase">{group.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const active = selectedVariants[group.name] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          disabled={!option.inStock}
                          onClick={() => setSelectedVariants((prev) => ({ ...prev, [group.name]: option.value }))}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${active ? "border-a bg-a/10 text-a" : "border-gb bg-surf text-text2"} ${!option.inStock ? "opacity-40 cursor-not-allowed" : "hover:border-a/60"}`}
                        >
                          {option.label}
                          {option.priceModifier !== 0 && ` (${option.priceModifier > 0 ? "+" : ""}${currency} ${option.priceModifier})`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!!product.colors?.length && (
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted uppercase">Colors</p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const active = selectedColor === color.hex;
                  return (
                    <button
                      key={`${color.name}-${color.hex}`}
                      type="button"
                      onClick={() => setSelectedColor(color.hex)}
                      className={`flex items-center gap-2 rounded-full border px-2.5 py-1 ${active ? "border-a bg-a/10" : "border-gb bg-surf"}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-gb" style={{ backgroundColor: color.hex }} />
                      <span className="text-xs text-text2">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-gb bg-surf p-3">
              <p className="text-[11px] text-muted font-mono uppercase">Selected Options</p>
              <div className="mt-2 space-y-1">
                {(product.variantGroups ?? []).map((group) => {
                  const selectedValue = selectedVariants[group.name];
                  const selectedOption = group.options.find((o) => o.value === selectedValue);
                  return (
                    <p key={group.name} className="text-sm text-text2">
                      <span className="text-text font-medium">{group.name}:</span> {selectedOption?.label ?? "-"}
                    </p>
                  );
                })}
                {!(product.variantGroups ?? []).length && <p className="text-sm text-text2">No configurable options</p>}
              </div>
            </div>
            <div className="rounded-xl border border-gb bg-surf p-3">
              <p className="text-[11px] text-muted font-mono uppercase">Delivery & Policy</p>
              <p className="text-sm text-text mt-1">{product.deliveryDate ?? "Standard shipping"}</p>
              <p className="text-sm text-text2 mt-1">{product.returnDays ?? 30}-day returns</p>
              <p className="text-sm text-text2 mt-1">{product.warrantyYears ?? 1} year warranty</p>
            </div>


          </div>
                      <div className="flex">
              <div className="border rounded-2xl bg-white py-3 px-5 gap-4 items-center justify-center flex font-bold font-mono me-3 dark:text-bg text-xl"><Minus className="cursor-pointer" onClick={() => qtyController("minus")}/> {qty} <Plus className="cursor-pointer" onClick={() => qtyController("plus")}/>
              
              </div>
               <button
  className="
    w-full sm:w-[200px] md:w-[300px] lg:w-[350px] xl:w-[400px] 2xl:w-[500px]
    relative overflow-hidden
    flex items-center justify-center gap-2
    px-8 py-4 rounded-2xl
    bg-text text-bg
    font-body font-bold text-[15px]
    border border-transparent
    shadow-[0_4px_24px_rgba(0,0,0,0.3)]
    hover:-translate-y-0.5
    hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]
    active:scale-[0.98]
    transition-all duration-200
    group  cursor-pointer
  "
   onClick={()=> addToCartHandler()}
>
  {/* shimmer sweep on hover */}
  <span
    className="
      pointer-events-none absolute inset-0
      translate-x-[-100%] group-hover:translate-x-[100%]
      bg-gradient-to-r from-transparent via-white/10 to-transparent
      transition-transform duration-500 
    "
  />

  <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
  Add to Cart
</button>
            </div>
        </section>
      </div>

      {!!(product.specs?.length || product.boxItems?.length) && (
<section className="rounded-2xl border border-gb bg-surf p-5 sm:p-6 space-y-6 shadow-sm">
  
  {/* Header */}
  <div className="flex flex-wrap items-center justify-between gap-4">
    <h2 className="text-2xl font-bold text-text tracking-tight">
      Technical Details
    </h2>

    {/* Tabs */}
    <div className="flex rounded-xl border border-gb bg-card p-1 shadow-sm">
      <button
        onClick={() => setActiveTechTab("specs")}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
        ${
          activeTechTab === "specs"
            ? "bg-a text-white shadow-sm"
            : "text-text2 hover:text-text"
        }`}
      >
        Specs ({product.specs?.length ?? 0})
      </button>

      <button
        onClick={() => setActiveTechTab("box")}
        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all
        ${
          activeTechTab === "box"
            ? "bg-a text-white shadow-sm"
            : "text-text2 hover:text-text"
        }`}
      >
        In Box ({product.boxItems?.length ?? 0})
      </button>
    </div>
  </div>

  {/* Content */}
  {activeTechTab === "specs" ? (
    product.specs?.length ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.specs.map((spec, idx) => (
          <article
            key={idx}
            className="group rounded-2xl border border-gb bg-card p-4 transition-all duration-300
            hover:shadow-lg hover:-translate-y-1 hover:border-a/40"
          >
            <p className="text-xs uppercase tracking-wide text-muted font-mono">
              {spec.icon} {spec.label}
            </p>

            <p className="text-lg font-semibold text-text mt-1">
              {spec.value}
            </p>

            <p className="text-sm text-text2 mt-2 leading-relaxed">
              {spec.description}
            </p>
          </article>
        ))}
      </div>
    ) : (
      <div className="rounded-xl border border-dashed border-gb bg-card p-6 text-center text-text2">
        No specifications available
      </div>
    )
  ) : product.boxItems?.length ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {product.boxItems.map((item, idx) => (
        <article
          key={idx}
          className="group rounded-2xl border border-gb bg-card p-4 transition-all duration-300
          hover:shadow-lg hover:-translate-y-1 hover:border-a/40"
        >
          <p className="text-xs uppercase tracking-wide text-muted font-mono">
            In the Box
          </p>

          <p className="text-base font-semibold text-text mt-1">
            {item.icon} {item.name}
          </p>

          <p className="text-sm text-text2 mt-2">
            Quantity:{" "}
            <span className="font-semibold text-text">
              {item.quantity}
            </span>
          </p>
        </article>
      ))}
    </div>
  ) : (
    <div className="rounded-xl border border-dashed border-gb bg-card p-6 text-center text-text2">
      No box details available
    </div>
  )}
</section>
      )}

      <section className="rounded-xl border border-gb bg-surf p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-mono text-muted uppercase">Rating Breakdown</p>
          <button
            type="button"
            onClick={() => setShowReviewDetails((v) => !v)}
            className="text-xs font-mono text-a border border-a/30 bg-a/10 rounded-lg px-2.5 py-1 hover:bg-a/15"
          >
            {showReviewDetails ? "Hide review details" : "See review details"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {ratingRows.map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className="w-8 text-xs text-text2 font-mono">{row.label}</span>
              <div className="flex-1 h-2 rounded-full bg-gb overflow-hidden">
                <div className="h-full bg-a3" style={{ width: `${Math.max(0, Math.min(100, row.value))}%` }} />
              </div>
              <span className="w-10 text-right text-xs text-muted font-mono">{row.value}%</span>
            </div>
          ))}
        </div>

        {showReviewDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
            {ratingRows.map((row) => {
              const count = Math.round((row.value / 100) * product.numReviews);
              return (
                <div key={`${row.label}-detail`} className="rounded-lg border border-gb bg-card px-3 py-2">
                  <p className="text-xs text-muted font-mono">{row.label} Reviews</p>
                  <p className="text-sm text-text font-semibold mt-1">{count.toLocaleString()} users</p>
                </div>
              );
            })}
            <div className="rounded-lg border border-gb bg-card px-3 py-2 sm:col-span-2 lg:col-span-3">
              <p className="text-xs text-muted font-mono">Total Reviews</p>
              <p className="text-sm text-text font-semibold mt-1">{product.numReviews.toLocaleString()}</p>
            </div>
          </div>
        )}
      </section>

      {!!relatedCards.length && (
        <section className="space-y-4 pt-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCards.map((item) => (
              <ProductCard key={item._id} p={item} isListView={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
