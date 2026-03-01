export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Receipt {
  id: string;
  store: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  savings: number;
  pointsEarned: number;
}

// ── New structured receipt types ──

export type Confidence = "High" | "Medium" | "Low";
export type ItemCategory = "Grocery" | "Meat" | "Produce" | "Frozen";
export type StorageLocation = "Fridge" | "Freezer" | "Pantry";

export interface LineItem {
  id: string;
  category: ItemCategory;
  brand: string | null;
  nameNormalized: string;
  nameRaw?: string;
  quantity: number;
  unit: string;
  unitPrice: number | null;
  weightKg: number | null;
  lineTotal: number;
  packageCosts?: number[];
  packageWeights?: (number | null)[];
  confidence: Confidence;
  needsReview: boolean;
  estimatedExpiryDays?: number;
  storageLocation?: StorageLocation;
}

export interface ScannedReceipt {
  id: string;
  createdAt: string;
  storeName: string;
  purchaseDate: string;
  currency: string;
  finalTotal: number;
  extractedItemsTotal: number;
  adjustmentsTotal: number;
  lineItems: LineItem[];
  pointsEarned: number;
}

export const DEMO_SCANNED_RECEIPT: ScannedReceipt = {
  id: "demo-receipt-001",
  createdAt: new Date().toISOString(),
  storeName: "Metro",
  purchaseDate: "2026-02-18",
  currency: "CAD",
  finalTotal: 80.91,
  extractedItemsTotal: 88.11,
  adjustmentsTotal: -7.20,
  pointsEarned: 52,
  lineItems: [
    {
      id: "item-001",
      category: "Grocery",
      brand: "Selection",
      nameNormalized: "Italian Spices",
      quantity: 2,
      unit: "each",
      unitPrice: 1.79,
      weightKg: null,
      lineTotal: 3.58,
      confidence: "High",
      needsReview: false,
      estimatedExpiryDays: 365,
      storageLocation: "Pantry",
    },
    {
      id: "item-002",
      category: "Grocery",
      brand: "Selection",
      nameNormalized: "Canned Tomatoes",
      quantity: 3,
      unit: "each",
      unitPrice: 1.79,
      weightKg: null,
      lineTotal: 5.37,
      confidence: "High",
      needsReview: false,
      estimatedExpiryDays: 730,
      storageLocation: "Pantry",
    },
    {
      id: "item-003",
      category: "Grocery",
      brand: "Selection",
      nameNormalized: "Pickles",
      quantity: 1,
      unit: "unit",
      unitPrice: 3.99,
      weightKg: null,
      lineTotal: 3.99,
      confidence: "Medium",
      needsReview: true,
      estimatedExpiryDays: 365,
      storageLocation: "Pantry",
    },
    {
      id: "item-004",
      category: "Grocery",
      brand: "Unico",
      nameNormalized: "Pickled Peppers",
      quantity: 1,
      unit: "unit",
      unitPrice: 3.49,
      weightKg: null,
      lineTotal: 3.49,
      confidence: "Medium",
      needsReview: true,
      estimatedExpiryDays: 365,
      storageLocation: "Pantry",
    },
    {
      id: "item-009",
      category: "Grocery",
      brand: "Selection",
      nameNormalized: "Eggs (30 Large)",
      quantity: 1,
      unit: "each",
      unitPrice: null,
      weightKg: null,
      lineTotal: 9.99,
      confidence: "Medium",
      needsReview: false,
      estimatedExpiryDays: 28,
      storageLocation: "Fridge",
    },
    {
      id: "item-005",
      category: "Meat",
      brand: null,
      nameNormalized: "Pork Tenderloin",
      quantity: 4,
      unit: "packages",
      unitPrice: null,
      weightKg: null,
      lineTotal: 44.0,
      packageCosts: [9.10, 11.42, 11.0, 12.48],
      packageWeights: [null, null, null, null],
      confidence: "Medium",
      needsReview: true,
      estimatedExpiryDays: 3,
      storageLocation: "Fridge",
    },
    {
      id: "item-006",
      category: "Produce",
      brand: null,
      nameNormalized: "Green Cabbage",
      quantity: 1,
      unit: "kg",
      unitPrice: 2.18,
      weightKg: 2.395,
      lineTotal: 5.22,
      confidence: "High",
      needsReview: false,
      estimatedExpiryDays: 7,
      storageLocation: "Fridge",
    },
    {
      id: "item-007",
      category: "Frozen",
      brand: "McCain",
      nameNormalized: "Superfries Crinkle Cut",
      quantity: 1,
      unit: "each",
      unitPrice: null,
      weightKg: null,
      lineTotal: 5.49,
      confidence: "Medium",
      needsReview: false,
      estimatedExpiryDays: 270,
      storageLocation: "Freezer",
    },
    {
      id: "item-008",
      category: "Frozen",
      brand: "Ferma",
      nameNormalized: "Mixed Vegetables",
      quantity: 2,
      unit: "each",
      unitPrice: 3.49,
      weightKg: null,
      lineTotal: 6.98,
      confidence: "High",
      needsReview: false,
      estimatedExpiryDays: 365,
      storageLocation: "Freezer",
    },
  ],
};

