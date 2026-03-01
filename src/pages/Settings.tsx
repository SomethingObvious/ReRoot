import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Download, ChevronRight } from "lucide-react";
import profilePhoto from "@/assets/profile-photo.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PRICE_WATCH_ITEMS } from "@/lib/mockData";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export default function Settings() {
  const navigate = useNavigate();
  const [watchItems, setWatchItems] = useState(PRICE_WATCH_ITEMS);

  const toggleWatch = (id: string) => {
    setWatchItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    toast.success("Saved ✓", { duration: 1500 });
  };

  const handleExport = () => {
    const data = JSON.stringify(
      { profile: { name: "Paul", joinDate: "2024-06-01" }, receipts: 42, totalSaved: 284 },
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reroot-data.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported! 📦");
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08 } } }}
      className="px-5 pt-14 pb-32 max-w-lg mx-auto"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </motion.button>
        <h1 className="text-2xl font-outfit font-bold text-foreground">Settings</h1>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-strong rounded-3xl p-5 mb-4 flex items-center gap-4">
        <img src={profilePhoto} alt="Paul" className="w-14 h-14 rounded-full object-cover shadow-md" />
        <div className="flex-1">
          <p className="text-base font-outfit font-semibold text-foreground">Paul</p>
          <p className="text-xs font-outfit text-muted-foreground">Member since Jun 2024</p>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </motion.div>

      <motion.div variants={fadeUp} className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-outfit font-semibold text-foreground">Price Watch Agent</h2>
        </div>
        <div className="glass-strong rounded-3xl overflow-hidden divide-y divide-border">
          {watchItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-outfit font-medium text-foreground">{item.name}</p>
                <p className="text-xs font-outfit text-muted-foreground">
                  Notify when under ${item.threshold.toFixed(2)}{item.unit}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWatch(item.id)}
                className="w-12 h-7 rounded-full flex items-center px-1 transition-colors"
                style={{
                  background: item.enabled
                    ? "linear-gradient(180deg, hsl(345 65% 55%), hsl(338 60% 45%))"
                    : "hsl(270 25% 93%)",
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-card shadow-sm"
                  animate={{ x: item.enabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
          className="w-full glass-strong rounded-3xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-outfit font-semibold text-foreground">Download My Data</p>
            <p className="text-xs font-outfit text-muted-foreground">Export as JSON</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
