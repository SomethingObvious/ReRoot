import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { FRIDGE_ITEMS, type FridgeItem, type ScannedReceipt } from "./mockData";
import { format, addDays } from "date-fns";

const categoryIcons: Record<string, string> = {
  Grocery: "🛒",
  Meat: "🥩",
  Produce: "🥬",
  Frozen: "🧊",
  Dairy: "🥛",
};

const categoryRecipes: Record<string, { title: string; description: string; prepTime: string }> = {
  Grocery: { title: "Pantry Stir-Fry", description: "Combine with veggies and sauce for a quick meal.", prepTime: "15 mins" },
  Meat: { title: "Simple Roast", description: "Season with salt, pepper & herbs. Roast at 375°F until done.", prepTime: "30 mins" },
  Produce: { title: "Fresh Salad Bowl", description: "Chop and toss with olive oil, lemon juice & seasoning.", prepTime: "10 mins" },
  Frozen: { title: "Quick Heat & Serve", description: "Heat in pan or microwave. Season to taste.", prepTime: "10 mins" },
};

const categoryTips: Record<string, string> = {
  Grocery: "Store in a cool, dry place away from direct sunlight.",
  Meat: "Keep on the bottom shelf to prevent drips. Use or freeze promptly.",
  Produce: "Store in the crisper drawer. Keep dry to prevent early spoilage.",
  Frozen: "Keep at 0°F or below. Don't refreeze once thawed.",
};

interface FridgeContextValue {
  fridgeItems: FridgeItem[];
  setFridgeItems: React.Dispatch<React.SetStateAction<FridgeItem[]>>;
  addItemsFromReceipt: (receipt: ScannedReceipt) => void;
  markSeen: (id: string) => void;
}

const FridgeContext = createContext<FridgeContextValue | null>(null);

export function FridgeProvider({ children }: { children: ReactNode }) {
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>(
    [...FRIDGE_ITEMS].sort((a, b) => a.daysLeft - b.daysLeft)
  );

  const addItemsFromReceipt = useCallback((receipt: ScannedReceipt) => {
    const perishableItems = receipt.lineItems.filter(
      (li) => li.storageLocation === "Fridge" || li.storageLocation === "Freezer"
    );

    const purchaseDay = new Date(receipt.purchaseDate + "T12:00:00");
    const purchaseDayStr = format(purchaseDay, "MMM d");

    const newFridgeItems: FridgeItem[] = perishableItems.map((li) => {
      const totalDays = li.estimatedExpiryDays ?? 7;
      const daysLeft = totalDays;
      const bestEnd = format(addDays(purchaseDay, Math.floor(totalDays * 0.6)), "MMM d");
      const useSoonStart = format(addDays(purchaseDay, Math.floor(totalDays * 0.6) + 1), "MMM d");
      const useSoonEnd = format(addDays(purchaseDay, Math.floor(totalDays * 0.85)), "MMM d");
      const riskStart = format(addDays(purchaseDay, Math.floor(totalDays * 0.85) + 1), "MMM d");

      const weight = li.weightKg
        ? `${li.weightKg}kg`
        : li.quantity > 1
        ? `${li.quantity} ${li.unit}`
        : li.unit;

      return {
        id: `fridge-${li.id}`,
        name: li.nameNormalized,
        daysLeft,
        totalDays,
        category: li.category,
        icon: categoryIcons[li.category] || "🍽️",
        weight,
        store: receipt.storeName,
        purchaseDate: purchaseDayStr,
        price: li.lineTotal,
        bestStart: purchaseDayStr,
        bestEnd,
        useSoonStart,
        useSoonEnd,
        riskStart,
        recipe: categoryRecipes[li.category] || categoryRecipes.Grocery,
        storageTip: categoryTips[li.category] || categoryTips.Grocery,
        remaining: 100,
        isNew: true,
      };
    });

    setFridgeItems((prev) => {
      const combined = [...newFridgeItems, ...prev].sort((a, b) => a.daysLeft - b.daysLeft);
      return combined;
    });
  }, []);

  const markSeen = useCallback((id: string) => {
    setFridgeItems((prev) => prev.map((item) => item.id === id ? { ...item, isNew: false } : item));
  }, []);

  return (
    <FridgeContext.Provider value={{ fridgeItems, setFridgeItems, addItemsFromReceipt, markSeen }}>
      {children}
    </FridgeContext.Provider>
  );
}

export function useFridge() {
  const ctx = useContext(FridgeContext);
  if (!ctx) throw new Error("useFridge must be used within FridgeProvider");
  return ctx;
}
