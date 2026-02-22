import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Share2, Trophy, Upload, Ghost, Music } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";

const SLIDE_DURATION = 5000;

const slideGradients = [
  "linear-gradient(135deg, hsl(142 60% 25%), hsl(160 70% 35%), hsl(142 50% 20%))",   // green - savings
  "linear-gradient(135deg, hsl(258 70% 30%), hsl(220 60% 40%), hsl(258 60% 25%))",   // purple - health
  "linear-gradient(135deg, hsl(142 60% 20%), hsl(80 50% 30%), hsl(142 50% 15%))",    // deep green - eco
  "linear-gradient(135deg, hsl(258 80% 35%), hsl(292 70% 40%), hsl(258 70% 25%))",   // violet - personality
  "linear-gradient(135deg, hsl(40 80% 45%), hsl(30 80% 40%), hsl(0 60% 35%))",       // gold/red - cheese
];

const textFadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 250, damping: 25, delay: i * 0.15 },
  }),
};

const radarData = [
  { stat: "Protein", you: 82, avg: 60 },
  { stat: "Fiber", you: 95, avg: 55 },
  { stat: "Vitamins", you: 78, avg: 65 },
  { stat: "Iron", you: 70, avg: 58 },
  { stat: "Calcium", you: 65, avg: 62 },
];

const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const heatmapWeeks = [
  [1, 3, 2, 5, 1, 2, 9],
  [2, 4, 1, 3, 2, 1, 8],
  [1, 6, 2, 2, 3, 1, 10],
  [2, 5, 1, 4, 2, 2, 9],
];

function heatColor(v: number) {
  if (v >= 8) return "hsl(258 80% 60%)";
  if (v >= 5) return "hsl(258 60% 50% / 0.7)";
  if (v >= 3) return "hsl(258 50% 55% / 0.4)";
  return "hsl(258 30% 70% / 0.2)";
}

interface Props { onClose: () => void }

