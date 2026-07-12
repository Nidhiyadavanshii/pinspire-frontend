import React from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
//  Pinterest-inspired loading skeleton for pins / comments / grids
/* ------------------------------------------------------------------ */

const shimmer = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 1.4,
      ease: "easeInOut",
    },
  },
};

/* ------------------------------------------------------------------ */
//  Reusable shimmer overlay
/* ------------------------------------------------------------------ */
function ShimmerOverlay({ rounded = "rounded-[16px]" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${rounded}`}>
      <motion.div
        variants={shimmer}
        initial="initial"
        animate="animate"
        className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
//  Single pin-card skeleton (masonry tile)
/* ------------------------------------------------------------------ */
export function PinSkeleton({ heightClass = "h-64" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative w-full overflow-hidden rounded-[16px] bg-[#f6f6f3]"
      style={{ fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
    >
      {/* Image placeholder */}
      <div className={`relative w-full ${heightClass} bg-[#e5e5e0]`}>
        <ShimmerOverlay rounded="rounded-t-[16px]" />
      </div>

      {/* Meta placeholder */}
      <div className="p-2 space-y-2">
        <div className="relative h-3 w-3/4 rounded-full bg-[#e5e5e0]">
          <ShimmerOverlay rounded="rounded-full" />
        </div>
        <div className="relative h-3 w-1/2 rounded-full bg-[#e5e5e0]">
          <ShimmerOverlay rounded="rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
//  Comment row skeleton
/* ------------------------------------------------------------------ */
export function CommentSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 py-3"
      style={{ fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
    >
      {/* Avatar */}
      <div className="relative h-9 w-9 flex-shrink-0 rounded-full bg-[#e5e5e0]">
        <ShimmerOverlay rounded="rounded-full" />
      </div>

      {/* Text lines */}
      <div className="flex-1 space-y-2">
        <div className="relative h-3 w-24 rounded-full bg-[#e5e5e0]">
          <ShimmerOverlay rounded="rounded-full" />
        </div>
        <div className="relative h-3 w-full rounded-full bg-[#e5e5e0]">
          <ShimmerOverlay rounded="rounded-full" />
        </div>
        <div className="relative h-3 w-5/6 rounded-full bg-[#e5e5e0]">
          <ShimmerOverlay rounded="rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
//  Masonry grid skeleton (default 5-col on desktop)
/* ------------------------------------------------------------------ */
export function MasonrySkeleton({ columns = 5, count = 15 }) {
  // Vary heights to mimic real masonry
  const heights = [
    "h-48",
    "h-64",
    "h-56",
    "h-72",
    "h-52",
    "h-80",
    "h-60",
    "h-44",
    "h-68",
    "h-56",
    "h-72",
    "h-48",
    "h-64",
    "h-52",
    "h-76",
  ];

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif",
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <PinSkeleton key={i} heightClass={heights[i % heights.length]} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
//  Comments list skeleton
/* ------------------------------------------------------------------ */
export function CommentsSkeleton({ count = 4 }) {
  return (
    <div
      className="space-y-1"
      style={{ fontFamily: "'Pin Sans', 'ui-sans-serif', 'system-ui', sans-serif" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
//  Default export — auto-detects context by prop or falls back to masonry
/* ------------------------------------------------------------------ */
export default function LoadingSkeleton({ mode = "masonry", count, columns }) {
  if (mode === "comments") {
    return <CommentsSkeleton count={count ?? 4} />;
  }

  if (mode === "pin") {
    return <PinSkeleton />;
  }

  // Default masonry grid
  return <MasonrySkeleton columns={columns ?? 5} count={count ?? 15} />;
}
