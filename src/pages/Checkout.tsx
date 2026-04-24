import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CreditCard, MessageSquare } from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { getProduct } from "@/data/products";

type PaymentMethod = "paypal" | "crypto" | "bank" | "other";
type Tier = "day" | "month" | "lifetime";

const paymentMethods: { id: PaymentMethod; label: string; description: string }[] = [
  { id: "paypal", label: "PayPal", description: "Pay with PayPal after admin confirms details." },
  { id: "crypto", label: "Crypto", description: "Admin will send crypto payment details in the ticket." },
  { id: "bank", label: "Bank transfer", description: "Admin will send bank/payment instructions." },
  { id: "other", label: "Other", description: "Discuss another payment method with admin." },
];

const Checkout = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const product = slug ? getProduct(slug) : undefined;
  const tierParam = searchParams.get("tier") as Tier | null;
  const tier: Tier = tierParam === "day" || tierParam === "month" || tierParam === "lifetime" ? tierParam : "month";

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paypal");
  const [creating, setCreating] = useState(false);

  const price = useMemo(() => {
    if (!product) return 0;
    return product.pricing[tier];
  }, [product, tier]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!product) {
    return (
      <div className="relative min-h-screen">
        <SiteOrbs />
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-3xl font-extrabold">Product not found</h1>
          <p className="mt-3 text-muted-foreground">We couldn't find that product.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to home</Link>
          </Button>
        </main>
      </div>
    );
  }

  const handleCreatePurchaseTicket = async () => {
    setCreating(true);

    const { data, error } = await supabase
      .from("purchase_tickets")
      .insert({
        user_id: user.id,
        email: user.email || "unknown",
        product_slug: product.slug,
        product_name: product.name,
        tier,
        price,
        payment_method: paymentMethod,
        status: "open",
      })
      .select("id")
      .single();

    setCreating(false);

    if (error) {
      toast({
        title: "Failed to create purchase ticket",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase ticket created",
      description: "You can now chat with admin about payment.",
    });

    navigate(`/purchase/${data.id}`);
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1000px] px-4 py-12 md:px-6">
        <Link
          to={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to product
        </Link>

        <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant md:p-8">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Select payment type
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Choose how you want to pay. This will open a purchase ticket with admin.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card/50 p-5">
            <div className="text-sm text-muted-foreground">Order summary</div>
            <div className="mt-2 text-2xl font-black">{product.name}</div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>Plan: {tier}</span>
              <span>Price: ${price}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {paymentMethods.map((method) => {
              const active = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`rounded-2xl border p-5 text-left transition-all ${
                    active
                      ? "border-foreground/30 bg-secondary/70 shadow-elegant"
                      : "border-border bg-card/40 hover:border-foreground/20 hover:bg-secondary/40"
                  }`}
                >
                  <div className="text-lg font-extrabold">{method.label}</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handleCreatePurchaseTicket}
            disabled={creating}
            className="mt-8 h-14 w-full rounded-2xl bg-gradient-cta text-primary-foreground shadow-glow"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {creating ? "Creating ticket..." : "Open purchase ticket"}
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Checkout;
