import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Sparkles, ArrowUpDown } from "lucide-react";
import { useFridge } from "@/lib/fridgeContext";
import type { FridgeItem } from "@/lib/mockData";
import IngredientDetail from "@/components/IngredientDetail";

type SortMode = "expiry" | "purchase" | "category";
const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "expiry", label: "Expiry" },
  { value: "purchase", label: "Purchased" },
  { value: "category", label: "Category" },
];
const CATEGORY_ORDER: Record<string, number> = { Meat: 0, Produce: 1, Dairy: 2, Frozen: 3, Grocery: 4 };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

function urgencyRing(daysLeft: number, totalDays: number) {
  const pct = daysLeft / totalDays;
  if (pct > 0.4) return "hsl(142 71% 45%)";
  if (pct > 0.15) return "hsl(45 93% 47%)";
  return "hsl(0 84% 60%)";
}

function CircularProgress({ daysLeft, totalDays, size = 44 }: { daysLeft: number; totalDays: number; size?: number }) {
  const stroke = 3.5;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, daysLeft / totalDays);
  const offset = circumference * (1 - pct);
  const color = urgencyRing(daysLeft, totalDays);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(270 25% 93%)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        />
      </svg>
      <span className="absolute text-[10px] font-outfit font-bold text-foreground">{daysLeft}d</span>
    </div>
  );
}

export default function Fridge() {
  const { fridgeItems, setFridgeItems } = useFridge();
  const [selectedItem, setSelectedItem] = useState<FridgeItem | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("expiry");
  const [sortAsc, setSortAsc] = useState(true);

  const sortedItems = useMemo(() => {
    const items = [...fridgeItems];
    const dir = sortAsc ? 1 : -1;
    switch (sortMode) {
      case "expiry":
        return items.sort((a, b) => (a.daysLeft - b.daysLeft) * dir);
      case "purchase":
        return items.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate) * dir);
      case "category":
        return items.sort((a, b) => ((CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99)) * dir);
      default:
        return items;
    }
  }, [fridgeItems, sortMode, sortAsc]);

  const handleUpdateRemaining = (id: string, value: number) => {
    setFridgeItems((prev) =>
      value === 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, remaining: value } : i))
    );
    if (value === 0) setSelectedItem(null);
    else setSelectedItem((prev) => (prev?.id === id ? { ...prev, remaining: value } : prev));
  };

  const handleUpdateName = (id: string, name: string) => {
    setFridgeItems((prev) => prev.map((i) => (i.id === id ? { ...i, name } : i)));
    setSelectedItem((prev) => (prev?.id === id ? { ...prev, name } : prev));
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setFridgeItems((prev) => prev.map((i) => (i.id === id ? { ...i, notes } : i)));
    setSelectedItem((prev) => (prev?.id === id ? { ...prev, notes } : prev));
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="px-5 pt-14 pb-32 max-w-lg mx-auto"
      >
        <motion.h1 variants={fadeUp} className="text-2xl font-outfit font-bold text-foreground mb-1">
          My Fridge
        </motion.h1>
        <motion.p variants={fadeUp} className="text-sm font-outfit text-muted-foreground mb-4">
          Track freshness & reduce waste 🥬
        </motion.p>

        {/* Sort Pills */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setSortAsc((prev) => !prev)}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform"
            style={{
              background: "rgba(245, 240, 255, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(167, 139, 250, 0.25)",
              boxShadow: "0 2px 8px rgba(139,92,246,0.08), inset 0 1px 2px rgba(255,255,255,0.5)",
              transform: sortAsc ? "rotate(0deg)" : "rotate(180deg)",
            }}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                if (sortMode === opt.value) return;
                setSortMode(opt.value);
                setSortAsc(true);
              }}
              className="px-3 py-1.5 rounded-full text-[11px] font-outfit font-semibold transition-colors"
              style={sortMode === opt.value ? {
                background: "rgba(245, 240, 255, 0.6)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(167, 139, 250, 0.3)",
                boxShadow: "0 2px 12px rgba(139,92,246,0.1), inset 0 1px 2px rgba(255,255,255,0.5)",
                color: "hsl(var(--foreground))",
              } : { border: "1px solid transparent", color: "hsl(var(--muted-foreground))" }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {sortedItems.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03, boxShadow: "0 14px 40px rgba(139,92,246,0.18)" }}
              onClick={() => setSelectedItem(item)}
              className="glass-strong rounded-3xl p-4 flex flex-col items-center gap-2 cursor-pointer relative"
            >
              {item.isNew && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                  className="absolute -top-2 -right-2 z-10 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-outfit font-bold text-white"
                  style={{ background: "linear-gradient(135deg, hsl(258 90% 66%), hsl(292 84% 61%))" }}
                >
                  <Sparkles className="w-2.5 h-2.5" /> NEW
                </motion.div>
              )}
              <span className="text-3xl">{item.icon}</span>
              <CircularProgress daysLeft={item.daysLeft} totalDays={item.totalDays} />
              <p className="text-xs font-outfit font-semibold text-foreground text-center leading-tight">{item.name}</p>
              <p className="text-[10px] font-outfit text-muted-foreground">{item.weight}</p>
              {item.daysLeft <= 2 && (
                <div className="flex items-center gap-1 text-destructive text-[10px] font-outfit font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Use now!
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <IngredientDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onUpdateRemaining={handleUpdateRemaining}
            onUpdateName={handleUpdateName}
            onUpdateNotes={handleUpdateNotes}
          />
        )}
      </AnimatePresence>
    </>
  );
}
