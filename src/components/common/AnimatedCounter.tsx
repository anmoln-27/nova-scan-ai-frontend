import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function AnimatedCounter({
  value,
  duration = 1.2,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const controls = animate(prev.current, value || 0, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    prev.current = value || 0;
    return () => controls.stop();
  }, [value, duration]);
  return (
    <span className="tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
