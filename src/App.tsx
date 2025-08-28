import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";

// Pages
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import DigitalClock from "./pages/DigitalClock";
import Stopwatch from "./pages/Stopwatch";
import TasbeehCounter from "./pages/TasbeehCounter";
import Calendar from "./pages/Calendar";
import Notes from "./pages/Notes";
import TodoList from "./pages/TodoList";
import AlarmClock from "./pages/AlarmClock";
import WordClock from "./pages/WordClock";
import Calculator from "./pages/Calculator";
import FinanceTracker from "./pages/FinanceTracker";
import HabitTracker from "./pages/HabitTracker";
import PrayerTimes from "./pages/PrayerTimes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="life-trifecta-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/clock" element={<DigitalClock />} />
            <Route path="/stopwatch" element={<Stopwatch />} />
            <Route path="/tasbeeh" element={<TasbeehCounter />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/todos" element={<TodoList />} />
            <Route path="/alarms" element={<AlarmClock />} />
            <Route path="/word-clock" element={<WordClock />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/finance" element={<FinanceTracker />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/prayer-times" element={<PrayerTimes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
