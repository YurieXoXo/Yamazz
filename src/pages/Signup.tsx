import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { username },
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created!", description: "Welcome to Yamazz." });
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen">
      <SiteOrbs />
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-md items-center justify-center px-5 py-20">
        <div className="w-full rounded-3xl border border-border bg-gradient-panel p-8 shadow-elegant">
          <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join Yamazz in seconds.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password (min 6 chars)</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-cta text-primary-foreground shadow-glow">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
