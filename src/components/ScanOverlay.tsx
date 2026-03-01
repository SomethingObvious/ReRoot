import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, ImagePlus, Zap, ZapOff } from "lucide-react";
import confetti from "canvas-confetti";
import { DEMO_SCANNED_RECEIPT, type ScannedReceipt } from "@/lib/mockData";
import ReceiptReview from "./ReceiptReview";

interface ScanOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const processingTexts = [
  "Photosynthesizing...",
  "Identifying items...",
  "Checking prices...",
  "Tallying savings...",
];

function fireConfetti() {
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };
  confetti({ ...defaults, particleCount: 80, spread: 80, colors: ["#8B5CF6", "#D946EF", "#4ADE80", "#A78BFA"] });
  confetti({ ...defaults, particleCount: 40, spread: 120, shapes: ["circle"], colors: ["#4ADE80", "#8B5CF6"], scalar: 0.8 });
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
  const [stage, setStage] = useState<"viewfinder" | "processing" | "review" | "done">("viewfinder");
  const [processingText, setProcessingText] = useState(0);
  const [result, setResult] = useState<ScannedReceipt | null>(null);
  const [flash, setFlash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start camera when overlay opens
  useEffect(() => {
    if (isOpen && stage === "viewfinder") {
      startCamera();
    }
    return () => stopCamera();
  }, [isOpen, stage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 1920 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      // Camera not available — user can still use file upload
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    stopCamera();
    processCapture();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    stopCamera();
    processCapture();
  }, []);

  const processCapture = () => {
    setStage("processing");
    let textIdx = 0;
    const interval = setInterval(() => {
      textIdx = (textIdx + 1) % processingTexts.length;
      setProcessingText(textIdx);
    }, 900);

    // Simulate processing (Wizard of Oz)
    setTimeout(() => {
      clearInterval(interval);
      setResult(DEMO_SCANNED_RECEIPT);
      setStage("review");
    }, 3200);
  };

  const handleConfirm = (_receipt: ScannedReceipt) => {
    setStage("done");
    setTimeout(fireConfetti, 200);
  };

  const handleClose = () => {
    stopCamera();
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
          className="fixed inset-0 z-50 flex flex-col overflow-hidden"
          style={{
            background: "linear-gradient(160deg, hsl(258 40% 28%) 0%, hsl(270 35% 22%) 50%, hsl(250 30% 20%) 100%)",
          }}
        >
          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Header */}
          <div className="flex items-center justify-between p-4 pt-12">
            <h2 className="text-primary-foreground text-lg font-semibold font-outfit">
              {stage === "viewfinder" && "Scan Receipt"}
              {stage === "processing" && "Processing"}
              {stage === "review" && "Review Receipt"}
              {stage === "done" && "Receipt Saved!"}
            </h2>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-primary-foreground" />
            </motion.button>
          </div>

          {/* Flash toggle */}
          {stage === "viewfinder" && (
            <div className="flex items-center justify-end px-5 py-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setFlash(!flash)}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: flash ? "hsl(45 93% 50% / 0.2)" : "hsl(0 0% 100% / 0.1)" }}
              >
                {flash
                  ? <Zap className="w-4 h-4" style={{ color: "hsl(45 93% 55%)" }} />
                  : <ZapOff className="w-4 h-4" style={{ color: "hsl(0 0% 60%)" }} />}
              </motion.button>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 overflow-hidden">
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
                  {/* Live camera feed */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 to-black/40 pointer-events-none" />

                  {/* Corner brackets */}
                  {[
                    "top-4 left-4 border-t-2 border-l-2",
                    "top-4 right-4 border-t-2 border-r-2",
                    "bottom-4 left-4 border-b-2 border-l-2",
                    "bottom-4 right-4 border-b-2 border-r-2",
                  ].map((pos, i) => (
                    <div key={i} className={`absolute w-12 h-12 ${pos} border-primary rounded-md`} />
                  ))}

                  {/* Scan line */}
                  <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />

                  <div className="absolute bottom-8 inset-x-0 text-center">
                    <p className="text-purple-200/70 text-sm font-outfit">
                      Position receipt within frame
                    </p>
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

              {stage === "review" && result && (
                <motion.div
                  key="review"
                  initial={{ y: 300, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                  className="w-full max-w-sm max-h-[75vh] overflow-y-auto pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  <ReceiptReview receipt={result} onConfirm={handleConfirm} />
                </motion.div>
              )}

              {stage === "done" && result && (
                <motion.div
                  key="done"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(142 71% 45% / 0.2)" }}
                  >
                    <span className="text-4xl">✅</span>
                  </motion.div>
                  <div>
                    <p className="text-xl font-outfit font-bold text-primary-foreground">Receipt Saved!</p>
                    <p className="text-purple-200/70 text-sm font-outfit mt-1">
                      {result.lineItems.length} items added • ${result.finalTotal.toFixed(2)}
                    </p>
                    <p className="text-sm font-outfit font-semibold mt-2" style={{ color: "hsl(142 71% 55%)" }}>
                      +{result.pointsEarned} points earned 🌱
                    </p>
                  </div>

                  {/* Quick insights preview */}
                  <div className="w-full max-w-xs space-y-2">
                    {result.lineItems
                      .filter((i) => i.estimatedExpiryDays !== undefined && i.estimatedExpiryDays <= 7)
                      .slice(0, 3)
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/10">
                          <span className="text-sm font-outfit text-purple-200">{item.nameNormalized}</span>
                          <span className="text-xs font-outfit font-medium" style={{ color: "hsl(0 70% 60%)" }}>
                            Use in {item.estimatedExpiryDays}d
                          </span>
                        </div>
                      ))}
                    {result.lineItems.some((i) => i.estimatedExpiryDays !== undefined && i.estimatedExpiryDays <= 7) && (
                      <p className="text-[11px] text-purple-300/60 font-outfit text-center">
                        ⏱ Items expiring soon — check your Fridge tab
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom buttons */}
          {stage === "viewfinder" && (
            <div className="p-6 pb-10 flex items-center justify-center gap-6">
              {/* File upload button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 border border-white/20"
              >
                <ImagePlus className="w-6 h-6 text-purple-200" />
              </motion.button>

              {/* Shutter button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full flex items-center justify-center ring-4 ring-white/30"
                style={{
                  background: "radial-gradient(circle at 35% 35%, hsl(0 0% 100%), hsl(0 0% 85%), hsl(0 0% 70%))",
                  boxShadow:
                    "inset 0 4px 8px rgba(255,255,255,0.9), inset 0 -6px 12px rgba(0,0,0,0.25), 0 8px 30px rgba(255,255,255,0.15)",
                }}
              >
                <Camera className="w-7 h-7 text-foreground/70" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
              </motion.button>

              {/* Spacer for symmetry */}
              <div className="w-14 h-14" />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {stage === "done" && (
            <div className="p-6 pb-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="w-full py-4 rounded-full font-outfit font-semibold text-lg shadow-deep"
                style={{
                  background: "linear-gradient(180deg, hsl(142 71% 50%) 0%, hsl(142 71% 40%) 100%)",
                  color: "white",
                }}
              >
                Done
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
