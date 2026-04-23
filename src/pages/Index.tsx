import { Link } from "react-router-dom";
import { ArrowRight, Shield, Sparkles } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      {/* Hero */}
      <section className="relative flex items-center justify-center px-4 pb-12 pt-8 md:px-6">
        <div className="relative grid w-full max-w-[1280px] overflow-hidden rounded-[28px] border border-border bg-gradient-panel shadow-elegant md:grid-cols-[1.15fr_0.85fr]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 18% 25%, hsl(270 95% 60% / 0.18), transparent 22%), radial-gradient(circle at 70% 18%, hsl(187 100% 56% / 0.15), transparent 20%), radial-gradient(circle at 62% 85%, hsl(330 100% 72% / 0.12), transparent 20%)",
            }}
          />
          <div className="relative z-10 flex flex-col justify-between p-7 md:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-success" />
                All Tools Undetected
              </div>
            </div>

            <span className="mb-6 inline-flex w-max items-center gap-2.5 rounded-full border border-border bg-secondary/40 px-3 py-2 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-success shadow-[0_0_14px_hsl(var(--success)/0.65)]" />
              Beta Yamazz
            </span>

            <div className="my-4 max-w-[640px]">
              <h1 className="m-0 text-[clamp(3rem,8vw,6rem)] font-black leading-[0.88] tracking-[-0.085em]">
                <span className="block text-gradient-brand">The Best</span>
                <span className="block text-gradient-brand">solution for</span>
                <span className="block text-gradient-brand">your tools.</span>
              </h1>
              <p className="mt-5 max-w-[560px] text-base leading-relaxed text-muted-foreground">
                Premium game enhancement tools with daily updates, fair pricing, and a safety-first approach. Your main account stays protected.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-14 rounded-full bg-gradient-cta px-7 text-primary-foreground shadow-glow hover:opacity-95">
                <a href="#products">
                  Explore products <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-14 rounded-full px-7">
                <Link to="/support">
                  <Sparkles className="h-4 w-4" /> Get support
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { label: "Active users", value: "12.4k+" },
                { label: "Uptime", value: "99.9%" },
                { label: "Avg. response", value: "<5min" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="glass translate-y-4 rounded-2xl p-4 opacity-0 [animation:rise_0.9s_cubic-bezier(0.2,0.8,0.2,1)_forwards] shadow-[var(--shadow-card)]"
                  style={{ animationDelay: `${i * 0.12}s` }}
                >
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">{s.label}</div>
                  <div className="mt-2 text-2xl font-black tracking-tight">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero preview */}
          <div className="relative z-10 flex items-center justify-center p-6 md:p-8">
            <div className="relative aspect-[0.83] w-full max-w-[420px] overflow-hidden rounded-[28px] border border-border bg-gradient-panel shadow-elegant [transform:perspective(1200px)_rotateY(-10deg)_rotateX(4deg)]">
              <div className="pointer-events-none absolute inset-0 -translate-x-[120%] animate-shine [background:linear-gradient(120deg,transparent_20%,hsl(0_0%_100%/0.08)_35%,transparent_48%)]" />
              <div className="flex items-center justify-between p-5">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
                </div>
                <span className="text-xs text-foreground/70">yamazz.app</span>
              </div>
              <div className="space-y-4 px-5 pb-5">
                <div className="rounded-3xl border border-border bg-secondary/40 p-4">
                  <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-foreground/20 to-foreground/5" />
                  <div className="mt-3 h-3 w-2/5 rounded-full bg-gradient-to-r from-foreground/20 to-foreground/5" />
                  <div className="mt-5 h-11 w-3/5 rounded-full bg-gradient-to-r from-primary/70 to-accent/80 shadow-glow" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative min-h-[150px] overflow-hidden rounded-2xl border border-border bg-card p-4">
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-70 [mask-image:linear-gradient(180deg,rgba(0,0,0,1),transparent)]"
                      style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.16) 1px, transparent 1.3px), linear-gradient(90deg, hsl(270 95% 60% / 0.28), transparent 68%)",
                        backgroundSize: "8px 8px, 100% 100%",
                      }}
                    />
                    <div className="relative h-9 w-9 rounded-xl border border-border bg-foreground/5" />
                    <div className="relative mt-4 text-base font-extrabold tracking-tight">Always Safe</div>
                    <div className="relative mt-1.5 text-xs leading-snug text-muted-foreground">Stay undetected on your main account.</div>
                  </div>
                  <div className="relative min-h-[150px] overflow-hidden rounded-2xl border border-border bg-card p-4">
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-70 [mask-image:linear-gradient(180deg,rgba(0,0,0,1),transparent)]"
                      style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.16) 1px, transparent 1.3px), linear-gradient(90deg, hsl(187 100% 56% / 0.28), transparent 68%)",
                        backgroundSize: "8px 8px, 100% 100%",
                      }}
                    />
                    <div className="relative h-9 w-9 rounded-xl border border-border bg-foreground/5" />
                    <div className="relative mt-4 text-base font-extrabold tracking-tight">Fair Prices</div>
                    <div className="relative mt-1.5 text-xs leading-snug text-muted-foreground">Quality tools without breaking the bank.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="relative mx-auto mb-20 w-full max-w-[1280px] px-4 pt-6 md:px-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="m-0 text-3xl font-extrabold tracking-tight md:text-5xl">Popular products</h2>
          <a href="#products" className="mt-3 text-sm text-muted-foreground transition-colors hover:text-foreground">
            View all products →
          </a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </div>
      </section>

      <footer className="relative border-t border-border py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Yamazz. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
