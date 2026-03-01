import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { RECEIPT_HISTORY, type Receipt, type ScannedReceipt } from "./mockData";

interface StoreLoyaltyEntry {
  name: string;
  value: number;
  color: string;
}

const DEFAULT_LOYALTY: StoreLoyaltyEntry[] = [
  { name: "Metro", value: 60, color: "hsl(0 84% 55%)" },
  { name: "Loblaws", value: 25, color: "hsl(45 93% 50%)" },
  { name: "Local Market", value: 15, color: "hsl(142 71% 45%)" },
];

interface ReceiptContextValue {
  receipts: Receipt[];
  storeLoyalty: StoreLoyaltyEntry[];
  addScannedReceipt: (scanned: ScannedReceipt) => void;
}

const ReceiptContext = createContext<ReceiptContextValue | null>(null);

export function ReceiptProvider({ children }: { children: ReactNode }) {
  const [receipts, setReceipts] = useState<Receipt[]>(RECEIPT_HISTORY);
  const [storeLoyalty, setStoreLoyalty] = useState<StoreLoyaltyEntry[]>(DEFAULT_LOYALTY);

  const addScannedReceipt = useCallback((scanned: ScannedReceipt) => {
    // Convert scanned receipt to legacy Receipt format for the list
    const newReceipt: Receipt = {
      id: scanned.id,
      store: scanned.storeName,
      date: scanned.purchaseDate,
      total: scanned.finalTotal,
      savings: Math.abs(scanned.adjustmentsTotal),
      pointsEarned: scanned.pointsEarned,
      items: scanned.lineItems.map((li) => ({
        name: `${li.quantity > 1 ? `${li.quantity}x ` : ""}${li.nameNormalized}`,
        price: li.lineTotal,
        quantity: 1,
        category: li.category,
      })),
    };

    setReceipts((prev) => [newReceipt, ...prev]);

    // Update store loyalty: Metro +5, Loblaws -2.5, Local Market -2.5
    setStoreLoyalty((prev) =>
      prev.map((entry) => {
        if (entry.name === "Metro") return { ...entry, value: entry.value + 5 };
        if (entry.name === "Loblaws") return { ...entry, value: entry.value - 2.5 };
        if (entry.name === "Local Market") return { ...entry, value: entry.value - 2.5 };
        return entry;
      })
    );
  }, []);

  return (
    <ReceiptContext.Provider value={{ receipts, storeLoyalty, addScannedReceipt }}>
      {children}
    </ReceiptContext.Provider>
  );
}

export function useReceipts() {
  const ctx = useContext(ReceiptContext);
  if (!ctx) throw new Error("useReceipts must be used within ReceiptProvider");
  return ctx;
}
