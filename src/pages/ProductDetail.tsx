import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Shield, Zap } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { accentMap, getProduct } from "@/data/products";
import { toast } from "@/hooks/use-toast";

type Tier = "day" | "month" | "lifetime";

const tierMeta: Record<Tier, { label: string; sub: string; perks: string[] }> = {
  day: {
    label: "Day Pass",
    sub: "24 hours of full access",
    perks: ["All features unlocked", "Anti-cheat protection", "Email support"],
  },
  month: {
    label: "Monthly",
    sub: "30 days, best for regulars",
    perks: ["Everything in Day", "Priority support", "Cloud configs", "Save 38% vs daily"],
  },
  lifetime: {
    label: "Lifetime",
    sub: "One-time payment, forever",
    perks: ["Everything in Monthly", "Free future updates", "VIP Discord access", "HWID resets included"],
  },
};

const ProductDetail = () => {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;
  const [selected, setSelected] = useState<Tier>("month");

  if (!product) {
    return (
      <div className="relative min-h-screen">
        <SiteOrbs />
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-3xl font-extrabold">Product not found</h1>
          <p className="mt-3 text-muted-foreground">We couldn't find that product.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const acc = accentMap[product.accent];

  const handleCheckout = () => {
    toast({
      title: `${product.name} — ${tierMeta[selected].label}`,
      description: `Selected tier ready for checkout: $${product.pricing[selected]}`,
    });
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-24 pt-8 md:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        {/* Hero */}
        <section className="relative mt-6 overflow-hidden rounded-[28px] border border-border bg-gradient-panel p-7 shadow-elegant md:p-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(circle at 20% 30%, rgb(${acc.color} / 0.22), transparent 35%), radial-gradient(circle at 80% 0%, rgb(${acc.color} / 0.18), transparent 35%)`,
            }}
          />
          <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-widest"
                style={{ borderColor: `rgb(${acc.color} / 0.4)`, background: `rgb(${acc.color} / 0.1)`, color: `rgb(${acc.color})` }}
              >
                <Zap className="h-3 w-3" /> {product.tagline}
              </span>
              <h1 className="mt-5 text-5xl font-black leading-[0.9] tracking-[-0.06em] md:text-7xl">
                <span className="text-gradient-brand">{product.name}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">{product.description}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="glass rounded-2xl px-4 py-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Platform</div>
                  <div className="mt-1 text-sm font-bold">{product.platform}</div>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Type</div>
                  <div className="mt-1 text-sm font-bold">{product.type}</div>
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Status</div>
                  <div className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-success">
                    <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-success" />
                    {product.status}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card shadow-elegant"
                style={{ background: `linear-gradient(135deg, rgb(${acc.color} / 0.18), hsl(240 10% 6%) 60%)` }}
              >
                <div className="pointer-events-none absolute inset-0 -translate-x-[120%] animate-shine [background:linear-gradient(120deg,transparent_20%,hsl(0_0%_100%/0.08)_35%,transparent_48%)]" />
                <div className="absolute inset-0 grid place-items-center">
                  <div
                    className="grid h-32 w-32 place-items-center rounded-3xl border border-border bg-secondary/60 shadow-glow"
                    style={{ boxShadow: `0 30px 60px ${acc.glow}` }}
                  >
                    <span className="text-5xl font-black tracking-tight">{product.name.charAt(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* License selector */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Choose your license</h2>
              <p className="mt-2 text-sm text-muted-foreground">Pick the plan that fits how you play.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {(Object.keys(tierMeta) as Tier[]).map((tier) => {
              const isSelected = selected === tier;
              const isFeatured = tier === "month";
              return (
                <button
                  key={tier}
                  onClick={() => setSelected(tier)}
                  className={`group relative overflow-hidden rounded-3xl border p-6 text-left transition-all ${
                    isSelected
                      ? "border-transparent bg-gradient-panel shadow-elegant"
                      : "border-border bg-card/50 hover:-translate-y-1 hover:border-foreground/20"
                  }`}
                  style={
                    isSelected
                      ? {
                          boxShadow: `0 0 0 2px rgb(${acc.color} / 0.6), 0 30px 80px ${acc.glow}`,
                        }
                      : undefined
                  }
                >
                  {isFeatured && (
                    <span
                      className="absolute right-4 top-4 rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest"
                      style={{
                        borderColor: `rgb(${acc.color} / 0.4)`,
                        background: `rgb(${acc.color} / 0.12)`,
                        color: `rgb(${acc.color})`,
                      }}
                    >
                      Most popular
                    </span>
                  )}
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{tierMeta[tier].label}</div>
                  <div className="mt-4 flex items-end gap-1.5">
                    <span className="text-5xl font-black tracking-tight">${product.pricing[tier]}</span>
                    <span className="mb-1.5 text-sm font-medium text-muted-foreground">
                      {tier === "lifetime" ? "/once" : tier === "month" ? "/mo" : "/day"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{tierMeta[tier].sub}</p>

                  <ul className="mt-5 space-y-2.5">
                    {tierMeta[tier].perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: `rgb(${acc.color})` }} />
                        <span className="text-foreground/85">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-gradient-panel p-6 md:flex-row">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-success" />
              Secure checkout · Instant delivery · Refund policy applies
            </div>
            <Button
              size="lg"
              onClick={handleCheckout}
              className="h-14 rounded-full bg-gradient-cta px-8 text-primary-foreground shadow-glow hover:opacity-95"
            >
              Checkout — ${product.pricing[selected]}
            </Button>
          </div>
        </section>

        {/* Screenshots */}
        <section className="mt-16">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Screenshots</h2>
          <p className="mt-2 text-sm text-muted-foreground">A look at the interface and in-game overlays.</p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {product.screenshots.map((shot, i) => (
              <div
                key={shot.title}
                className={`relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${shot.gradient} shadow-elegant`}
              >
                <div className="absolute inset-0 [background:radial-gradient(circle_at_1px_1px,hsl(0_0%_100%/0.12)_1px,transparent_1.3px)] [background-size:14px_14px] opacity-50" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="rounded-2xl border border-border bg-background/40 px-5 py-3 text-sm font-bold backdrop-blur-md">
                    {shot.title}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-background/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur">
                  {String(i + 1).padStart(2, "0")} / {String(product.screenshots.length).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-16">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Features</h2>
          <p className="mt-2 text-sm text-muted-foreground">Everything you get with {product.name}.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-gradient-panel p-6 transition-all hover:-translate-y-1 hover:border-foreground/15"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-20 opacity-60 [mask-image:linear-gradient(180deg,rgba(0,0,0,1),transparent)]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, hsl(0 0% 100% / 0.16) 1px, transparent 1.3px), linear-gradient(90deg, rgb(${acc.color} / 0.22), transparent 70%)`,
                    backgroundSize: "8px 8px, 100% 100%",
                  }}
                />
                <div
                  className="relative grid h-11 w-11 place-items-center rounded-xl border border-border bg-secondary"
                  style={{ boxShadow: `0 8px 20px ${acc.glow}` }}
                >
                  <Zap className="h-5 w-5" style={{ color: `rgb(${acc.color})` }} />
                </div>
                <h3 className="relative mt-5 text-lg font-extrabold tracking-tight">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetail;
