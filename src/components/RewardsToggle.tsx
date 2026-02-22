import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ShoppingBag } from "lucide-react";

export default function RewardsTierToggle() {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <motion.div
      layout
      className="rounded-3xl p-5 shadow-glass border border-border/50 backdrop-blur-md transition-colors duration-500"
      style={{
        backgroundColor: isPublic ? "hsl(350 80% 50% / 0.06)" : "hsl(0 0% 100% / 0.8)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isPublic ? 15 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isPublic ? "bg-primary/15" : "bg-muted"}`}
          >
            {isPublic ? (
              <ShoppingBag className="w-5 h-5 text-primary" />
            ) : (
              <Shield className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm">{isPublic ? "Market Rewards" : "Vault Mode"}</h3>
            <p className="text-xs text-muted-foreground">{isPublic ? "Power Earner (2x)" : "Standard Points (1x)"}</p>
          </div>
        </div>

        {/* Custom pill switch */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPublic(!isPublic)}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 tap-active ${
            isPublic ? "bg-primary" : "bg-muted"
          }`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 w-6 h-6 rounded-full bg-card shadow-soft"
            style={{ left: isPublic ? "calc(100% - 28px)" : "4px" }}
          />
        </motion.button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {isPublic ? "Anonymized insights active. Earn 2x points on every scan." : "Data processed locally. No sharing."}
      </p>
    </motion.div>
  );
}
