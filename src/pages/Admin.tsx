import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  KeyRound,
  ShieldX,
  RotateCcw,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Product = {
  id: string;
  name: string;
  slug: string;
};

type LicenseKeyRow = {
  id: string;
  license_key: string;
  duration_days: number;
  status: "unused" | "used" | "revoked";
  used_at: string | null;
  created_at: string;
  product_id: string;
  products: {
    name: string;
    slug: string;
  } | null;
};

const Admin = () => {
  const { user, loading } = useAuth();

  // CHANGE THIS TO YOUR EMAIL
  const adminEmail = "your@email.com";
  const isAdmin = user?.email === adminEmail;

  const [products, setProducts] = useState<Product[]>([]);
  const [keys, setKeys] = useState<LicenseKeyRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [newKey, setNewKey] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [creating, setCreating] = useState(false);

  const [search, setSearch] = useState("");
  const [workingId, setWorkingId] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return keys;

    return keys.filter((key) => {
      const productName = key.products?.name?.toLowerCase() || "";
      const productSlug = key.products?.slug?.toLowerCase() || "";
      return (
        key.license_key.toLowerCase().includes(q) ||
        key.status.toLowerCase().includes(q) ||
        productName.includes(q) ||
        productSlug.includes(q)
      );
    });
  }, [keys, search]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug")
      .order("name", { ascending: true });

    if (error) {
      toast({
        title: "Failed to load products",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setProducts((data as Product[]) || []);
  };

  const fetchKeys = async () => {
    const { data, error } = await supabase
      .from("license_keys")
      .select(
        `
        id,
        license_key,
        duration_days,
        status,
        used_at,
        created_at,
        product_id,
        products (
          name,
          slug
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Failed to load license keys",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setKeys((data as LicenseKeyRow[]) || []);
  };

  const refreshAll = async () => {
    setLoadingData(true);
    await Promise.all([fetchProducts(), fetchKeys()]);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!loading && isAdmin) {
      refreshAll();
    }
  }, [loading, isAdmin]);

  const generateRandomKey = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const chunk = (length: number) =>
      Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

    return `${chunk(5)}-${chunk(5)}-${chunk(5)}-${chunk(5)}`;
  };

  const handleGenerateKey = () => {
    setNewKey(generateRandomKey());
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId) {
      toast({
        title: "Missing product",
        description: "Select a product first.",
        variant: "destructive",
      });
      return;
    }

    if (!newKey.trim()) {
      toast({
        title: "Missing key",
        description: "Enter or generate a license key.",
        variant: "destructive",
      });
      return;
    }

    const parsedDays = Number(durationDays);
    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      toast({
        title: "Invalid duration",
        description: "Duration must be a positive number of days.",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);

    const { error } = await supabase.from("license_keys").insert({
      product_id: selectedProductId,
      license_key: newKey.trim(),
      duration_days: parsedDays,
      status: "unused",
    });

    setCreating(false);

    if (error) {
      toast({
        title: "Failed to create key",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Key created",
      description: "The license key was added successfully.",
    });

    setNewKey("");
    setDurationDays("30");
    await fetchKeys();
  };

  const handleRevokeKey = async (key: LicenseKeyRow) => {
    setWorkingId(key.id);

    const { error: userLicenseError } = await supabase
      .from("user_licenses")
      .update({ status: "revoked" })
      .eq("license_key_id", key.id);

    if (userLicenseError) {
      setWorkingId(null);
      toast({
        title: "Failed to revoke linked license",
        description: userLicenseError.message,
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("license_keys")
      .update({ status: "revoked" })
      .eq("id", key.id);

    setWorkingId(null);

    if (error) {
      toast({
        title: "Failed to revoke key",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Key revoked",
      description: `${key.license_key} is now revoked.`,
    });

    await fetchKeys();
  };

  const handleResetKey = async (key: LicenseKeyRow) => {
    setWorkingId(key.id);

    const { error: deleteUserLicenseError } = await supabase
      .from("user_licenses")
      .delete()
      .eq("license_key_id", key.id);

    if (deleteUserLicenseError) {
      setWorkingId(null);
      toast({
        title: "Failed to clear activation",
        description: deleteUserLicenseError.message,
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("license_keys")
      .update({
        status: "unused",
        used_at: null,
      })
      .eq("id", key.id);

    setWorkingId(null);

    if (error) {
      toast({
        title: "Failed to reset key",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Key reset",
      description: `${key.license_key} can now be used again.`,
    });

    await fetchKeys();
  };

  const handleDeleteKey = async (key: LicenseKeyRow) => {
    const confirmed = window.confirm(
      `Delete key "${key.license_key}"?\n\nThis will also remove any linked user license.`
    );

    if (!confirmed) return;

    setWorkingId(key.id);

    const { error: deleteUserLicenseError } = await supabase
      .from("user_licenses")
      .delete()
      .eq("license_key_id", key.id);

    if (deleteUserLicenseError) {
      setWorkingId(null);
      toast({
        title: "Failed to remove linked activation",
        description: deleteUserLicenseError.message,
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("license_keys")
      .delete()
      .eq("id", key.id);

    setWorkingId(null);

    if (error) {
      toast({
        title: "Failed to delete key",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Key deleted",
      description: `${key.license_key} was removed.`,
    });

    await fetchKeys();
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />

      <main className="relative mx-auto w-full max-w-[1280px] px-4 py-12 md:px-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            <span className="text-gradient-brand">Admin Panel</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create, revoke, reset, and remove license keys.
          </p>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Create license key
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a product, generate or paste a key, then save it.
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleCreateKey}>
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  License key
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.toUpperCase())}
                    placeholder="ABCDE-FGHIJ-KLMNO-PQRST"
                    className="h-12 rounded-2xl"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl"
                    onClick={handleGenerateKey}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Duration (days)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>

              <Button
                type="submit"
                disabled={creating}
                className="h-12 w-full rounded-2xl bg-gradient-cta text-primary-foreground shadow-glow"
              >
                <Plus className="mr-2 h-4 w-4" />
                {creating ? "Creating..." : "Create key"}
              </Button>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  License keys
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage all existing keys.
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search key or product"
                  className="h-11 rounded-2xl pl-9"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loadingData ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Loading keys...
                </div>
              ) : filteredKeys.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No keys found.
                </div>
              ) : (
                filteredKeys.map((key) => (
                  <div
                    key={key.id}
                    className="rounded-2xl border border-border bg-card/50 p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <KeyRound className="h-4 w-4" />
                          <span className="break-all">{key.license_key}</span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span>Product: {key.products?.name || "Unknown"}</span>
                          <span>Status: {key.status}</span>
                          <span>Days: {key.duration_days}</span>
                          <span>
                            Created: {new Date(key.created_at).toLocaleString()}
                          </span>
                          <span>
                            Used:{" "}
                            {key.used_at
                              ? new Date(key.used_at).toLocaleString()
                              : "Not used"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          disabled={workingId === key.id}
                          onClick={() => handleRevokeKey(key)}
                        >
                          <ShieldX className="mr-2 h-4 w-4" />
                          Revoke
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          disabled={workingId === key.id}
                          onClick={() => handleResetKey(key)}
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>

                        <Button
                          variant="destructive"
                          className="rounded-2xl"
                          disabled={workingId === key.id}
                          onClick={() => handleDeleteKey(key)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
