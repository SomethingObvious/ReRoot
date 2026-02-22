import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { FRIDGE_ITEMS, type FridgeItem } from "@/lib/mockData";
import IngredientDetail from "@/components/IngredientDetail";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

function urgencyRing(daysLeft: number, totalDays: number) {
  const pct = daysLeft / totalDays;
  if (pct > 0.5) return "hsl(142 71% 45%)";
  if (pct > 0.25) return "hsl(45 93% 47%)";
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
  const [items, setItems] = useState<FridgeItem[]>([...FRIDGE_ITEMS].sort((a, b) => a.daysLeft - b.daysLeft));
  const [selectedItem, setSelectedItem] = useState<FridgeItem | null>(null);

  const handleUpdateRemaining = (id: string, value: number) => {
    setItems((prev) =>
      value === 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, remaining: value } : i))
    );
    if (value === 0) setSelectedItem(null);
    else setSelectedItem((prev) => (prev?.id === id ? { ...prev, remaining: value } : prev));
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
        <motion.p variants={fadeUp} className="text-sm font-outfit text-muted-foreground mb-5">
          Track freshness & reduce waste 🥬
        </motion.p>

        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03, boxShadow: "0 14px 40px rgba(139,92,246,0.18)" }}
              onClick={() => setSelectedItem(item)}
              className="glass-strong rounded-3xl p-4 flex flex-col items-center gap-2 cursor-pointer"
            >
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
          />
        )}
      </AnimatePresence>
    </>
  );
}