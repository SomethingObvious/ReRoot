import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Scan, Zap, ZapOff, Sun, Contrast } from "lucide-react";
import confetti from "canvas-confetti";
import { scanReceipt } from "@/lib/api";
import type { Receipt } from "@/lib/mockData";
import ReceiptTicket from "./ReceiptTicket";

interface ScanOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const processingTexts = [
  "Photosynthesizing...",
  "Identifying Veggies...",
  "Checking Prices...",
  "Tallying Savings...",
];

function fireConfetti() {
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  confetti({
    ...defaults,
    particleCount: 80,
    spread: 80,
    colors: ["#8B5CF6", "#D946EF", "#4ADE80", "#A78BFA"],
  });
  confetti({
    ...defaults,
    particleCount: 40,
    spread: 120,
    shapes: ["circle"],
    colors: ["#4ADE80", "#8B5CF6"],
    scalar: 0.8,
  });
}

function PurpleBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 6 + Math.random() * 10,
            height: 6 + Math.random() * 10,
            left: `${10 + Math.random() * 80}%`,
            bottom: "-10px",
            background: `radial-gradient(circle, rgba(167,139,250,0.7), rgba(139,92,246,0.3))`,
            animation: `bubble-rise ${2 + Math.random() * 2}s ease-out ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function ScanOverlay({ isOpen, onClose }: ScanOverlayProps) {
  const [stage, setStage] = useState<"viewfinder" | "processing" | "result">("viewfinder");
  const [processingText, setProcessingText] = useState(0);
  const [result, setResult] = useState<Receipt | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [autoDetect, setAutoDetect] = useState(true);
  const [flash, setFlash] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [slidersActive, setSlidersActive] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStage("processing");
    let textIdx = 0;
    const interval = setInterval(() => {
      textIdx = (textIdx + 1) % processingTexts.length;
      setProcessingText(textIdx);
    }, 900);

    try {
      const receipt = await scanReceipt(file);
      clearInterval(interval);
      setResult(receipt);
      setStage("result");
      setTimeout(fireConfetti, 300);
    } catch {
      clearInterval(interval);
      setStage("viewfinder");
    }
  }, []);

  const handleClose = () => {
    setStage("viewfinder");
    setResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 35 }}
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            background: "linear-gradient(160deg, hsl(258 60% 20%) 0%, hsl(270 50% 12%) 50%, hsl(240 50% 15%) 100%)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-12">
            <h2 className="text-primary-foreground text-lg font-semibold font-outfit">
              {stage === "viewfinder" && "Scan Receipt"}
              {stage === "processing" && "Processing"}
              {stage === "result" && "Receipt Scanned!"}
            </h2>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </motion.button>
          </div>

          {/* Pro Mode Top Bar */}
          {stage === "viewfinder" && (
            <div className="flex items-center justify-between px-5 py-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setAutoDetect(!autoDetect)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-outfit font-semibold"
                style={{
                  background: autoDetect ? "hsl(142 71% 45% / 0.2)" : "hsl(0 0% 100% / 0.1)",
                  color: autoDetect ? "hsl(142 71% 60%)" : "hsl(0 0% 70%)",
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: autoDetect ? "hsl(142 71% 55%)" : "hsl(0 0% 50%)" }} />
                Auto-Detect
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setFlash(!flash)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: flash ? "hsl(45 93% 50% / 0.2)" : "hsl(0 0% 100% / 0.1)",
                }}
              >
                {flash
                  ? <Zap className="w-4 h-4" style={{ color: "hsl(45 93% 55%)" }} />
                  : <ZapOff className="w-4 h-4" style={{ color: "hsl(0 0% 60%)" }} />
                }
              </motion.button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <AnimatePresence mode="wait">
              {stage === "viewfinder" && (
                <motion.div
                  key="viewfinder"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-full max-w-sm aspect-[3/4] relative rounded-3xl overflow-hidden border-2 border-purple-400/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-950/60 to-black/80" />

                  {[
                    "top-4 left-4 border-t-2 border-l-2",
                    "top-4 right-4 border-t-2 border-r-2",
                    "bottom-4 left-4 border-b-2 border-l-2",
                    "bottom-4 right-4 border-b-2 border-r-2",
                  ].map((pos, i) => (
                    <div key={i} className={`absolute w-12 h-12 ${pos} border-primary rounded-md`} />
                  ))}

                  <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan className="w-16 h-16 text-purple-300/30" />
                  </div>

                  <div className="absolute bottom-8 inset-x-0 text-center">
                    <p className="text-purple-200/70 text-sm font-outfit">
                      Position receipt within frame
                    </p>
                  </div>

                  {/* Side Sliders */}
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 transition-opacity duration-300"
                    style={{ opacity: slidersActive ? 1 : 0.5 }}
                    onPointerDown={() => setSlidersActive(true)}
                    onPointerUp={() => setSlidersActive(false)}
                    onPointerLeave={() => setSlidersActive(false)}
                  >
                    {/* Brightness */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Sun className="w-3 h-3 text-white/60" />
                      <div className="relative w-1 h-24 rounded-full bg-white/20 overflow-hidden">
                        <motion.div
                          className="absolute bottom-0 w-full rounded-full bg-white/50"
                          style={{ height: `${brightness}%` }}
                        />
                        <input
                          type="range" min={0} max={100} value={brightness}
                          onChange={(e) => setBrightness(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          style={{ writingMode: "vertical-lr", direction: "rtl" }}
                        />
                      </div>
                    </div>
                    {/* Contrast */}
                    <div className="flex flex-col items-center gap-1.5">
                      <Contrast className="w-3 h-3 text-white/60" />
                      <div className="relative w-1 h-24 rounded-full bg-white/20 overflow-hidden">
                        <motion.div
                          className="absolute bottom-0 w-full rounded-full bg-white/50"
                          style={{ height: `${contrast}%` }}
                        />
                        <input
                          type="range" min={0} max={100} value={contrast}
                          onChange={(e) => setContrast(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          style={{ writingMode: "vertical-lr", direction: "rtl" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {stage === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex flex-col items-center gap-8 relative"
                >
                  <PurpleBubbles />

                  <motion.div
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-7xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    🌱
                  </motion.div>

                  <motion.p
                    key={processingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-purple-200 text-lg font-outfit font-medium"
                  >
                    {processingTexts[processingText]}
                  </motion.p>

                  <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, hsl(258 90% 66%), hsl(292 84% 61%))" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                    />
                  </div>
                </motion.div>
              )}

              {stage === "result" && result && (
                <motion.div
                  key="result"
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                  className="w-full max-w-sm max-h-[60vh] overflow-y-auto"
                >
                  <ReceiptTicket receipt={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom button — Shutter */}
          {stage === "viewfinder" && (
            <div className="p-6 pb-10 flex flex-col items-center">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full flex items-center justify-center ring-4 ring-white/30"
                style={{
                  background: "radial-gradient(circle at 35% 35%, hsl(0 0% 100%), hsl(0 0% 85%), hsl(0 0% 70%))",
                  boxShadow:
                    "inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -6px 12px rgba(0,0,0,0.25), 0 8px 30px rgba(255,255,255,0.15)",
                }}
              >
                <Camera className="w-7 h-7 text-foreground/70" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
              </motion.button>
              <p className="text-purple-200/60 text-[10px] font-outfit mt-2">Tap to capture</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {stage === "result" && (
            <div className="p-6 pb-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="w-full py-4 bg-success text-success-foreground rounded-full font-outfit font-semibold text-lg shadow-deep"
              >
                Done — +{result?.pointsEarned} pts earned!
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
