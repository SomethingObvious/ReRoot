import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const macros = [
  { label: "Protein", value: 85, max: 120, unit: "g", color: "hsl(258 80% 60%)", subtext: "Avg/Day" },
  { label: "Fiber", value: 28, max: 30, unit: "g", color: "hsl(142 71% 45%)", subtext: "Excellent!" },
];

const vitamins = [
  { label: "Vit C", pct: 120, color: "hsl(25 95% 53%)" },
  { label: "Iron", pct: 45, color: "hsl(0 84% 60%)", low: true },
];

function Ring({ value, max, color, size = 72, stroke = 6 }: { value: number; max: number; color: string; size?: number; stroke?: number }) {
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, value / max);
  const offset = circumference * (1 - pct);

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
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
        />
      </svg>
      <span className="absolute text-xs font-outfit font-bold text-foreground">{value}{value > 100 ? "%" : ""}</span>
    </div>
  );
}

export default function NutroMeter() {
  return (
    <div className="aero-card rounded-3xl p-4">
      <div className="relative z-10">
        <h3 className="text-sm font-outfit font-semibold text-foreground mb-4">Nutro-Meter</h3>

        {/* Macro rings */}
        <div className="flex items-center justify-around mb-4">
          {macros.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-1.5">
              <Ring value={m.value} max={m.max} color={m.color} />
              <p className="text-[11px] font-outfit font-semibold text-foreground">{m.label}</p>
              <p className="text-[9px] font-outfit text-muted-foreground">{m.value}{m.unit} · {m.subtext}</p>
            </div>
          ))}
        </div>

        {/* Vitamin bars */}
        <div className="space-y-2.5">
          {vitamins.map((v) => (
            <div key={v.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-outfit font-semibold text-foreground">{v.label}</span>
                <span className="text-[11px] font-outfit font-semibold flex items-center gap-1" style={{ color: v.low ? "hsl(0 84% 60%)" : v.color }}>
                  {v.pct}%
                  {v.low && <AlertTriangle className="w-3 h-3" />}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: v.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, v.pct)}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.5 }}
                />
              </div>
              {v.low && (
                <p className="text-[9px] font-outfit mt-0.5" style={{ color: "hsl(0 84% 60%)" }}>
                  Below recommended intake — consider iron-rich foods
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}