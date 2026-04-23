import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, LifeBuoy, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 -z-10 bg-background/70 backdrop-blur-xl border-b border-border" />
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight">
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-border bg-card shadow-glow">
            <span className="absolute inset-[-35%] animate-spin-slow [background:conic-gradient(from_180deg,transparent,hsl(var(--primary)/0.8),hsl(var(--accent)/0.8),transparent_70%)]" />
            <span className="relative z-10 text-base font-black">Y</span>
          </span>
          <span className="text-lg">Yamazz</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: "Home" },
            { to: "/#products", label: "Products" },
            { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { to: "/support", label: "Support", icon: LifeBuoy },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`
              }
              end={item.to === "/"}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-cta text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/signup">
              <UserPlus className="h-4 w-4" />
              Sign up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
