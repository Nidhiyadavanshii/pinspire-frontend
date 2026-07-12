import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import {
  Leaf,
  Plane,
  UtensilsCrossed,
  Car,
  Cpu,
  Shirt,
  PawPrint,
  Palette,
  Gamepad2,
  Camera,
  Building2,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Home,
  Compass,
} from "lucide-react";

const categories = [
  { id: "nature", label: "Nature", icon: Leaf },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "cars", label: "Cars", icon: Car },
  { id: "technology", label: "Technology", icon: Cpu },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "animals", label: "Animals", icon: PawPrint },
  { id: "art", label: "Art", icon: Palette },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "architecture", label: "Architecture", icon: Building2 },
  { id: "sports", label: "Sports", icon: Trophy },
];

const topNav = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
];

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.25 },
  }),
};

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeTop, setActiveTop] = useState("home");

  const toggle = useCallback(() => setCollapsed((p) => !p), []);

  const handleCategoryClick = (cat) => {
    setActiveCategory((prev) => (prev === cat.id ? null : cat.id));
    navigate(`/search?q=${encodeURIComponent(cat.label)}`);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="sticky top-0 h-screen flex-shrink-0 border-r border-[#dadad3] bg-[#ffffff] select-none z-40"
      style={{ width: collapsed ? 72 : 240, fontFamily: "'Pin Sans', 'Inter', ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="flex h-full flex-col">
        {/* Collapse toggle */}
        <div className="flex items-center justify-end px-3 pt-4 pb-2">
          <button
            onClick={toggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#33332e] transition-colors duration-200 hover:bg-[#f6f6f3] active:scale-95"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Top nav */}
        <nav className="px-3 pb-2">
          {topNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTop === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTop(item.id)}
                className={[
                  "flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition-all duration-200",
                  isActive
                    ? "bg-[#000000] text-[#ffffff]"
                    : "text-[#33332e] hover:bg-[#f6f6f3]",
                  collapsed ? "justify-center" : "",
                ].join(" ")}
              >
                <Icon size={20} strokeWidth={isActive ? 2.2 : 2} />
                {!collapsed && (
                  <span className="text-[14px] font-bold leading-none">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-[#dadad3]" />

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 pb-1 pt-1">
            <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#91918c]">
              Categories
            </span>
          </div>
        )}

        {/* Category list */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <AnimatePresence>
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleCategoryClick(cat)}
                  className={[
                    "group flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-left transition-all duration-200",
                    isActive
                      ? "bg-[#000000] text-[#ffffff]"
                      : "text-[#33332e] hover:bg-[#f6f6f3]",
                    collapsed ? "justify-center" : "",
                  ].join(" ")}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 2}
                    className={isActive ? "text-[#ffffff]" : "text-[#62625b] group-hover:text-[#262622]"}
                  />
                  {!collapsed && (
                    <span className="text-[14px] font-bold leading-none">
                      {cat.label}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom mini-brand */}
        {!collapsed && (
          <div className="px-5 pb-5 pt-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e60023]">
                <span className="text-[10px] font-extrabold text-white">P</span>
              </div>
              <span className="text-[12px] font-semibold text-[#91918c]">Pinspire</span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
