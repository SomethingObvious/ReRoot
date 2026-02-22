import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { FRIDGE_ITEMS } from "@/lib/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

function urgencyColor(daysLeft: number) {
  if (daysLeft <= 2) return "text-primary bg-primary/10";
  if (daysLeft <= 4) return "text-amber-600 bg-amber-50";
  return "text-success bg-success/10";
}

export default function Fridge() {
  const sorted = [...FRIDGE_ITEMS].sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="px-5 pt-14 pb-32 max-w-lg mx-auto"
    >
      <motion.h1 variants={fadeUp} className="text-2xl font-outfit font-bold text-foreground mb-2">
        My Fridge
      </motion.h1>
      <motion.p variants={fadeUp} className="text-sm font-outfit text-muted-foreground mb-5">
        Track freshness & reduce waste 🥬
      </motion.p>

      <div className="space-y-3">
        {sorted.map((item) => (
          <motion.div
            key={item.name}
            variants={fadeUp}
            whileTap={{ scale: 0.97 }}
            className="glass-strong rounded-3xl p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-outfit font-semibold text-foreground">{item.name}</p>
              <p className="text-xs font-outfit text-muted-foreground">{item.category}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-outfit font-semibold ${urgencyColor(item.daysLeft)}`}>
              {item.daysLeft <= 2 && <AlertTriangle className="w-3 h-3" />}
              {item.daysLeft}d left
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
