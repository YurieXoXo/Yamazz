import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-md items-center justify-center px-5 py-20">
        <div className="w-full rounded-3xl border border-border bg-gradient-panel p-8 shadow-elegant">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your Yamazz account.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-cta text-primary-foreground shadow-glow">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-foreground hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
