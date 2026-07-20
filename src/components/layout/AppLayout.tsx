import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PlayCircle,
  Target,
  ShieldAlert,
  History,
  FileText,
  Settings,
  Home,
  Sparkles,
} from "lucide-react";
import { AppleDock } from "@/components/dock/AppleDock";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Run Scan", to: "/scan", icon: PlayCircle },
  { label: "Attack Strategy", to: "/strategy", icon: Target },
  { label: "Findings", to: "/findings", icon: ShieldAlert },
  { label: "Attack History", to: "/history", icon: History },
  { label: "Reports", to: "/reports", icon: FileText },
  { label: "Settings", to: "/settings", icon: Settings },
];

const dockItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Run Scan", to: "/scan", icon: PlayCircle },
  { label: "Findings", to: "/findings", icon: ShieldAlert },
  { label: "History", to: "/history", icon: History },
  { label: "Reports", to: "/reports", icon: FileText },
];

export function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";

  return (
    <div className="relative min-h-screen">
      <TopNavbar />
      <div className="flex">
        {!isLanding && <Sidebar />}
        <main className={`flex-1 min-w-0 ${isLanding ? "" : "pl-0 lg:pl-4"} pb-32`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AppleDock items={dockItems} />
    </div>
  );
}

function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-white/5">
      <div className="mx-auto max-w-[1600px] flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-nova-purple via-nova-pink to-nova-blue grid place-items-center glow-purple">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight leading-tight">
              novaRAG <span className="text-gradient">X</span>
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              Autonomous AI API Penetration Testing Platform
            </div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <StatusPill color="emerald" label="Backend Connected" />
          <StatusPill color="purple" label="Gemini Ready" />
          <StatusPill color="blue" label="Target Loaded" />
        </div>
      </div>
    </header>
  );
}

function StatusPill({ color, label }: { color: "emerald" | "purple" | "blue"; label: string }) {
  const map = {
    emerald: "bg-emerald-400",
    purple: "bg-fuchsia-400",
    blue: "bg-sky-400",
  } as const;
  return (
    <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] text-muted-foreground">
      <span className={`h-1.5 w-1.5 rounded-full ${map[color]} animate-pulse`} />
      {label}
    </div>
  );
}

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:block sticky top-[65px] h-[calc(100vh-65px)] w-60 shrink-0 border-r border-white/5 bg-sidebar/40 backdrop-blur-xl">
      <nav className="p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-gradient-to-r from-nova-purple/20 to-nova-blue/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="side-active"
                  className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-nova-purple to-nova-blue"
                />
              )}
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 mt-2">
        <div className="rounded-xl glass p-3 text-xs text-muted-foreground">
          <div className="text-[10px] uppercase tracking-widest text-nova-purple mb-1">Engine</div>
          Multi-agent pipeline powered by Gemini AI. Discovery → Strategy → Hacker → Executor →
          Critic.
        </div>
      </div>
    </aside>
  );
}
