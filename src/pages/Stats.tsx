import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, ChevronRight, Dna } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
} from "recharts";
import WeeklySpendChart from "@/components/WeeklySpendChart";
import NutroMeter from "@/components/NutroMeter";
import GlobalFootprint from "@/components/GlobalFootprint";
import { STATS_DATA } from "@/lib/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

// Macro stacked bar data (4 weeks)

// Radar data
const radarData = [
  { nutrient: "Vit C", you: 120, recommended: 100 },
  { nutrient: "Iron", you: 45, recommended: 100 },
  { nutrient: "Calcium", you: 78, recommended: 100 },
  { nutrient: "Potassium", you: 85, recommended: 100 },
  { nutrient: "Fiber", you: 93, recommended: 100 },
];

// Inflation tracker
const inflationData = [
  { month: "Sep", you: 212, avg: 215 },
  { month: "Oct", you: 217, avg: 220 },
  { month: "Nov", you: 224, avg: 228 },
  { month: "Dec", you: 231, avg: 235 },
  { month: "Jan", you: 236, avg: 240 },
  { month: "Feb", you: 239, avg: 242 },
];

// Top products
const topProducts = [
  { rank: 1, name: "Eggs (Free Range)", spent: 45, trend: "+8%" },
  { rank: 2, name: "Greek Yogurt", spent: 38, trend: "+3%" },
  { rank: 3, name: "Coffee Beans", spent: 32, trend: "-2%" },
  { rank: 4, name: "Oat Milk", spent: 28, trend: "+12%" },
  { rank: 5, name: "Bananas", spent: 22, trend: "0%" },
];

function GlassTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-1.5 text-[10px] font-outfit font-semibold text-foreground shadow-lg">
      <p className="mb-0.5">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function Stats() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="px-4 pt-14 pb-32 max-w-lg mx-auto"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-2 mb-5">
        <Dna className="w-5 h-5 text-primary" style={{ filter: "drop-shadow(0 1px 3px rgba(139,92,246,0.4))" }} />
        <h1 className="text-xl font-outfit font-bold text-foreground">Your Data Fingerprint 🧬</h1>
      </motion.div>

      {/* Summary row */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 mb-4">
        {[
          { label: "This Month", value: `$${STATS_DATA.monthlyTotal}` },
          { label: "Avg / Trip", value: `$${STATS_DATA.avgPerTrip.toFixed(2)}` },
          { label: "Trips", value: `${STATS_DATA.tripsThisMonth}` },
        ].map((s) => (
          <div key={s.label} className="aero-card rounded-2xl p-3 text-center overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-outfit font-bold text-foreground">{s.value}</p>
              <p className="text-[9px] font-outfit text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Weekly Spend (moved from dashboard) */}
      <motion.div variants={fadeUp} className="mb-4">
        <WeeklySpendChart />
      </motion.div>

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Nutro-Meter */}
        <motion.div variants={fadeUp}>
          <NutroMeter />
        </motion.div>
        {/* Global Footprint */}
        <motion.div variants={fadeUp}>
          <GlobalFootprint />
        </motion.div>
      </div>

      {/* Micro-Nutrient Radar */}
      <motion.div variants={fadeUp} className="aero-card rounded-2xl p-3 mb-4 overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-outfit font-semibold text-foreground mb-1">Micro-Nutrient Radar</h3>
          <p className="text-[9px] font-outfit text-muted-foreground mb-2">You vs Recommended Daily Intake</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(260 20% 85%)" />
                <PolarAngleAxis
                  dataKey="nutrient"
                  tick={{ fontSize: 9, fontFamily: "Outfit", fill: "hsl(260 20% 45%)" }}
                />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 130]} />
                <Radar
                  name="Recommended"
                  dataKey="recommended"
                  stroke="hsl(260 20% 70%)"
                  fill="hsl(260 20% 80%)"
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                />
                <Radar name="You" dataKey="you" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45%)" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: "hsl(142 71% 45%)" }} />
              <span className="text-[9px] font-outfit text-muted-foreground">You</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border border-muted-foreground" />
              <span className="text-[9px] font-outfit text-muted-foreground">Recommended</span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 mt-2 px-2 py-1.5 rounded-lg"
            style={{ background: "hsl(0 84% 55% / 0.08)" }}
          >
            <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: "hsl(0 84% 55%)" }} />
            <span className="text-[9px] font-outfit font-semibold" style={{ color: "hsl(0 84% 55%)" }}>
              Low Iron detected in 3 recent shops
            </span>
          </div>
        </div>
      </motion.div>

      {/* C. Inflation Tracker */}
      <motion.div variants={fadeUp} className="aero-card rounded-2xl p-3 mb-4 overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-outfit font-semibold text-foreground mb-1">Inflation Tracker</h3>
          <p className="text-[9px] font-outfit text-muted-foreground mb-3">Your Basket vs National Average</p>
          <div className="h-[130px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inflationData}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fontFamily: "Outfit", fill: "hsl(260 20% 50%)" }}
                />
                <YAxis hide domain={["dataMin - 20", "dataMax + 10"]} />
                <Tooltip content={<GlassTooltip />} cursor={false} />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="hsl(0 84% 55%)"
                  strokeWidth={1.5}
                  dot={false}
                  name="National Avg"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="you"
                  stroke="hsl(142 71% 45%)"
                  strokeWidth={2}
                  dot={false}
                  name="Your Basket"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-3 mt-1 mb-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 rounded-full" style={{ background: "hsl(142 71% 45%)" }} />
              <span className="text-[9px] font-outfit text-muted-foreground">You</span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-0.5 rounded-full border-t border-dashed"
                style={{ borderColor: "hsl(0 84% 55%)" }}
              />
              <span className="text-[9px] font-outfit text-muted-foreground">National Avg</span>
            </div>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg"
            style={{ background: "hsl(142 71% 45% / 0.08)" }}
          >
            <TrendingDown className="w-3 h-3" style={{ color: "hsl(142 71% 45%)" }} />
            <span className="text-[9px] font-outfit font-semibold" style={{ color: "hsl(142 71% 45%)" }}>
              You beat inflation by 4.2% this month!
            </span>
          </div>
        </div>
      </motion.div>

      {/* D. Top Products Leaderboard */}
      <motion.div variants={fadeUp} className="aero-card rounded-2xl p-3 overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-outfit font-semibold text-foreground mb-3">Top Products</h3>
          <div className="space-y-2">
            {topProducts.map((p) => (
              <motion.div
                key={p.rank}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedProduct(selectedProduct === p.rank ? null : p.rank)}
                className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-colors hover:bg-white/30"
              >
                <span className="text-xs font-outfit font-bold text-primary w-5 text-center">#{p.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-outfit font-semibold text-foreground truncate">{p.name}</p>
                  {selectedProduct === p.rank && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[9px] font-outfit text-muted-foreground mt-0.5"
                    >
                      Tap to view price history →
                    </motion.p>
                  )}
                </div>
                <span className="text-[11px] font-outfit font-bold text-foreground">${p.spent}</span>
                <span
                  className="text-[9px] font-outfit font-semibold"
                  style={{
                    color: p.trend.startsWith("+")
                      ? "hsl(0 84% 55%)"
                      : p.trend.startsWith("-")
                        ? "hsl(142 71% 45%)"
                        : "hsl(260 20% 60%)",
                  }}
                >
                  {p.trend}
                </span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Categories */}
      <motion.div variants={fadeUp} className="aero-card rounded-2xl p-3 mt-4 overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-outfit font-semibold text-foreground mb-3">Top Categories</h3>
          <div className="space-y-2.5">
            {STATS_DATA.topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-outfit font-medium text-foreground">{cat.name}</span>
                  <span className="text-[10px] font-outfit text-muted-foreground">${cat.amount}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, hsl(258 80% 72%), hsl(292 84% 61%))" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
