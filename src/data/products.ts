export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: string;
  platform: string;
  type: string;
  accent: "purple" | "cyan" | "red" | "pink" | "green" | "blue" | "orange" | "gold";
  pricing: {
    day: number;
    month: number;
    lifetime: number;
  };
  features: { title: string; description: string }[];
  screenshots: { title: string; gradient: string }[];
};

export const products: Product[] = [
  {
    slug: "csgo-2",
    name: "CSGO 2",
    tagline: "Legit and blatant",
    description: "A polished and feature rich external designed to elevate your gameplay safely on your main account.",
    category: "Updated",
    status: "Updated",
    platform: "Windows 10 & 11",
    type: "External",
    accent: "purple",
    pricing: { day: 3.99, month: 14.99, lifetime: 49.99 },
    features: [
      { title: "Smart Aim Assist", description: "Configurable smoothing for natural, legit-looking aim helpers." },
      { title: "ESP Overlay", description: "Player, weapon and grenade ESP rendered through a safe external overlay." },
      { title: "Radar Hack", description: "Standalone radar showing enemy positions in real-time." },
      { title: "Streamproof", description: "Hidden from OBS, Discord, and screenshots by default." },
      { title: "Cloud Configs", description: "Save, share, and load configs across devices instantly." },
      { title: "Auto-Updater", description: "Always up to date with the latest game patches." },
    ],
    screenshots: [
      { title: "In-Game ESP", gradient: "from-purple-500/30 via-fuchsia-500/20 to-cyan-400/20" },
      { title: "Configurator", gradient: "from-cyan-400/30 via-purple-500/20 to-pink-500/20" },
      { title: "Radar View", gradient: "from-pink-500/30 via-purple-500/20 to-cyan-400/20" },
    ],
  },
  {
    slug: "valorant",
    name: "Valorant",
    tagline: "Legit",
    description: "The best undetected aimlock on the market, designed for clean legit play.",
    category: "Updated",
    status: "Updated",
    platform: "Windows 10 & 11",
    type: "External",
    accent: "cyan",
    pricing: { day: 7.99, month: 24.99, lifetime: 79.99 },
    features: [
      { title: "Hardware Aimbot", description: "Mouse-level aim assistance that bypasses anti-cheat scanning." },
      { title: "Triggerbot", description: "Instant fire when crosshair lands on an enemy hitbox." },
      { title: "Recoil Control", description: "Per-weapon recoil patterns for pinpoint accuracy." },
      { title: "HWID Spoofer", description: "Built-in spoofer included with every license tier." },
      { title: "Lightweight", description: "Sub-1% CPU usage, no FPS drops while running." },
      { title: "24/7 Support", description: "Live chat support and detailed setup guides." },
    ],
    screenshots: [
      { title: "Aim Configurator", gradient: "from-cyan-400/30 via-blue-500/20 to-purple-500/20" },
      { title: "Loadout Profiles", gradient: "from-blue-500/30 via-cyan-400/20 to-pink-500/20" },
      { title: "Live Match", gradient: "from-purple-500/30 via-cyan-400/20 to-blue-500/20" },
    ],
  },
  {
    slug: "arc-raiders",
    name: "Arc Raiders",
    tagline: "Legit and blatant",
    description: "The best external with many features for both legit and blatant gameplay.",
    category: "Updated & live",
    status: "Updated & live",
    platform: "Windows 10 & 11",
    type: "External",
    accent: "red",
    pricing: { day: 7.99, month: 22.99, lifetime: 74.99 },
    features: [
      { title: "Full ESP Suite", description: "Players, loot, vehicles, and objectives all visible at a glance." },
      { title: "Aimbot", description: "Configurable FOV, smoothness, and bone targeting." },
      { title: "Loot Filter", description: "Highlight only the gear that matters to you." },
      { title: "No-Spread", description: "Eliminate weapon spread for surgical precision." },
      { title: "Customizable HUD", description: "Drag, resize, and theme every overlay element." },
      { title: "Daily Updates", description: "Hotfixes deployed within hours of game patches." },
    ],
    screenshots: [
      { title: "Raid Overview", gradient: "from-red-500/30 via-orange-500/20 to-pink-500/20" },
      { title: "Loot Highlights", gradient: "from-orange-500/30 via-red-500/20 to-purple-500/20" },
      { title: "Settings Panel", gradient: "from-pink-500/30 via-red-500/20 to-orange-500/20" },
    ],
  },
  {
    slug: "roblox",
    name: "Roblox",
    tagline: "BETA",
    description: "A perfect choice for both staying external and executing LUAVM scripts.",
    category: "Undetected",
    status: "Undetected",
    platform: "Windows 10 & 11",
    type: "External",
    accent: "pink",
    pricing: { day: 2.99, month: 9.99, lifetime: 29.99 },
    features: [
      { title: "LUAVM Executor", description: "Run any LUA script with full LuaU compatibility." },
      { title: "Script Hub", description: "Built-in library of curated, tested scripts." },
      { title: "Auto-Inject", description: "Automatically attaches when you launch a game." },
      { title: "Universal Support", description: "Works across the majority of popular Roblox experiences." },
      { title: "Fast Updates", description: "Patched same-day after Roblox engine updates." },
      { title: "Active Community", description: "Discord with 50k+ members for scripts and help." },
    ],
    screenshots: [
      { title: "Executor UI", gradient: "from-pink-500/30 via-purple-500/20 to-cyan-400/20" },
      { title: "Script Hub", gradient: "from-purple-500/30 via-pink-500/20 to-blue-500/20" },
      { title: "Live Injection", gradient: "from-cyan-400/30 via-pink-500/20 to-purple-500/20" },
    ],
  },
];

export const accentMap: Record<Product["accent"], { color: string; glow: string; text: string }> = {
  purple: { color: "168 85 247", glow: "rgba(168,85,247,0.32)", text: "text-purple-400" },
  cyan: { color: "39 216 226", glow: "rgba(39,216,226,0.34)", text: "text-cyan-400" },
  red: { color: "255 100 100", glow: "rgba(255,100,100,0.28)", text: "text-red-400" },
  pink: { color: "244 114 182", glow: "rgba(244,114,182,0.28)", text: "text-pink-400" },
  green: { color: "34 197 94", glow: "rgba(34,197,94,0.28)", text: "text-green-400" },
  blue: { color: "49 176 255", glow: "rgba(49,176,255,0.30)", text: "text-blue-400" },
  orange: { color: "255 136 85", glow: "rgba(255,136,85,0.26)", text: "text-orange-400" },
  gold: { color: "255 207 90", glow: "rgba(255,207,90,0.24)", text: "text-yellow-400" },
};

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