// ── Legacy types (unchanged) ──

export const DEMO_RECEIPT: Receipt = {
  id: "rcpt-001",
  store: "Metro",
  date: "2026-02-22",
  total: 47.83,
  savings: 6.2,
  pointsEarned: 48,
  items: [
    { name: "Organic Bananas", price: 2.49, quantity: 1, category: "Produce" },
    { name: "Baby Spinach 312g", price: 4.99, quantity: 1, category: "Produce" },
    { name: "Whole Wheat Bread", price: 3.49, quantity: 1, category: "Bakery" },
    { name: "2% Milk 2L", price: 5.29, quantity: 1, category: "Dairy" },
    { name: "Chicken Breast 500g", price: 9.99, quantity: 1, category: "Meat" },
    { name: "Greek Yogurt 750g", price: 6.49, quantity: 1, category: "Dairy" },
    { name: "Red Peppers", price: 3.29, quantity: 2, category: "Produce" },
    { name: "Cheddar Cheese 400g", price: 7.99, quantity: 1, category: "Dairy" },
    { name: "Pasta Sauce 650ml", price: 3.99, quantity: 1, category: "Pantry" },
  ],
};

export const RECEIPT_HISTORY: Receipt[] = [
  DEMO_RECEIPT,
  {
    id: "rcpt-002",
    store: "Loblaws",
    date: "2026-02-13",
    total: 32.15,
    savings: 3.8,
    pointsEarned: 32,
    items: [
      { name: "Avocados (3 pack)", price: 5.99, quantity: 1, category: "Produce" },
      { name: "Oat Milk 1L", price: 4.49, quantity: 2, category: "Dairy" },
      { name: "Brown Rice 1kg", price: 3.99, quantity: 1, category: "Pantry" },
      { name: "Tomatoes on Vine", price: 4.29, quantity: 1, category: "Produce" },
      { name: "Free Range Eggs 12", price: 6.99, quantity: 1, category: "Dairy" },
    ],
  },
  {
    id: "rcpt-003",
    store: "No Frills",
    date: "2026-02-06",
    total: 28.94,
    savings: 5.1,
    pointsEarned: 29,
    items: [
      { name: "Ground Beef 500g", price: 7.99, quantity: 1, category: "Meat" },
      { name: "Potatoes 5lb", price: 4.49, quantity: 1, category: "Produce" },
      { name: "Onions 3lb", price: 2.99, quantity: 1, category: "Produce" },
      { name: "Canned Tomatoes", price: 1.49, quantity: 3, category: "Pantry" },
      { name: "Sour Cream 500ml", price: 3.49, quantity: 1, category: "Dairy" },
    ],
  },
];

