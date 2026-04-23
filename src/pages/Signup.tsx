import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => (
  <div className="relative min-h-screen">
    <SiteOrbs />
    <SiteHeader />
    <main className="relative mx-auto flex w-full max-w-md items-center justify-center px-5 py-20">
      <div className="w-full rounded-3xl border border-border bg-gradient-panel p-8 shadow-elegant">
        <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Join Yamazz in seconds.</p>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="yourname" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button className="w-full bg-gradient-cta text-primary-foreground shadow-glow">Create account</Button>
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

export default Signup;
