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
  savings: 6.20,
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
    savings: 3.80,
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
    savings: 5.10,
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
  { id: "r1", name: "Food Banks Canada", type: "charity", cost: 100, icon: "heart", description: "Feed a family for a week" },
  { id: "r2", name: "Metro Gift Card", type: "gift", cost: 200, icon: "shopping-bag", description: "$10 Metro Gift Card" },
  { id: "r3", name: "Tim Hortons", type: "gift", cost: 150, icon: "coffee", description: "$5 Tim Hortons Card" },
  { id: "r4", name: "Tree Planting", type: "charity", cost: 50, icon: "trees", description: "Plant a tree in your name" },
];

export const FRIDGE_ITEMS = [
  { name: "Baby Spinach", daysLeft: 2, category: "Produce", icon: "🥬" },
  { name: "Chicken Breast", daysLeft: 3, category: "Meat", icon: "🍗" },
  { name: "2% Milk", daysLeft: 5, category: "Dairy", icon: "🥛" },
  { name: "Greek Yogurt", daysLeft: 7, category: "Dairy", icon: "🥛" },
  { name: "Red Peppers", daysLeft: 4, category: "Produce", icon: "🫑" },
  { name: "Cheddar Cheese", daysLeft: 14, category: "Dairy", icon: "🧀" },
  { name: "Bananas", daysLeft: 2, category: "Produce", icon: "🍌" },
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