export const WALLET_DATA = {
  balance: 284,
  lifetimeEarned: 1_420,
  tier: "Root Saver",
  nextTier: "Super Root",
  nextTierAt: 500,
};

export const REDEMPTION_OPTIONS = [
  {
    id: "r1",
    name: "Food Banks Canada",
    type: "charity",
    cost: 250,
    icon: "heart",
    description: "Feed a family for a week",
  },
  {
    id: "r2",
    name: "Metro Gift Card",
    type: "gift",
    cost: 950,
    icon: "shopping-bag",
    description: "$10 Metro Gift Card",
  },
  { id: "r3", name: "Tim Hortons", type: "gift", cost: 500, icon: "coffee", description: "$5 Tim Hortons Card" },
  {
    id: "r4",
    name: "Tree Planting",
    type: "charity",
    cost: 100,
    icon: "trees",
    description: "Plant a tree in your name",
  },
];

export interface FridgeItem {
  id: string;
  name: string;
  daysLeft: number;
  totalDays: number;
  category: string;
  icon: string;
  weight: string;
  store: string;
  purchaseDate: string;
  price: number;
  bestStart: string;
  bestEnd: string;
  useSoonStart: string;
  useSoonEnd: string;
  riskStart: string;
  recipe: { title: string; description: string; prepTime: string };
  storageTip: string;
  remaining: number;
  isNew?: boolean;
  notes?: string;
}

