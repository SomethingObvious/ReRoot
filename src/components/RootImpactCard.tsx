import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Droplets, Wind } from "lucide-react";
import { useState } from "react";

export default function RootImpactCard() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      layout
      className="glass-strong rounded-3xl p-5 relative overflow-hidden"
      whileHover={{ scale: 1.02, boxShadow: "0 16px 50px rgba(139,92,246,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
      onTap={() => setShowTooltip((v) => !v)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="animate-sway origin-bottom inline-block">
            <Leaf className="w-5 h-5 text-success" />
          </div>
          <h3 className="text-sm font-outfit font-semibold text-foreground">Root Impact</h3>
        </div>
        <span className="text-xs font-outfit text-muted-foreground">This Month</span>
      </div>

      <div className="mb-3">
        <p className="text-2xl font-outfit font-bold text-foreground">3.2 kg</p>
        <p className="text-xs font-outfit text-muted-foreground mt-0.5">
          Food Rescued — Equivalent to 8 meals saved from landfill.
        </p>
      </div>

      <div className="h-2 rounded-full bg-success/15 overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(142 71% 65%), hsl(142 71% 45%), hsl(142 71% 30%))",
          }}
          initial={{ width: "0%" }}
          animate={{ width: "64%" }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 bg-success/10 rounded-2xl px-3 py-2.5 flex items-center gap-2">
          <Wind className="w-4 h-4 text-success" />
          <div>
            <p className="text-xs font-outfit font-semibold text-foreground">8.5 kg</p>
            <p className="text-[10px] font-outfit text-muted-foreground">CO₂e Reduced</p>
          </div>
        </div>
        <div className="flex-1 bg-primary/8 rounded-2xl px-3 py-2.5 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs font-outfit font-semibold text-foreground">450 L</p>
            <p className="text-[10px] font-outfit text-muted-foreground">Water Saved</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-2 right-2 text-primary-foreground text-[11px] font-outfit px-3 py-2 rounded-2xl shadow-deep max-w-[200px]"
            style={{ background: "linear-gradient(135deg, hsl(258 90% 55%), hsl(292 84% 50%))" }}
          >
            Based on your average consumption vs. spoil rate.
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
