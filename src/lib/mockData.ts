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

export const DEMO_RECEIPT: Receipt = {
  id: "rcpt-001",
  store: "Metro",
  date: "2024-12-15",
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
    date: "2024-12-12",
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
    date: "2024-12-08",
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
  remaining: number; // 0-100
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
    purchaseDate: "Feb 20",
    price: 4.99,
    bestStart: "Feb 20",
    bestEnd: "Feb 24",
    useSoonStart: "Feb 25",
    useSoonEnd: "Feb 26",
    riskStart: "Feb 27",
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
    purchaseDate: "Feb 21",
    price: 9.99,
    bestStart: "Feb 21",
    bestEnd: "Feb 24",
    useSoonStart: "Feb 25",
    useSoonEnd: "Feb 26",
    riskStart: "Feb 27",
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
    store: "Loblaws",
    purchaseDate: "Feb 19",
    price: 5.29,
    bestStart: "Feb 19",
    bestEnd: "Feb 26",
    useSoonStart: "Feb 27",
    useSoonEnd: "Feb 28",
    riskStart: "Mar 1",
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
    purchaseDate: "Feb 18",
    price: 6.49,
    bestStart: "Feb 18",
    bestEnd: "Feb 28",
    useSoonStart: "Mar 1",
    useSoonEnd: "Mar 2",
    riskStart: "Mar 3",
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
    store: "No Frills",
    purchaseDate: "Feb 20",
    price: 3.29,
    bestStart: "Feb 20",
    bestEnd: "Feb 26",
    useSoonStart: "Feb 27",
    useSoonEnd: "Feb 28",
    riskStart: "Mar 1",
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
    purchaseDate: "Feb 15",
    price: 7.99,
    bestStart: "Feb 15",
    bestEnd: "Mar 10",
    useSoonStart: "Mar 11",
    useSoonEnd: "Mar 14",
    riskStart: "Mar 15",
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
    store: "No Frills",
    purchaseDate: "Feb 21",
    price: 2.49,
    bestStart: "Feb 21",
    bestEnd: "Feb 24",
    useSoonStart: "Feb 25",
    useSoonEnd: "Feb 26",
    riskStart: "Feb 27",
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
