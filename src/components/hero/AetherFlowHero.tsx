import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  onCta?: () => void;
  ctaLabel?: string;
}

export function AetherFlowHero({ onCta, ctaLabel = "Run Autonomous Scan" }: Props) {
  return (
    <section className="relative overflow-hidden isolate min-h-[88vh] flex items-center">
      {/* Aether Flow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          className="absolute top-[10%] right-[8%] h-[38rem] w-[38rem]"
          style={{
            background:
              "conic-gradient(from 120deg, oklch(0.7 0.24 300 / 0.9), oklch(0.65 0.22 255 / 0.9), oklch(0.72 0.24 350 / 0.9), oklch(0.7 0.24 300 / 0.9))",
            filter: "blur(48px)",
            animation: "blob 14s ease-in-out infinite, aurora 22s linear infinite",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] opacity-70"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.7 0.24 300 / 0.9), transparent 60%)",
            filter: "blur(56px)",
            animation: "blob 18s ease-in-out infinite reverse",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-nova-purple" />
            AI Multi-Agent Security Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-semibold tracking-tight text-5xl md:text-7xl leading-[1.02]"
          >
            <span className="text-gradient">novaRAG X</span>
            <br />
            <span className="text-foreground/90">Autonomous API</span>
            <br />
            <span className="text-foreground/70">Pentesting.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            An AI multi-agent engine that discovers endpoints, plans attacks with Gemini, executes
            them, and returns OWASP-classified findings — end-to-end, autonomous.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={onCta}
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-nova-purple via-nova-pink to-nova-blue px-6 py-3 text-sm font-medium text-white glow-purple transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini Ready · Backend Connected
            </div>
          </motion.div>
        </div>

        {/* Right glowing artifact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block h-[540px]"
        >
          <div
            className="absolute inset-8 rounded-[40%] opacity-95"
            style={{
              background:
                "conic-gradient(from 220deg, oklch(0.75 0.24 300), oklch(0.65 0.22 255), oklch(0.75 0.24 340), oklch(0.75 0.24 300))",
              filter: "blur(6px)",
              animation: "blob 12s ease-in-out infinite",
            }}
          />
          <div className="absolute inset-0 rounded-3xl glass" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Engine</div>
              <div className="mt-2 text-4xl font-semibold text-gradient">nova-core.v1</div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-[10px] text-muted-foreground">
                {["Discovery", "Strategy", "Hacker", "Executor", "Critic", "Report"].map((s) => (
                  <div key={s} className="rounded-lg glass px-2 py-1.5">{s}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
