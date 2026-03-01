import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Coins } from "lucide-react";

export default function RewardsToggle() {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="space-y-0">
      {/* Aero Glass Card */}
      <motion.div
        layout
        className="relative rounded-3xl p-5 overflow-hidden"
        style={{
          background: isPublic
            ? "rgba(255,255,255,0.55)"
            : "rgba(255,255,255,0.65)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.90)",
          boxShadow: "0 8px 32px rgba(190,60,90,0.08), 0 2px 8px rgba(190,60,90,0.04)",
        }}
      >
        {/* Diagonal gloss sheen */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.15) 30%, transparent 55%)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Icon with depth */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: isPublic
                  ? "linear-gradient(135deg, hsl(345 60% 55%), hsl(338 55% 50%))"
                  : "linear-gradient(135deg, hsl(220 15% 80%), hsl(220 10% 65%))",
                boxShadow: isPublic
                  ? "0 4px 12px rgba(190,60,90,0.3), inset 0 1px 0 rgba(255,255,255,0.4)"
                  : "0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {isPublic ? (
                <Coins className="w-5 h-5 text-white drop-shadow-sm" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} />
              ) : (
                <Shield className="w-5 h-5 text-white drop-shadow-sm" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }} />
              )}
            </div>
            <div>
              <h3
                className="font-outfit font-semibold text-sm"
                style={{ color: "hsl(240 64% 27%)", textShadow: "0 0 8px rgba(255,255,255,0.6)" }}
              >
                {isPublic ? "Market Rewards" : "Vault Mode"}
              </h3>
              <p
                className="text-xs font-outfit"
                style={{ color: "hsl(260 20% 50%)", textShadow: "0 0 6px rgba(255,255,255,0.4)" }}
              >
                {isPublic ? "Power Earner (2x)" : "Standard Points (1x)"}
              </p>
            </div>
          </div>

          {/* Physical Tech Switch */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPublic(!isPublic)}
            className="relative w-[56px] h-[30px] rounded-full tap-active"
            style={{
              background: isPublic
                ? "linear-gradient(180deg, hsl(152 76% 70%) 0%, hsl(152 76% 50%) 100%)"
                : "linear-gradient(180deg, hsl(220 15% 82%) 0%, hsl(220 12% 68%) 100%)",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.25), inset 0 -1px 2px rgba(255,255,255,0.2)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {/* Knob */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-[2px] w-[26px] h-[26px] rounded-full flex items-center justify-center"
              style={{
                left: isPublic ? "calc(100% - 28px)" : "2px",
                background: "linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              {isPublic ? (
                <Coins className="w-3 h-3" style={{ color: "hsl(152 76% 42%)", filter: "drop-shadow(0 0.5px 1px rgba(0,0,0,0.15))" }} />
              ) : (
                <Shield className="w-3 h-3" style={{ color: "hsl(220 12% 55%)", filter: "drop-shadow(0 0.5px 1px rgba(0,0,0,0.15))" }} />
              )}
            </motion.div>
          </motion.button>
        </div>

        <p
          className="relative z-10 text-xs font-outfit leading-relaxed"
          style={{ color: "hsl(260 20% 45%)", textShadow: "0 0 6px rgba(255,255,255,0.4)" }}
        >
          {isPublic ? "Anonymized insights active. Earn 2x points on every scan." : "Data processed locally. No sharing."}
        </p>
      </motion.div>
    </div>
  );
}