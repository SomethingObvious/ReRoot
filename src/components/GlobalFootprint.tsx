import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const origins = [
  { country: "Canada", flag: "🍁", pct: 65, items: "Apples, Pork, Milk", color: "hsl(0 84% 55%)" },
  { country: "USA", flag: "⭐", pct: 20, items: "Berries", color: "hsl(345 70% 45%)" },
  { country: "Mexico", flag: "🦅", pct: 10, items: "Avocados", color: "hsl(142 71% 45%)" },
  { country: "Other", flag: "🌍", pct: 5, items: "", color: "hsl(260 20% 65%)" },
];

export default function GlobalFootprint() {
  return (
    <div className="aero-card rounded-3xl p-4 h-full flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-primary" style={{ filter: "drop-shadow(0 1px 2px rgba(190,60,90,0.3))" }} />
          <h3 className="text-sm font-outfit font-semibold text-foreground">Global Footprint</h3>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-outfit font-bold text-foreground">Local Hero 🍁</span>
        </div>

        <div className="space-y-2.5 mb-3">
          {origins.map((o) => (
            <div key={o.country}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-outfit font-semibold text-foreground">
                  {o.country} {o.flag}
                </span>
                <span className="text-[11px] font-outfit font-semibold text-muted-foreground">{o.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: o.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${o.pct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
                />
              </div>
              {o.items && <p className="text-[9px] font-outfit text-muted-foreground mt-0.5">{o.items}</p>}
            </div>
          ))}
        </div>

        <div className="rounded-xl p-2.5" style={{ background: "hsl(142 71% 45% / 0.08)" }}>
          <p className="text-[10px] font-outfit text-success font-semibold text-center">
            🌿 Your food traveled 40% less distance than the average user
          </p>
        </div>
      </div>
    </div>
  );
}
