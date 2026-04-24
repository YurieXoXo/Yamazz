import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  KeyRound,
  LogOut,
  ShieldCheck,
  Wallet,
  Download,
  Activity,
  ShoppingCart,
} from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type UserLicense = {
  id: string;
  status: string;
  activated_at: string;
  expires_at: string | null;
  product_id: string;
  products: {
    name: string;
    slug: string;
  } | null;
};

type PurchaseTicket = {
  id: string;
  product_name: string;
  tier: string;
  price: number;
  payment_method: string;
  status: string;
  license_key: string | null;
  created_at: string;
};

const DUMMY_DOWNLOAD_URL =
  "https://www.mediafire.com/file/2s9ccmzwdv4lhhd/favicon.ico/file";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [licenseKey, setLicenseKey] = useState("");
  const [activating, setActivating] = useState(false);
  const [loadingLicenses, setLoadingLicenses] = useState(true);
  const [licenses, setLicenses] = useState<UserLicense[]>([]);
  const [purchaseTickets, setPurchaseTickets] = useState<PurchaseTicket[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  const displayName =
    (user?.user_metadata?.username as string) ||
    user?.email?.split("@")[0] ||
    "there";

  const stats = [
    { label: "Active licenses", value: String(licenses.length), icon: KeyRound },
    { label: "Wallet balance", value: "$0.00", icon: Wallet },
    { label: "Downloads", value: "0", icon: Download },
    { label: "Sessions", value: "0h", icon: Activity },
  ];

  const fetchLicenses = async () => {
    setLoadingLicenses(true);

    const { data, error } = await supabase
      .from("user_licenses")
      .select(
        `
        id,
        status,
        activated_at,
        expires_at,
        product_id,
        products (
          name,
          slug
        )
      `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false });

    setLoadingLicenses(false);

    if (error) {
      toast({
        title: "Failed to load licenses",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLicenses((data as UserLicense[]) || []);
  };

  const fetchPurchaseTickets = async () => {
    setLoadingPurchases(true);

    const { data, error } = await supabase
      .from("purchase_tickets")
      .select(
        "id, product_name, tier, price, payment_method, status, license_key, created_at"
      )
      .order("created_at", { ascending: false });

    setLoadingPurchases(false);

    if (error) {
      toast({
        title: "Failed to load purchase tickets",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPurchaseTickets((data as PurchaseTicket[]) || []);
  };

  useEffect(() => {
    fetchLicenses();
    fetchPurchaseTickets();
  }, []);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!licenseKey.trim()) {
      toast({
        title: "Missing license key",
        description: "Please enter a valid license key.",
        variant: "destructive",
      });
      return;
    }

    setActivating(true);

    const { data, error } = await supabase.rpc("activate_license_key", {
      input_key: licenseKey.trim(),
    });

    setActivating(false);

    if (error) {
      toast({
        title: "Activation failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (!data?.success) {
      toast({
        title: "Activation failed",
        description: data?.message || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "License activated",
      description: `${data.product} activated successfully.`,
    });

    setLicenseKey("");
    fetchLicenses();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Signed out",
      description: "You have been logged out.",
    });

    navigate("/login", { replace: true });
  };

  const handleDownload = () => {
    window.open(DUMMY_DOWNLOAD_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1280px] px-4 py-12 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              <span className="text-gradient-brand">Welcome, {displayName}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
              Activate and manage your licenses.
            </p>
          </div>

          <Button onClick={handleLogout} variant="outline" className="rounded-2xl">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-3xl p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </span>
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 text-3xl font-black tracking-tight">
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Activate license
            </h2>

            <form className="mt-6 space-y-4" onSubmit={handleActivate}>
              <Input
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Enter your license key"
                className="h-12 rounded-2xl"
              />

              <Button
                type="submit"
                disabled={activating}
                className="h-12 w-full rounded-2xl bg-gradient-cta text-primary-foreground shadow-glow"
              >
                {activating ? "Activating..." : "Activate license"}
              </Button>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Your licenses
            </h2>

            <div className="mt-6 space-y-4">
              {loadingLicenses ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Loading licenses...
                </div>
              ) : licenses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No active licenses yet.
                </div>
              ) : (
                licenses.map((license) => (
                  <div
                    key={license.id}
                    className="rounded-2xl border border-border bg-card/50 p-5"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <KeyRound className="h-4 w-4" />
                          {license.products?.name || "Unknown product"}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Status: {license.status}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Expires:{" "}
                            {license.expires_at
                              ? new Date(license.expires_at).toLocaleString()
                              : "Never"}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={handleDownload}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="text-2xl font-extrabold tracking-tight">
              Purchase tickets
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Re-open your payment tickets here.
          </p>

          <div className="mt-6 space-y-4">
            {loadingPurchases ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Loading purchase tickets...
              </div>
            ) : purchaseTickets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No purchase tickets yet.
              </div>
            ) : (
              purchaseTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-border bg-card/50 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-lg font-bold">
                        {ticket.product_name}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <span>Plan: {ticket.tier}</span>
                        <span>Price: ${ticket.price}</span>
                        <span>Payment: {ticket.payment_method}</span>
                        <span>Status: {ticket.status}</span>
                      </div>
                    </div>

                    <Button asChild variant="outline" className="rounded-2xl">
                      <Link to={`/purchase/${ticket.id}`}>Open ticket</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
