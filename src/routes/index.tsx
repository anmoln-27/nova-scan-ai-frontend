import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AetherFlowHero } from "@/components/hero/AetherFlowHero";
import { motion } from "framer-motion";
import { Bot, Workflow, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div>
      <AetherFlowHero onCta={() => navigate({ to: "/scan" })} />
      <FeatureCards />
    </div>
  );
}

const features = [
  {
    icon: Bot,
    title: "Autonomous AI",
    desc: "A Gemini-powered multi-agent pipeline discovers endpoints, plans attacks, executes them, and self-critiques results — with zero human intervention.",
    color: "from-nova-purple to-nova-pink",
  },
  {
    icon: Workflow,
    title: "Business Logic Testing",
    desc: "Detects real-world flaws beyond fuzzing: broken authorization, negative amounts, self-transfers, and missing validation on sensitive flows.",
    color: "from-nova-blue to-nova-purple",
  },
  {
    icon: ShieldCheck,
    title: "OWASP Classification",
    desc: "Every finding is auto-mapped to OWASP API Top-10 categories with severity, confidence, business impact, and a concrete remediation.",
    color: "from-nova-pink to-nova-blue",
  },
];

function FeatureCards() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="grid gap-5 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl glass p-6"
            >
              <div
                className={`absolute -top-24 -right-16 h-56 w-56 rounded-full bg-gradient-to-br ${f.color} opacity-30 blur-3xl transition-opacity group-hover:opacity-50`}
              />
              <div className="relative">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white glow-purple`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
