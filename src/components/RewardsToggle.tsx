import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Gem } from "lucide-react";

export default function RewardsToggle() {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <motion.div
      layout
      className="glass-strong rounded-3xl p-5 overflow-hidden"
      animate={{
        background: isPublic
          ? "linear-gradient(135deg, rgba(225,29,72,0.06) 0%, rgba(255,255,255,0.9) 100%)"
          : "linear-gradient(135deg, rgba(100,116,139,0.06) 0%, rgba(255,255,255,0.9) 100%)",
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Toggle track */}
      <div
        className="relative h-14 rounded-full bg-muted/60 cursor-pointer p-1"
        onClick={() => setIsPublic(!isPublic)}
      >
        {/* Sliding thumb */}
        <motion.div
          layout
          className={`absolute top-1 h-12 w-[calc(50%-4px)] rounded-full flex items-center justify-center gap-2 shadow-soft ${
            isPublic ? "bg-primary" : "bg-white"
          }`}
          animate={{ x: isPublic ? "calc(100% + 8px)" : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          <motion.div
            animate={{ rotate: isPublic ? 15 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {isPublic ? (
              <Gem className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Shield className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.div>
          <span
            className={`text-sm font-outfit font-semibold ${
              isPublic ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {isPublic ? "Market" : "Vault"}
          </span>
        </motion.div>

        {/* Labels */}
        <div className="relative h-full flex">
          <div className="flex-1 flex items-center justify-center">
            <span className={`text-xs font-outfit ${isPublic ? "text-muted-foreground" : "opacity-0"}`}>
              Vault Mode
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className={`text-xs font-outfit ${!isPublic ? "text-muted-foreground" : "opacity-0"}`}>
              Market Rewards
            </span>
          </div>
        </div>
      </div>

      {/* Info text */}
      <motion.div layout className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-outfit font-semibold text-foreground">
            {isPublic ? "Power Earner (2x)" : "Standard Points (1x)"}
          </p>
          <p className="text-xs font-outfit text-muted-foreground mt-0.5">
            {isPublic ? "Anonymized insights active." : "Data processed locally. No sharing."}
          </p>
        </div>
        <motion.div
          animate={{ scale: isPublic ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`px-3 py-1 rounded-full text-xs font-outfit font-medium ${
            isPublic
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isPublic ? "2x" : "1x"}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
