import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.25em] text-nova-purple mb-2">
            {eyebrow}
          </div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-semibold tracking-tight"
        >
          {title}
        </motion.h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
