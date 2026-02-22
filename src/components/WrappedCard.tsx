import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function WrappedCard({ onClick }: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="relative rounded-3xl p-5 cursor-pointer overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(258 80% 65%), hsl(292 84% 55%), hsl(258 80% 65%))",
        backgroundSize: "200% 200%",
        boxShadow: "0 12px 40px rgba(139,92,246,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
      }}
    >
      {/* Holographic foil shimmer */}
      <div
        className="absolute inset-0 pointer-events-none animate-[shimmer_4s_ease-in-out_infinite]"
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 45%, rgba(255,200,255,0.2) 50%, rgba(255,255,255,0.35) 55%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Rainbow iridescence */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 animate-[iridescence_6s_linear_infinite]"
        style={{
          background:
            "linear-gradient(135deg, hsl(0 80% 70%), hsl(60 80% 70%), hsl(120 80% 70%), hsl(200 80% 70%), hsl(280 80% 70%))",
          backgroundSize: "300% 300%",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-white/90" />
            <span className="text-[10px] font-outfit font-semibold text-white/80 uppercase tracking-widest">
              February Wrapped
            </span>
          </div>
          <h3 className="text-lg font-outfit font-bold text-white leading-tight">Your Month Takes Root!</h3>
          <p className="text-xs font-outfit text-white/70 mt-1">See your stats, savings & surprises ✨</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
