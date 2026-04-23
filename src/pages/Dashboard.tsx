import SiteHeader from "@/components/SiteHeader";
import SiteOrbs from "@/components/SiteOrbs";
import { Activity, Download, Key, Wallet } from "lucide-react";

const stats = [
  { label: "Active licenses", value: "3", icon: Key },
  { label: "Wallet balance", value: "$24.50", icon: Wallet },
  { label: "Downloads", value: "12", icon: Download },
  { label: "Sessions", value: "87h", icon: Activity },
];

const Dashboard = () => (
  <div className="relative min-h-screen">
    <SiteOrbs />
    <SiteHeader />
    <main className="relative mx-auto w-full max-w-[1280px] px-4 py-12 md:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
        <span className="text-gradient-brand">Dashboard</span>
      </h1>
      <p className="mt-2 text-muted-foreground">Manage your licenses, downloads and account.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-3xl p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-3 text-3xl font-black tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
          <h2 className="text-xl font-extrabold tracking-tight">Your licenses</h2>
          <div className="mt-5 divide-y divide-border">
            {[
              { name: "CSGO 2", tier: "Monthly", expires: "in 14 days" },
              { name: "Valorant", tier: "Lifetime", expires: "never" },
              { name: "Roblox", tier: "Day Pass", expires: "in 6 hours" },
            ].map((l) => (
              <div key={l.name} className="flex items-center justify-between py-4">
                <div>
                  <div className="font-extrabold">{l.name}</div>
                  <div className="text-xs text-muted-foreground">Expires {l.expires}</div>
                </div>
                <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-bold">
                  {l.tier}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-gradient-panel p-6 shadow-elegant">
          <h2 className="text-xl font-extrabold tracking-tight">Quick actions</h2>
          <div className="mt-5 space-y-3">
            {["Download loader", "Reset HWID", "Generate API key", "View invoices"].map((a) => (
              <button
                key={a}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card/50 px-4 py-3 text-sm font-semibold transition-colors hover:border-foreground/20 hover:bg-secondary/60"
              >
                {a} <span className="text-muted-foreground">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
);

export default Dashboard;
