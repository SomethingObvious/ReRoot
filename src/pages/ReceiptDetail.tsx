import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Flag } from "lucide-react";
import { toast } from "sonner";
import { RECEIPT_HISTORY } from "@/lib/mockData";
import ReceiptTicket from "@/components/ReceiptTicket";

export default function ReceiptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const receipt = RECEIPT_HISTORY.find((r) => r.id === id);

  if (!receipt) {
    return (
      <div className="px-5 pt-14 pb-32 max-w-lg mx-auto text-center">
        <p className="text-muted-foreground font-outfit">Receipt not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="px-5 pt-14 pb-32 max-w-lg mx-auto"
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full glass flex items-center justify-center mb-4"
      >
        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
      </motion.button>

      <div className="relative">
        <div
          className="absolute inset-0 rounded-t-3xl opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <ReceiptTicket receipt={receipt} full />
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          toast.info("Support ticket #402 created", {
            description: "We'll review this receipt within 24 hours.",
          })
        }
        className="mt-6 w-full py-3.5 btn-gel rounded-full flex items-center justify-center gap-2 text-sm font-outfit font-medium"
      >
        <Flag className="w-4 h-4" />
        Report Issue
      </motion.button>
    </motion.div>
  );
}