export const FRIDGE_ITEMS: FridgeItem[] = [
  {
    id: "f1",
    name: "Baby Spinach",
    daysLeft: 2,
    totalDays: 7,
    category: "Produce",
    icon: "🥬",
    weight: "312g",
    store: "Metro",
    purchaseDate: "Feb 22",
    price: 4.99,
    bestStart: "Feb 22",
    bestEnd: "Feb 26",
    useSoonStart: "Feb 27",
    useSoonEnd: "Feb 28",
    riskStart: "Mar 1",
    recipe: {
      title: "Spinach & Feta Omelette",
      description: "Whisk eggs, fold in spinach and crumbled feta. Season with nutmeg.",
      prepTime: "10 mins",
    },
    storageTip: "Keep in original container. Place a dry paper towel inside to absorb moisture.",
    remaining: 75,
  },
  {
    id: "f2",
    name: "Chicken Breast",
    daysLeft: 3,
    totalDays: 5,
    category: "Meat",
    icon: "🍗",
    weight: "500g",
    store: "Metro",
    purchaseDate: "Feb 22",
    price: 9.99,
    bestStart: "Feb 22",
    bestEnd: "Feb 25",
    useSoonStart: "Feb 26",
    useSoonEnd: "Feb 27",
    riskStart: "Feb 28",
    recipe: {
      title: "Honey Garlic Glaze",
      description: "Pan-sear chicken, then coat with honey, garlic & soy reduction.",
      prepTime: "20 mins",
    },
    storageTip: "Store on the bottom shelf to prevent drips. Keep tightly sealed.",
    remaining: 100,
  },
  {
    id: "f3",
    name: "2% Milk",
    daysLeft: 5,
    totalDays: 10,
    category: "Dairy",
    icon: "🥛",
    weight: "2L",
    store: "Metro",
    purchaseDate: "Feb 22",
    price: 5.29,
    bestStart: "Feb 22",
    bestEnd: "Feb 28",
    useSoonStart: "Mar 1",
    useSoonEnd: "Mar 2",
    riskStart: "Mar 3",
    recipe: {
      title: "Creamy Mushroom Soup",
      description: "Sauté mushrooms, add flour roux, then milk for a velvety soup.",
      prepTime: "25 mins",
    },
    storageTip: "Always store at the back of the fridge where it's coldest, not in the door.",
    remaining: 60,
  },
  {
    id: "f4",
    name: "Greek Yogurt",
    daysLeft: 7,
    totalDays: 14,
    category: "Dairy",
    icon: "🥛",
    weight: "750g",
    store: "Metro",
    purchaseDate: "Feb 22",
    price: 6.49,
    bestStart: "Feb 22",
    bestEnd: "Mar 2",
    useSoonStart: "Mar 3",
    useSoonEnd: "Mar 5",
    riskStart: "Mar 6",
    recipe: {
      title: "Berry Parfait Bowl",
      description: "Layer yogurt with granola, honey, and mixed berries.",
      prepTime: "5 mins",
    },
    storageTip: "Keep sealed tightly. Stir if liquid separates on top—that's just whey.",
    remaining: 50,
  },
  {
    id: "f5",
    name: "Red Peppers",
    daysLeft: 4,
    totalDays: 8,
    category: "Produce",
    icon: "🫑",
    weight: "2 pcs",
    store: "Metro",
    purchaseDate: "Feb 22",
    price: 3.29,
    bestStart: "Feb 22",
    bestEnd: "Feb 27",
    useSoonStart: "Feb 28",
    useSoonEnd: "Mar 1",
    riskStart: "Mar 2",
    recipe: {
      title: "Stuffed Bell Peppers",
      description: "Fill halved peppers with rice, ground meat & cheese. Bake 25 mins.",
      prepTime: "35 mins",
    },
    storageTip: "Store whole in the crisper drawer. Cut peppers spoil faster.",
    remaining: 100,
  },
  {
    id: "f6",
    name: "Cheddar Cheese",
    daysLeft: 14,
    totalDays: 30,
    category: "Dairy",
    icon: "🧀",
    weight: "400g",
    store: "Metro",
    purchaseDate: "Feb 22",
    price: 7.99,
    bestStart: "Feb 22",
    bestEnd: "Mar 12",
    useSoonStart: "Mar 13",
    useSoonEnd: "Mar 18",
    riskStart: "Mar 19",
    recipe: {
      title: "Grilled Cheese Deluxe",
      description: "Sourdough, sharp cheddar, caramelized onions. Grill until golden.",
      prepTime: "15 mins",
    },
    storageTip: "Wrap in wax paper, then plastic wrap. Never freeze if possible.",
    remaining: 80,
  },
  {
    id: "f7",
    name: "Bananas",
    daysLeft: 2,
    totalDays: 5,
    category: "Produce",
    icon: "🍌",
    weight: "650g",
    store: "Loblaws",
    purchaseDate: "Feb 13",
    price: 2.49,
    bestStart: "Feb 13",
    bestEnd: "Feb 16",
    useSoonStart: "Feb 17",
    useSoonEnd: "Feb 18",
    riskStart: "Feb 19",
    recipe: {
      title: "Banana Bread Classic",
      description: "Mash overripe bananas into batter with walnuts and cinnamon.",
      prepTime: "60 mins",
    },
    storageTip: "Separate from other fruits. Wrap stems in plastic to slow ripening.",
    remaining: 100,
  },
];

export const STATS_DATA = {
  weeklySpend: [42, 38, 55, 47, 33, 51, 48],
  monthlyTotal: 312,
  avgPerTrip: 36.2,
  tripsThisMonth: 9,
  topCategories: [
    { name: "Produce", amount: 98, pct: 31 },
    { name: "Dairy", amount: 72, pct: 23 },
    { name: "Meat", amount: 56, pct: 18 },
    { name: "Pantry", amount: 48, pct: 15 },
    { name: "Bakery", amount: 38, pct: 12 },
  ],
};

export const PRICE_WATCH_ITEMS = [
  { id: "pw1", name: "Pork", threshold: 4.0, unit: "/lb", enabled: true },
  { id: "pw2", name: "Chicken Breast", threshold: 8.0, unit: "/kg", enabled: false },
  { id: "pw3", name: "Milk (2L)", threshold: 4.5, unit: "", enabled: true },
  { id: "pw4", name: "Eggs (12)", threshold: 5.0, unit: "", enabled: false },
  { id: "pw5", name: "Butter", threshold: 4.0, unit: "", enabled: false },
];
