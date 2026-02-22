import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { WALLET_DATA } from "@/lib/mockData";

export default function WalletCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = ((clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((clientY - rect.top) / rect.height - 0.5) * -20;
    setTilt({ x: y, y: x });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const progressPct = (WALLET_DATA.balance / WALLET_DATA.nextTierAt) * 100;

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      onTouchMove={handleMove}
      onTouchEnd={resetTilt}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="rounded-3xl p-6 shadow-deep relative overflow-hidden cursor-pointer"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          background: "linear-gradient(135deg, hsl(346 77% 50%) 0%, hsl(346 77% 35%) 50%, hsl(28 80% 15%) 100%)",
        }}
      />

      {/* Shine overlay */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-20"
        style={{
          background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 - tilt.x * 2}%, white 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-sm font-outfit font-medium text-white/80">ReRoot Points</span>
          </div>
          <span className="text-xs font-outfit text-white/60 bg-white/10 px-3 py-1 rounded-full">
            {WALLET_DATA.tier}
          </span>
        </div>

        <p className="text-4xl font-outfit font-bold text-white mb-1">{WALLET_DATA.balance}</p>
        <p className="text-sm font-outfit text-white/60">
          {WALLET_DATA.nextTierAt - WALLET_DATA.balance} pts to {WALLET_DATA.nextTier}
        </p>

        {/* Progress */}
        <div className="mt-4 h-1.5 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white/50"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
