import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface DockItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export function AppleDock({ items }: { items: DockItem[] }) {
  const mouseX = useMotionValue(Infinity);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 flex items-end gap-2 rounded-2xl glass px-3 py-2 glow-purple"
    >
      {items.map((item) => (
        <DockIcon key={item.to} mouseX={mouseX} item={item} active={pathname === item.to} />
      ))}
    </motion.div>
  );
}

function DockIcon({
  mouseX,
  item,
  active,
}: {
  mouseX: MotionValue<number>;
  item: DockItem;
  active: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeSync = useTransform(distance, [-140, 0, 140], [42, 66, 42]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 180, damping: 14 });
  const Icon = item.icon;

  return (
    <Link
      ref={ref}
      to={item.to}
      className="group relative flex items-center justify-center"
      aria-label={item.label}
    >
      <motion.div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-xl border border-white/10 ${
          active
            ? "bg-gradient-to-br from-nova-purple/40 to-nova-blue/40 text-white"
            : "bg-white/5 text-foreground/80 hover:text-white"
        }`}
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md glass px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        {item.label}
      </span>
    </Link>
  );
}
