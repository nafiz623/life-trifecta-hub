import { useState } from "react";
import { Menu, X, Clock, Timer, Repeat, Calendar, FileText, CheckSquare, AlarmClock, Type, Calculator, DollarSign, Target, Clock4 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Clock, label: "Digital Clock", path: "/clock" },
  { icon: Timer, label: "Stopwatch", path: "/stopwatch" },
  { icon: Repeat, label: "Tasbeeh Counter", path: "/tasbeeh" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: CheckSquare, label: "To-Do List", path: "/todos" },
  { icon: AlarmClock, label: "Alarm Clock", path: "/alarms" },
  { icon: Type, label: "Word Clock", path: "/word-clock" },
  { icon: Calculator, label: "Calculator", path: "/calculator" },
  { icon: DollarSign, label: "Finance Tracker", path: "/finance" },
  { icon: Target, label: "Habit Tracker", path: "/habits" },
  { icon: Clock4, label: "Prayer Times", path: "/prayer-times" },
];

export function TopAppBar({ title }: { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Life Trifecta Features
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}