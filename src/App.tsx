import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Fridge from "./pages/Fridge";
import Stats from "./pages/Stats";
import Settings from "./pages/Settings";
import ReceiptDetail from "./pages/ReceiptDetail";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import ScanOverlay from "./components/ScanOverlay";

const queryClient = new QueryClient();

const App = () => {
  const [scanOpen, setScanOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/fridge" element={<Fridge />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/receipt/:id" element={<ReceiptDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav onScanClick={() => setScanOpen(true)} />
          <ScanOverlay isOpen={scanOpen} onClose={() => setScanOpen(false)} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
