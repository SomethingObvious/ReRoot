import { TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", amount: 12.5 },
  { day: "Tue", amount: 0 },
  { day: "Wed", amount: 45.2 },
  { day: "Thu", amount: 8.9 },
  { day: "Fri", amount: 112.45 },
  { day: "Sat", amount: 15.0 },
  { day: "Sun", amount: 0 },
];

const total = data.reduce((s, d) => s + d.amount, 0);

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="glass rounded-xl px-3 py-1.5 text-xs font-outfit font-semibold text-foreground shadow-lg">
      {label}: ${payload[0].value.toFixed(2)}
    </div>
  );
}

export default function WeeklySpendChart() {
  return (
    <div className="aero-card rounded-3xl p-4">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-outfit font-semibold text-foreground">Weekly Spend</h3>
          <span className="text-[10px] font-outfit text-muted-foreground">Last 7 days</span>
        </div>

        <div className="h-[150px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E11D48" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#E11D48" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 10, fontFamily: "Outfit", fill: "hsl(260 20% 50%)" }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#E11D48"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-outfit font-bold text-foreground">
            Total: ${total.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-xs font-outfit font-semibold px-2.5 py-1 rounded-full"
            style={{ color: "hsl(0 84% 50%)", background: "hsl(0 84% 60% / 0.1)" }}>
            <TrendingUp className="w-3 h-3" />
            +12% vs last week
          </div>
        </div>
      </div>
    </div>
  );
}