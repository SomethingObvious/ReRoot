import { motion } from "framer-motion";
import { STATS_DATA } from "@/lib/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Stats() {
  const max = Math.max(...STATS_DATA.weeklySpend);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="px-5 pt-14 pb-32 max-w-lg mx-auto"
    >
      <motion.h1 variants={fadeUp} className="text-2xl font-outfit font-bold text-foreground mb-5">
        Stats
      </motion.h1>

      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "This Month", value: `$${STATS_DATA.monthlyTotal}` },
          { label: "Avg / Trip", value: `$${STATS_DATA.avgPerTrip}` },
          { label: "Trips", value: `${STATS_DATA.tripsThisMonth}` },
        ].map((s) => (
          <div key={s.label} className="glass-strong rounded-3xl p-4 text-center">
            <p className="text-lg font-outfit font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] font-outfit text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="glass-strong rounded-3xl p-5 mb-6">
        <h2 className="text-sm font-outfit font-semibold text-foreground mb-4">Weekly Spend</h2>
        <div className="flex items-end gap-2 h-32">
          {STATS_DATA.weeklySpend.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-xl bg-primary/80"
                initial={{ height: 0 }}
                animate={{ height: `${(val / max) * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
              />
              <span className="text-[10px] font-outfit text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-strong rounded-3xl p-5">
        <h2 className="text-sm font-outfit font-semibold text-foreground mb-4">Top Categories</h2>
        <div className="space-y-3">
          {STATS_DATA.topCategories.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-outfit font-medium text-foreground">{cat.name}</span>
                <span className="text-xs font-outfit text-muted-foreground">${cat.amount}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
