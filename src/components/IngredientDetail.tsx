import { motion, AnimatePresence } from "framer-motion";
import { X, ChefHat, Lightbulb, Clock, Star, AlertTriangle, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { FridgeItem } from "@/lib/mockData";

const categoryImages: Record<string, string> = {
  Produce: "linear-gradient(135deg, hsl(142 60% 70%), hsl(142 50% 45%))",
  Meat: "linear-gradient(135deg, hsl(0 60% 75%), hsl(0 50% 50%))",
  Dairy: "linear-gradient(135deg, hsl(200 70% 85%), hsl(220 50% 65%))",
  Pantry: "linear-gradient(135deg, hsl(35 70% 75%), hsl(25 60% 50%))",
};

const categoryEmoji: Record<string, string> = {
  Produce: "🥬", Meat: "🥩", Dairy: "🧈", Pantry: "🫙",
};

interface Props {
  item: FridgeItem;
  onClose: () => void;
  onUpdateRemaining: (id: string, value: number) => void;
}

function freshnessStatus(daysLeft: number, totalDays: number) {
  const pct = daysLeft / totalDays;
  if (pct > 0.5) return { label: "Peak Freshness 🌟", color: "hsl(142 71% 45%)" };
  if (pct > 0.25) return { label: `${daysLeft} Days Left ⚠️`, color: "hsl(45 93% 47%)" };
  return { label: `${daysLeft} Days Left 🚨`, color: "hsl(0 84% 60%)" };
}

export default function IngredientDetail({ item, onClose, onUpdateRemaining }: Props) {
  const status = freshnessStatus(item.daysLeft, item.totalDays);
  const freshPct = Math.min(100, Math.round((item.daysLeft / item.totalDays) * 100));

  // Freshness bar segments
  const greenEnd = 60;
  const yellowEnd = 85;

  return (
    <AnimatePresence>
      <motion.div
        key="ingredient-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        key="ingredient-detail"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed inset-x-0 bottom-0 top-0 z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-h-full pt-12">
          <div className="max-w-lg mx-auto rounded-t-[2rem] overflow-hidden glass-strong" style={{ minHeight: "calc(100vh - 3rem)" }}>
            {/* Header Image */}
            <div className="aspect-video relative flex items-center justify-center" style={{ background: categoryImages[item.category] || categoryImages.Produce }}>
              <span className="text-8xl drop-shadow-lg">{item.icon}</span>
              <span className="absolute top-3 right-14 text-5xl opacity-20">{categoryEmoji[item.category]}</span>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full glass flex items-center justify-center"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            <div className="px-5 pb-32 -mt-4 relative">
              {/* Title */}
              <div className="glass-strong rounded-2xl p-4 mb-4">
                <h2 className="text-xl font-outfit font-bold text-foreground">{item.name}</h2>
                <p className="text-xs font-outfit text-muted-foreground mt-0.5">
                  Purchased at {item.store} • {item.purchaseDate} • ${item.price.toFixed(2)}
                </p>
                <p className="text-xs font-outfit text-muted-foreground mt-0.5">{item.weight} remaining</p>
              </div>

              {/* Freshness Meter */}
              <div className="glass-strong rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-outfit font-semibold text-foreground">Freshness Meter</h3>
                  <span className="text-xs font-outfit font-semibold" style={{ color: status.color }}>{status.label}</span>
                </div>

                {/* Bar */}
                <div className="relative h-3 rounded-full overflow-hidden bg-muted mb-3">
                  <div className="absolute inset-0 flex">
                    <div className="h-full rounded-l-full" style={{ width: `${greenEnd}%`, background: "linear-gradient(90deg, hsl(142 71% 55%), hsl(142 71% 45%))" }} />
                    <div className="h-full" style={{ width: `${yellowEnd - greenEnd}%`, background: "linear-gradient(90deg, hsl(45 93% 55%), hsl(30 90% 50%))" }} />
                    <div className="h-full rounded-r-full" style={{ width: `${100 - yellowEnd}%`, background: "linear-gradient(90deg, hsl(0 70% 55%), hsl(0 84% 50%))" }} />
                  </div>
                  {/* Indicator */}
                  <motion.div
                    initial={{ left: "0%" }}
                    animate={{ left: `${Math.max(2, Math.min(96, 100 - freshPct))}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.3 }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-lg"
                    style={{ borderColor: status.color }}
                  />
                </div>

                {/* Labels */}
                <div className="flex justify-between text-[10px] font-outfit text-muted-foreground">
                  <span className="text-success">Best: {item.bestStart}–{item.bestEnd}</span>
                  <span className="text-amber-500">Soon: {item.useSoonStart}–{item.useSoonEnd}</span>
                  <span className="text-destructive">Risk: {item.riskStart}+</span>
                </div>
              </div>

              {/* Chef's Idea - Shimmer card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 250, damping: 25 }}
                className="relative rounded-2xl p-4 mb-4 overflow-hidden"
                style={{
                  background: "rgba(245, 240, 255, 0.45)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(167, 139, 250, 0.35)",
                  boxShadow: "0 8px 30px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)" }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <ChefHat className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-outfit font-semibold text-accent mb-0.5 flex items-center gap-1">
                      Chef's Idea <Sparkles className="w-3 h-3" />
                    </p>
                    <p className="text-sm font-outfit font-semibold text-foreground">{item.recipe.title}</p>
                    <p className="text-xs font-outfit text-muted-foreground mt-0.5">{item.recipe.description}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] font-outfit text-muted-foreground">
                      <Clock className="w-3 h-3" /> {item.recipe.prepTime}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Storage Tip */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 250, damping: 25 }}
                className="rounded-2xl p-4 mb-4"
                style={{
                  background: "rgba(245, 240, 255, 0.45)",
                  backdropFilter: "blur(30px)",
                  border: "1px solid rgba(167, 139, 250, 0.25)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-outfit font-semibold text-success mb-0.5">Storage Tip</p>
                    <p className="text-xs font-outfit text-muted-foreground leading-relaxed">{item.storageTip}</p>
                  </div>
                </div>
              </motion.div>

              {/* Usage Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 250, damping: 25 }}
                className="glass-strong rounded-2xl p-4"
              >
                <h3 className="text-sm font-outfit font-semibold text-foreground mb-3">How much is left?</h3>
                <div className="flex items-center gap-4 mb-2">
                  <Slider
                    value={[item.remaining]}
                    onValueChange={([v]) => onUpdateRemaining(item.id, v)}
                    max={100}
                    step={25}
                    className="flex-1"
                  />
                  <span className="text-sm font-outfit font-bold text-foreground w-12 text-right">{item.remaining}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-outfit text-muted-foreground">
                  <span>Gone</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>Full</span>
                </div>
                {item.remaining === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-outfit text-destructive mt-2 text-center"
                  >
                    This item will be moved to Consumption History.
                  </motion.p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}