export default function WrappedStory({ onClose }: Props) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const total = 5;

  // Auto-advance timer
  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrent((c) => (c < total - 1 ? c + 1 : c));
          return 0;
        }
        return p + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [current]);

  const goTo = useCallback((dir: "left" | "right") => {
    if (dir === "left" && current > 0) setCurrent(current - 1);
    if (dir === "right" && current < total - 1) setCurrent(current + 1);
  }, [current]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    goTo(x < rect.width / 2 ? "left" : "right");
  };

  const handleShare = () => {
    // Flash effect
    const flash = document.createElement("div");
    flash.style.cssText = "position:fixed;inset:0;background:white;z-index:9999;pointer-events:none;opacity:1;transition:opacity 0.4s";
    document.body.appendChild(flash);
    setTimeout(() => { flash.style.opacity = "0"; }, 50);
    setTimeout(() => flash.remove(), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: slideGradients[current] }}
    >
      {/* Fixed background bubbles for blur effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 80 + i * 30,
              height: 80 + i * 30,
              left: `${10 + (i * 13) % 80}%`,
              top: `${10 + (i * 17) % 70}%`,
              background: `radial-gradient(circle, rgba(255,255,255,0.08), transparent)`,
            }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>

      {/* Progress bars */}
      <div className="flex gap-1 px-4 pt-4 pb-2 relative z-20">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              style={{
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Top controls */}
      <div className="flex items-center justify-between px-4 py-2 relative z-20">
        <span className="text-[10px] font-outfit font-semibold text-white/60 uppercase tracking-widest">
          Reroot Wrapped
        </span>
        <div className="flex items-center gap-3">
          <button onClick={() => setMuted(!muted)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            {muted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-white/70" />}
          </button>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Tap zones */}
      <div className="flex-1 relative z-10 overflow-hidden" onClick={handleTap}>
        <AnimatePresence mode="wait">
          {current === 0 && <Slide0 key="s0" />}
          {current === 1 && <Slide1 key="s1" />}
          {current === 2 && <Slide2 key="s2" />}
          {current === 3 && <Slide3 key="s3" />}
          {current === 4 && <Slide4 key="s4" />}
        </AnimatePresence>
      </div>

      {/* Glass Dock – Social Share */}
      <div
        className="relative z-30 px-6 py-4 border-t border-white/30"
        style={{
          background: "rgba(255,255,255,0.20)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 -10px 40px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
        }}
      >
        <p className="text-[10px] font-outfit font-semibold text-white/50 uppercase tracking-widest text-center mb-3">
          Share your Wrapped
        </p>
        <div className="flex items-center justify-center gap-5">
          {/* Instagram */}
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/25 transition-all"
            style={{
              background: "rgba(255,255,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.backgroundImage = "linear-gradient(rgba(255,255,255,0.15), rgba(255,255,255,0.15)), linear-gradient(135deg, #E1306C, #F77737, #FCAF45)";
              e.currentTarget.style.backgroundOrigin = "border-box";
              e.currentTarget.style.backgroundClip = "padding-box, border-box";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.backgroundImage = "none";
              e.currentTarget.style.backgroundClip = "unset";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
            </svg>
          </motion.button>

          {/* TikTok */}
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/25 group relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Music className="w-5 h-5 text-white relative z-10" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(135deg, #00f2ea, #000, #ff0050)", mixBlendMode: "overlay" }}
            />
          </motion.button>

          {/* Snapchat */}
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/25 hover:border-yellow-300/60 hover:bg-yellow-400/20 transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Ghost className="w-5 h-5 text-white" />
          </motion.button>

          {/* Native Share */}
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/25 hover:border-white/50 hover:bg-white/20 transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Upload className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Slide 0: Cash Splash ─── */
function Slide0() {
  return (
    <motion.div
      initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}
      className="h-full flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.div custom={0} variants={textFadeUp} className="text-7xl mb-4">🐷</motion.div>
      <motion.p custom={1} variants={textFadeUp} className="text-sm font-outfit font-semibold text-white/60 uppercase tracking-widest mb-2">
        This month you saved
      </motion.p>
      <motion.h1 custom={2} variants={textFadeUp} className="text-6xl font-outfit font-extrabold text-white mb-3">
        $42.50
      </motion.h1>
      <motion.p custom={3} variants={textFadeUp} className="text-lg font-outfit text-white/80 mb-6">
        That's <span className="font-bold text-white">14 coffees</span> ☕ or <span className="font-bold text-white">2 months of Netflix</span>
      </motion.p>
      <motion.div
        custom={4} variants={textFadeUp}
        className="rounded-2xl bg-white/10 backdrop-blur px-5 py-3 border border-white/20"
      >
        <p className="text-xs font-outfit text-white/70">
          You saved <span className="text-white font-bold">15% more</span> than the average Reroot user in Toronto!
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Slide 1: Health Score ─── */
function Slide1() {
  return (
    <motion.div
      initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}
      className="h-full flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.p custom={0} variants={textFadeUp} className="text-sm font-outfit font-semibold text-white/60 uppercase tracking-widest mb-2">
        Your Health Score
      </motion.p>
      <motion.div custom={1} variants={textFadeUp} className="relative mb-4">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <motion.text
            x="60" y="72" textAnchor="middle" fill="white"
            fontFamily="Outfit" fontWeight="800" fontSize="56"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
          >
            A-
          </motion.text>
        </svg>
      </motion.div>

      <motion.div custom={2} variants={textFadeUp} className="w-full max-w-[280px] h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%">
            <PolarGrid stroke="rgba(255,255,255,0.15)" />
            <PolarAngleAxis dataKey="stat" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "Outfit" }} />
            <Radar name="Avg" dataKey="avg" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.08)" />
            <Radar name="You" dataKey="you" stroke="hsl(142 71% 55%)" fill="hsl(142 71% 45% / 0.25)" strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        custom={3} variants={textFadeUp}
        className="rounded-2xl bg-white/10 backdrop-blur px-5 py-3 border border-white/20"
      >
        <p className="text-sm font-outfit text-white/80">
          You're a <span className="font-bold text-emerald-300">Fiber Fanatic</span>. Your veggie intake is in the <span className="font-bold text-white">top 5%!</span>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Slide 2: Eco-Flex ─── */
function Slide2() {
  return (
    <motion.div
      initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}
      className="h-full flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.p custom={0} variants={textFadeUp} className="text-sm font-outfit font-semibold text-white/60 uppercase tracking-widest mb-3">
        Your Eco Impact
      </motion.p>

      {/* Growing tree */}
      <motion.div custom={1} variants={textFadeUp} className="relative mb-4">
        <motion.div
          className="text-8xl"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.4 }}
        >
          🌳
        </motion.div>
        {/* Sparkle particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300"
            style={{ top: "30%", left: "50%" }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos(i * 60 * Math.PI / 180) * 50,
              y: Math.sin(i * 60 * Math.PI / 180) * 50 - 20,
            }}
            transition={{ duration: 2, delay: 0.8 + i * 0.1, repeat: Infinity, repeatDelay: 1 }}
          />
        ))}
      </motion.div>

      <motion.h1 custom={2} variants={textFadeUp} className="text-5xl font-outfit font-extrabold text-white mb-2">
        3.2kg
      </motion.h1>
      <motion.p custom={2} variants={textFadeUp} className="text-lg font-outfit text-white/80 mb-1">
        of Food Rescued 🌿
      </motion.p>
      <motion.p custom={3} variants={textFadeUp} className="text-sm font-outfit text-white/60 mb-5">
        Equivalent to 8 meals saved from landfill
      </motion.p>

      <motion.div
        custom={4} variants={textFadeUp}
        className="rounded-2xl bg-white/10 backdrop-blur px-5 py-3 border border-white/20"
      >
        <p className="text-xs font-outfit text-white/70">
          You prevented <span className="text-white font-bold">8.5kg of CO2e</span>. That's cleaner than driving a Tesla for <span className="text-white font-bold">3 days</span>.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Slide 3: Diet Personality ─── */
function Slide3() {
  return (
    <motion.div
      initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}
      className="h-full flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.p custom={0} variants={textFadeUp} className="text-sm font-outfit font-semibold text-white/60 uppercase tracking-widest mb-2">
        Your Diet Personality
      </motion.p>
      <motion.h1 custom={1} variants={textFadeUp} className="text-3xl font-outfit font-extrabold text-white mb-2">
        The Smart Meal-Prepper 🧠
      </motion.h1>
      <motion.p custom={2} variants={textFadeUp} className="text-sm font-outfit text-white/70 mb-6 max-w-xs">
        You buy bulk on Sundays and snack on Tuesdays. Efficiency is your middle name.
      </motion.p>

      {/* Heatmap */}
      <motion.div custom={3} variants={textFadeUp} className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/15 mb-2">
        <div className="flex gap-1.5 mb-2">
          {heatmapDays.map((d) => (
            <span key={d} className="text-[9px] font-outfit text-white/50 w-8 text-center">{d}</span>
          ))}
        </div>
        {heatmapWeeks.map((week, wi) => (
          <div key={wi} className="flex gap-1.5 mb-1.5">
            {week.map((v, di) => (
              <motion.div
                key={di}
                className="w-8 h-8 rounded-lg"
                style={{ background: heatColor(v) }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + (wi * 7 + di) * 0.03, type: "spring", stiffness: 300, damping: 20 }}
              />
            ))}
          </div>
        ))}
        <p className="text-[9px] font-outfit text-white/40 mt-1">Shopping frequency · Feb 2026</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Slide 4: The Funny Stat ─── */
function Slide4() {
  return (
    <motion.div
      initial="hidden" animate="show" exit={{ opacity: 0, scale: 0.95 }}
      className="h-full flex flex-col items-center justify-center px-8 text-center"
    >
      {/* Cheese rain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl"
            style={{ left: `${8 + i * 7.5}%`, top: -40 }}
            animate={{ y: [0, window.innerHeight + 60], rotate: [0, 360] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
          >
            🧀
          </motion.span>
        ))}
      </div>

      <motion.p custom={0} variants={textFadeUp} className="text-sm font-outfit font-semibold text-white/60 uppercase tracking-widest mb-3 relative z-10">
        The Moment of Truth
      </motion.p>
      <motion.h1 custom={1} variants={textFadeUp} className="text-4xl font-outfit font-extrabold text-white mb-2 relative z-10">
        Gouda Vibes Only 🧀
      </motion.h1>
      <motion.p custom={2} variants={textFadeUp} className="text-lg font-outfit text-white/80 mb-2 relative z-10">
        You bought <span className="font-bold text-white">2.4kg of Cheese</span> this month.
      </motion.p>

      <motion.div
        custom={3} variants={textFadeUp}
        className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur px-5 py-3 border border-white/20 relative z-10"
      >
        <Trophy className="w-5 h-5 text-yellow-300" />
        <p className="text-sm font-outfit text-white/90">
          You are the <span className="font-extrabold text-yellow-300">#2 Buyer of Cheese</span> on Reroot
        </p>
      </motion.div>
    </motion.div>
  );
}