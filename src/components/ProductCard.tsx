import { Link } from "react-router-dom";
import { Product, accentMap } from "@/data/products";
import { ArrowRight, Zap } from "lucide-react";

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const acc = accentMap[product.accent];
  return (
    <Link
      to={`/products/${product.slug}`}
      style={{
        animationDelay: `${0.04 + index * 0.06}s`,
        // @ts-expect-error custom prop
        "--accent": acc.color,
        "--accentGlow": acc.glow,
      }}
      className="group relative flex min-h-[360px] translate-y-6 flex-col overflow-hidden rounded-2xl border border-border bg-gradient-panel p-5 opacity-0 shadow-[var(--shadow-card)] transition-all duration-300 [animation:rise_0.85s_cubic-bezier(0.2,0.8,0.2,1)_forwards] hover:-translate-y-2 hover:border-foreground/10 hover:brightness-[1.03]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-70 [animation:gridGlow_6s_ease-in-out_infinite] [mask-image:linear-gradient(180deg,rgba(0,0,0,1),rgba(0,0,0,0.68)_65%,transparent_100%)]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.16) 1px, transparent 1.3px), linear-gradient(90deg, var(--accentGlow), transparent 65%)`,
          backgroundSize: "8px 8px, 100% 100%",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(circle at top center, rgb(${acc.color} / 0.18), transparent 42%)` }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <span
          className="rounded-full border px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider"
          style={{
            borderColor: `rgb(${acc.color} / 0.4)`,
            background: `rgb(${acc.color} / 0.12)`,
            color: `rgb(${acc.color})`,
          }}
        >
          {product.tagline}
        </span>
      </div>

      <div className="relative z-10 mt-6 grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-border bg-secondary shadow-[0_6px_14px_hsl(0_0%_0%/0.28)]">
        <div
          className="absolute inset-[-50%] animate-spin-slow opacity-60"
          style={{ background: `conic-gradient(from 180deg, transparent 10%, rgb(${acc.color} / 0.65), transparent 55%)` }}
        />
        <Zap className="relative z-10 h-5 w-5" style={{ color: `rgb(${acc.color})` }} />
      </div>

      <h3 className="relative z-10 mt-4 text-3xl font-extrabold tracking-tight leading-none">{product.name}</h3>
      <div className="relative z-10 mt-2 flex items-center gap-2 text-xs font-bold text-success">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success shadow-[0_0_10px_hsl(var(--success)/0.55)]" />
        {product.status}
      </div>
      <p className="relative z-10 mt-3 min-h-[57px] text-[13.2px] leading-snug text-muted-foreground">{product.description}</p>

      <div className="relative z-10 mt-auto border-t border-border/60 pt-2">
        <div className="flex items-center justify-between gap-3 border-b border-border/40 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Platform</span>
          <span className="text-xs font-bold text-foreground/80">{product.platform}</span>
        </div>
        <div className="flex items-center justify-between gap-3 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Type</span>
          <span className="text-xs font-bold text-foreground/80">{product.type}</span>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
        <div className="flex items-end gap-1.5 whitespace-nowrap">
          <span className="-translate-y-0.5 text-xs font-bold text-muted-foreground">From</span>
          <span className="text-3xl font-black leading-none tracking-tight">${product.pricing.day}</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-xs font-extrabold transition-transform group-hover:scale-[1.02]"
          style={{
            color: "hsl(240 10% 4%)",
            background: `linear-gradient(180deg, rgb(${acc.color}), rgb(${acc.color} / 0.78))`,
            boxShadow: `0 10px 28px ${acc.glow}`,
          }}
        >
          VIEW DETAILS <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
