import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, ChevronDown, ChevronUp, Pencil, Package, Leaf, Snowflake, ShoppingBasket } from "lucide-react";
import type { ScannedReceipt, LineItem, ItemCategory } from "@/lib/mockData";

interface ReceiptReviewProps {
  receipt: ScannedReceipt;
  onConfirm: (receipt: ScannedReceipt) => void;
}

const categoryConfig: Record<ItemCategory, { icon: React.ElementType; emoji: string; color: string }> = {
  Grocery: { icon: ShoppingBasket, emoji: "🛒", color: "hsl(258 90% 66%)" },
  Meat: { icon: Package, emoji: "🥩", color: "hsl(0 70% 55%)" },
  Produce: { icon: Leaf, emoji: "🥬", color: "hsl(142 71% 45%)" },
  Frozen: { icon: Snowflake, emoji: "❄️", color: "hsl(200 80% 55%)" },
};

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const colors = {
    High: "bg-emerald-400/20 text-emerald-300",
    Medium: "bg-amber-400/20 text-amber-300",
    Low: "bg-red-400/20 text-red-300",
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${colors[confidence as keyof typeof colors] || colors.Medium}`}>
      {confidence} Confidence
    </span>
  );
}

function EditableLineItem({ item, onChange }: { item: LineItem; onChange: (item: LineItem) => void }) {
  const [editing, setEditing] = useState(false);
  const [useKg, setUseKg] = useState(true);

  return (
    <div
      className={`relative rounded-2xl p-3 ${
        item.needsReview
          ? "bg-amber-500/10 border border-amber-400/25"
          : "bg-white/[0.06] border border-white/10"
      }`}
    >
      {item.needsReview && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-outfit font-medium text-amber-300">Needs Review</span>
            {item.unitPrice === null && !item.packageCosts && <span className="text-[10px] text-white/50">— unit price missing</span>}
            {item.weightKg === null && item.unit === "packages" && (
              <span className="text-[10px] text-white/50">— weights missing</span>
            )}
          </div>
          <button
            onClick={() => onChange({ ...item, needsReview: false })}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-outfit font-medium hover:bg-emerald-400/30 transition-colors"
          >
            <Check className="w-3 h-3" />
            Confirm
          </button>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              className="w-full bg-white/10 rounded-lg px-2 py-1 text-sm font-outfit font-medium text-white border border-purple-400/40 outline-none focus:border-purple-400"
              value={item.nameNormalized}
              onChange={(e) => onChange({ ...item, nameNormalized: e.target.value })}
              onBlur={() => setEditing(false)}
              autoFocus
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 group text-left"
            >
              <span className="text-sm font-outfit font-medium text-white">
                {item.brand && <span className="text-white/60">{item.brand} </span>}
                {item.nameNormalized}
              </span>
              <Pencil className="w-3 h-3 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-white/50 font-outfit">
              {item.quantity > 1 && `${item.quantity}× `}
              {item.unit === "kg" && item.weightKg ? `${item.weightKg} kg` : ""}
              {item.unitPrice !== null && !item.packageCosts && ` @ $${item.unitPrice.toFixed(2)}/${item.unit}`}
            </span>
            <ConfidenceBadge confidence={item.confidence} />
            {item.storageLocation && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-400/15 text-purple-300 font-medium">
                {item.storageLocation}
              </span>
            )}
          </div>

          {item.packageCosts && (
            <div className="mt-2 flex flex-col gap-1.5">
              {/* kg/lbs toggle */}
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => setUseKg(true)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-outfit font-medium transition-colors ${useKg ? "bg-purple-400/30 text-purple-200" : "bg-white/8 text-white/40"}`}
                >
                  kg
                </button>
                <button
                  onClick={() => setUseKg(false)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-outfit font-medium transition-colors ${!useKg ? "bg-purple-400/30 text-purple-200" : "bg-white/8 text-white/40"}`}
                >
                  lbs
                </button>
              </div>

              {item.packageCosts.map((cost, i) => {
                const weightKg = item.packageWeights?.[i] ?? null;
                const displayWeight = weightKg !== null ? (useKg ? weightKg : +(weightKg * 2.20462).toFixed(2)) : "";
                const unit = useKg ? "kg" : "lbs";

                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/8 text-white/50 font-outfit shrink-0">
                      Pkg {i + 1}: ${cost.toFixed(2)}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={unit}
                      className="w-16 bg-white/10 rounded-lg px-2 py-0.5 text-[11px] font-outfit text-white border border-white/15 outline-none focus:border-purple-400/50 placeholder:text-white/30 [appearance:textfield]"
                      value={displayWeight}
                      onChange={(e) => {
                        const val = e.target.value ? parseFloat(e.target.value) : null;
                        const kg = val !== null ? (useKg ? val : val / 2.20462) : null;
                        const newWeights = [...(item.packageWeights || item.packageCosts!.map(() => null))];
                        newWeights[i] = kg !== null ? +kg.toFixed(3) : null;
                        onChange({ ...item, packageWeights: newWeights });
                      }}
                    />
                    <span className="text-[10px] text-white/30 font-outfit">{unit}</span>
                  </div>
                );
              })}

              {/* Price per unit input — auto-populates weights upward */}
              <div className="flex items-center gap-2 mt-1 pt-1.5 border-t border-white/10">
                <span className="text-[10px] text-white/50 font-outfit shrink-0">Price/{useKg ? "kg" : "lb"}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder={`$/${useKg ? "kg" : "lb"}`}
                  className="w-20 bg-white/10 rounded-lg px-2 py-0.5 text-[11px] font-outfit text-white border border-white/15 outline-none focus:border-purple-400/50 placeholder:text-white/30 [appearance:textfield]"
                  value={item.unitPrice !== null ? (useKg ? item.unitPrice : +(item.unitPrice / 2.20462).toFixed(2)) : ""}
                  onChange={(e) => {
                    const pricePerDisplayUnit = e.target.value ? parseFloat(e.target.value) : null;
                    if (pricePerDisplayUnit === null) {
                      onChange({ ...item, unitPrice: null });
                      return;
                    }
                    // Store as price/kg internally
                    const pricePerKg = useKg ? pricePerDisplayUnit : pricePerDisplayUnit * 2.20462;
                    // Auto-calculate weights: weight_kg = cost / pricePerKg
                    const newWeights = item.packageCosts!.map((cost) => +(cost / pricePerKg).toFixed(3));
                    onChange({ ...item, unitPrice: +pricePerKg.toFixed(4), packageWeights: newWeights });
                  }}
                />
              </div>
            </div>
          )}

          {item.estimatedExpiryDays !== undefined && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-[10px] text-white/40 font-outfit">
                ⏱ Est. expiry: {item.estimatedExpiryDays < 7
                  ? `${item.estimatedExpiryDays}d`
                  : item.estimatedExpiryDays < 60
                    ? `${Math.round(item.estimatedExpiryDays / 7)}w`
                    : `${Math.round(item.estimatedExpiryDays / 30)}mo`}
              </span>
            </div>
          )}
        </div>

        <span className="text-sm font-outfit font-bold text-white whitespace-nowrap">
          ${item.lineTotal.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default function ReceiptReview({ receipt, onConfirm }: ReceiptReviewProps) {
  const [items, setItems] = useState<LineItem[]>(receipt.lineItems);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Grocery");
  const categories = Array.from(new Set(items.map((i) => i.category))) as ItemCategory[];

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat);
    return acc;
  }, {} as Record<string, LineItem[]>);

  const needsReviewCount = items.filter((i) => i.needsReview).length;

  const handleItemChange = (updated: LineItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleConfirm = () => {
    onConfirm({ ...receipt, lineItems: items });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full">
      {/* Store & Date Header — sticky */}
      <div className="text-center pb-1 shrink-0">
        <p className="text-xs tracking-widest uppercase text-white/50 font-outfit">{receipt.storeName}</p>
        <p className="text-2xl font-bold font-outfit text-white mt-0.5">${receipt.finalTotal.toFixed(2)}</p>
        <p className="text-xs text-white/50 font-outfit mt-0.5">
          Wednesday, February 18, 2026
        </p>
      </div>

      {needsReviewCount > 0 ? (
        <motion.div
          key={`review-${needsReviewCount}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/25 mb-3 shrink-0"
        >
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-outfit font-medium text-amber-300">
            {needsReviewCount} item{needsReviewCount > 1 ? "s" : ""} need{needsReviewCount === 1 ? "s" : ""} review
          </span>
        </motion.div>
      ) : (
        <motion.div
          key="all-set"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/25 mb-3 shrink-0"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-outfit font-medium text-emerald-300">
            All items confirmed
          </span>
        </motion.div>
      )}

      {/* Category Groups — scrollable area with fade edges */}
      <div className="relative flex-1 min-h-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)",
        }}
      >

        <div
          className="flex flex-col gap-3 h-full overflow-y-auto pt-4 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const config = categoryConfig[cat];
            const catItems = grouped[cat];
            const catTotal = catItems.reduce((s, i) => s + i.lineTotal, 0);
            const catReviewCount = catItems.filter((i) => i.needsReview).length;
            const isOpen = expandedCategory === cat;

            return (
              <div key={cat} className="rounded-2xl overflow-hidden shrink-0">
                <button
                  onClick={() => setExpandedCategory(isOpen ? null : cat)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{config.emoji}</span>
                    <span className="text-sm font-outfit font-semibold text-white">{cat}</span>
                    <span className="text-xs text-white/40" style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 500, position: "relative", top: "-1px" }}>({catItems.length})</span>
                    <AnimatePresence>
                      {catReviewCount > 0 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-outfit font-medium"
                        >
                          <AlertTriangle className="w-3 h-3 shrink-0 relative" style={{ top: "-0.5px" }} />
                          <span style={{ lineHeight: 1, position: "relative", top: "1px" }}>{catReviewCount}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-outfit font-bold text-white">${catTotal.toFixed(2)}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-2 p-2 pt-2">
                        {catItems.map((item) => (
                          <EditableLineItem key={item.id} item={item} onChange={handleItemChange} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals Breakdown — always visible */}
      <div className="shrink-0 pt-2 pb-2 flex flex-col gap-3">
        <div className="rounded-2xl px-4 py-3 space-y-1.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <div className="flex justify-between text-xs font-outfit text-white/50">
            <span>Extracted Items Total</span>
            <span>${receipt.extractedItemsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs font-outfit text-white/50">
            <span>Discounts / Adjustments</span>
            <span className="text-emerald-400">{receipt.adjustmentsTotal >= 0 ? "+" : ""}${receipt.adjustmentsTotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-dashed border-white/15 pt-1.5 flex justify-between">
            <span className="text-sm font-outfit font-semibold text-white">Receipt Total</span>
            <span className="text-sm font-outfit font-bold text-white">${receipt.finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Confirm Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          className="w-full py-4 rounded-full font-outfit font-semibold text-lg shadow-deep flex items-center justify-center gap-2 backdrop-blur-md border border-emerald-400/20"
          style={{
             background: "linear-gradient(180deg, hsla(152, 55%, 45%, 0.55) 0%, hsla(152, 60%, 38%, 0.4) 100%)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <Check className="w-5 h-5" />
          Confirm & Save — +{receipt.pointsEarned} pts
        </motion.button>
      </div>
    </div>
  );
}
