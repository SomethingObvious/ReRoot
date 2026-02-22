import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Store } from "lucide-react";

const data = [
  { name: "Metro", value: 60, color: "hsl(0 84% 55%)" },
  { name: "Loblaws", value: 25, color: "hsl(45 93% 50%)" },
  { name: "Local Market", value: 15, color: "hsl(142 71% 45%)" },
];

export default function StoreLoyalty() {
  return (
    <div className="aero-card rounded-3xl p-4 overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Store className="w-4 h-4 text-primary" style={{ filter: "drop-shadow(0 1px 2px rgba(139,92,246,0.3))" }} />
          <h3 className="text-xs font-outfit font-semibold text-foreground">Store Loyalty</h3>
        </div>

        <div className="flex justify-center mb-2">
          <div className="w-24 h-24 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  innerRadius={22}
                  outerRadius={40}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-1.5">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-[10px] font-outfit font-semibold text-foreground flex-1 break-words" style={{ textWrap: "balance" as any }}>{d.name}</span>
              <span className="text-[10px] font-outfit text-muted-foreground flex-shrink-0">{d.value}%</span>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-xl p-2" style={{ background: "hsl(0 84% 55% / 0.06)" }}>
          <p className="text-[9px] font-outfit font-semibold text-center break-words" style={{ color: "hsl(0 84% 50%)", textWrap: "balance" as any }}>
            🏆 Metro VIP — check your points!
          </p>
        </div>
      </div>
    </div>
  );
}