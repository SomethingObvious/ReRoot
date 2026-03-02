# 🌱 ReRoot — Smart Grocery & Food Waste Tracker

ReRoot is a mobile-first web app that helps you track grocery spending, manage fridge inventory, reduce food waste, and earn rewards — all from scanning your receipts.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)

## ✨ Features

### 📸 Receipt Scanner
- Scan grocery receipts to automatically extract line items, prices, and categories
- Review and confirm parsed items before saving
- Supports multi-package and weighted items

### 🧊 Smart Fridge
- Automatically populates your virtual fridge from scanned receipts
- Tracks expiry dates with visual freshness indicators (Best / Use Soon / At Risk)
- Storage tips and recipe suggestions for each item
- Configurable expiry alerts by grocery category (1 day, 3 days, 1 week)

### 📊 Spending Stats
- Weekly and monthly spend tracking with interactive charts
- Category breakdowns (Produce, Dairy, Meat, Pantry, Bakery)
- Average cost per trip and trip frequency insights

### 💰 Rewards Wallet
- Earn points on every scanned receipt
- Redeem for gift cards or donate to charities (Food Banks Canada, tree planting)
- Tier progression system (Root Saver → Super Root!)

### ⚙️ Settings
- Expiry alert preferences per grocery category
- Price watch agent with custom price thresholds
- Store loyalty card management

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| Routing | React Router v6 |
| State | React Context + TanStack Query |

## 🚀 Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui primitives
│   ├── BottomNav     # Mobile navigation bar
│   ├── ScanOverlay   # Receipt scanning flow
│   ├── ReceiptReview # Post-scan item review
│   ├── NutroMeter    # Nutrition scoring widget
│   └── ...
├── pages/            # Route-level pages
│   ├── Dashboard     # Home feed with recent receipts
│   ├── Fridge        # Fridge inventory management
│   ├── Wallet        # Rewards & redemption
│   ├── Stats         # Spending analytics
│   └── Settings      # Preferences & alerts
├── lib/              # Utilities, context, and data
│   ├── receiptContext # Receipt state management
│   ├── fridgeContext  # Fridge state management
│   └── mockData      # Demo data & type definitions
└── assets/           # Static assets
```

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint codebase |

## 🌐 Deployment

The app is deployed at **[rerootit.lovable.app](https://rerootit.lovable.app)**.

## 📄 License

This project is private.
