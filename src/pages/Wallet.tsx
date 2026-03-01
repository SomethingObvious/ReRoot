import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Coffee, TreePine } from "lucide-react";
import { toast } from "sonner";
import WalletCard from "@/components/WalletCard";
import { REDEMPTION_OPTIONS } from "@/lib/mockData";

const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  "shopping-bag": ShoppingBag,
  coffee: Coffee,
  trees: TreePine,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 30 } },
};

export default function Wallet() {
  const [donating, setDonating] = useState<string | null>(null);

  const handleRedeem = (option: (typeof REDEMPTION_OPTIONS)[0]) => {
    if (option.type === "charity") {
      setDonating(option.id);
      setTimeout(() => {
        setDonating(null);
        toast.success(`Donated to ${option.name}! 💚`, {
          description: "Thank you for making a difference.",
        });
      }, 2000);
    } else {
      toast.success(`${option.name} redeemed! 🎉`, {
        description: "Your gift card code has been sent to your email.",
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="px-5 pt-8 pb-32 max-w-lg mx-auto"
    >
      <motion.h1 variants={fadeUp} className="text-2xl font-outfit font-bold text-foreground mb-5">
        Wallet
      </motion.h1>

      <motion.div variants={fadeUp} className="mb-6">
        <WalletCard />
      </motion.div>

      <motion.h2 variants={fadeUp} className="text-sm font-outfit font-semibold text-foreground mb-3">
        Redemption Market
      </motion.h2>

      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        {REDEMPTION_OPTIONS.map((option) => {
          const Icon = iconMap[option.icon] || Heart;
          const isDonating = donating === option.id;

          return (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03, boxShadow: "0 14px 40px rgba(139,92,246,0.15)" }}
              onClick={() => handleRedeem(option)}
              className="glass-strong rounded-3xl p-4 text-left relative overflow-hidden"
              disabled={isDonating}
            >
              <AnimatePresence>
                {isDonating && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-primary/10 flex items-center justify-center rounded-3xl"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <Heart className="w-10 h-10 text-primary fill-primary" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                option.type === "charity" ? "bg-primary/10" : "bg-success/10"
              }`}>
                <Icon className={`w-5 h-5 ${
                  option.type === "charity" ? "text-primary" : "text-success"
                }`} />
              </div>
              <p className="text-sm font-outfit font-semibold text-foreground">{option.name}</p>
              <p className="text-[11px] font-outfit text-muted-foreground mt-0.5">{option.description}</p>
              <p className="text-xs font-outfit font-bold text-primary mt-2">{option.cost} pts</p>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
