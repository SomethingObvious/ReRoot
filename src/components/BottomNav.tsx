import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Wallet, ScanLine, Refrigerator, BarChart3, Camera } from "lucide-react";

interface BottomNavProps {
  onScanClick: () => void;
}

const tabs = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/wallet", icon: Wallet, label: "Wallet" },
  { path: "scan", icon: ScanLine, label: "Scan" },
  { path: "/fridge", icon: Refrigerator, label: "Fridge" },
  { path: "/stats", icon: BarChart3, label: "Stats" },
];

export default function BottomNav({ onScanClick }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-5 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass-strong rounded-[28px] px-2 py-2 flex items-center gap-1 pointer-events-auto max-w-md w-full"
      >
        {tabs.map((tab) => {
          const isActive = tab.path !== "scan" && location.pathname === tab.path;
          const isScan = tab.path === "scan";

          if (isScan) {
            return (
              <div key="scan" className="relative -mt-8 mx-1">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={onScanClick}
                  className="relative w-16 h-16 rounded-full flex items-center justify-center ring-4 ring-white/30"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, hsl(0 0% 100%), hsl(347 77% 50%), hsl(347 77% 42%))",
                    boxShadow:
                      "inset 0 4px 6px rgba(255,255,255,0.9), inset 0 -6px 10px rgba(0,0,0,0.3), 0 10px 30px rgba(225,29,72,0.5)",
                  }}
                >
                  <Camera className="w-7 h-7 text-white" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))" }} />
                </motion.button>
                <span className="text-[10px] font-medium text-muted-foreground text-center block mt-1">
                  Scan
                </span>
              </div>
            );
          }

          return (
            <motion.button
              key={tab.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className="relative flex-1 flex flex-col items-center py-2 px-1 rounded-2xl"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  style={{ boxShadow: "0 0 12px rgba(139,92,246,0.15)" }}
                />
              )}
              <tab.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-primary drop-shadow-sm" : "text-muted-foreground"
                }`}
                style={isActive ? { filter: "drop-shadow(0 0 4px rgba(139,92,246,0.4))" } : {}}
              />
              <span
                className={`text-[10px] font-medium mt-0.5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}
