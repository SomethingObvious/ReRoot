import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RewardsToggle from "@/components/RewardsToggle";
import RootImpactCard from "@/components/RootImpactCard";
import { RECEIPT_HISTORY } from "@/lib/mockData";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="px-5 pt-14 pb-32 max-w-lg mx-auto"
    >
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-outfit text-muted-foreground">Good Morning,</p>
          <h1 className="text-2xl font-outfit font-bold text-foreground">Paul 🌱</h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </motion.button>
      </motion.div>

      <motion.div variants={fadeUp} className="mb-4">
        <RewardsToggle />
      </motion.div>

      <motion.div variants={fadeUp} className="mb-6">
        <RootImpactCard />
      </motion.div>

      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-outfit font-semibold text-foreground mb-3">Recent Receipts</h2>
        <div className="space-y-3">
          {RECEIPT_HISTORY.map((receipt) => (
            <motion.div
              key={receipt.id}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02, boxShadow: "0 14px 40px rgba(139,92,246,0.15)" }}
              onClick={() => navigate(`/receipt/${receipt.id}`)}
              className="glass-strong rounded-3xl p-4 flex items-center justify-between cursor-pointer"
            >
              <div>
                <p className="text-sm font-outfit font-semibold text-foreground">{receipt.store}</p>
                <p className="text-xs font-outfit text-muted-foreground">
                  {new Date(receipt.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                  {" · "}
                  {receipt.items.length} items
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-outfit font-bold text-foreground">${receipt.total.toFixed(2)}</p>
                <p className="text-xs font-outfit text-success font-medium">+{receipt.pointsEarned} pts</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
