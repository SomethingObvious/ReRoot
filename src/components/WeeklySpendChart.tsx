import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const data = [
  { day: "Mon", amount: 0 },
  { day: "Tue", amount: 12.5 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 5.0 },
  { day: "Fri", amount: 22.0 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 85.4 },
];

const total = data.reduce((s, d) => s + d.amount, 0);

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="glass rounded-xl px-3 py-1.5 text-xs font-outfit font-semibold text-foreground shadow-lg">
      ${payload[0].value.toFixed(2)}
    </div>
  );
}

export default function WeeklySpendChart() {
  return (
    <div className="glass-strong rounded-3xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-outfit font-semibold text-foreground">Weekly Spend</h3>
        <span className="text-[10px] font-outfit text-muted-foreground">Last 7 days</span>
      </div>

      <div className="h-[140px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(258 90% 66%)" />
                <stop offset="100%" stopColor="hsl(292 84% 55%)" />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false} tickLine={false}
              tick={{ fontSize: 10, fontFamily: "Outfit", fill: "hsl(260 20% 50%)" }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Bar dataKey="amount" fill="url(#barGrad)" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((d, i) => (
                <Cell key={i} fillOpacity={d.amount === 0 ? 0.15 : 1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm font-outfit font-bold text-foreground">
          Total: ${total.toFixed(2)}
        </p>
        <div className="flex items-center gap-1 text-success text-xs font-outfit font-semibold bg-success/10 px-2.5 py-1 rounded-full">
          <TrendingDown className="w-3 h-3" />
          -$18 vs last week
        </div>
      </div>
    </div>
  );
}