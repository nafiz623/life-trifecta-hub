import { Clock, Timer, Repeat, Calendar, FileText, CheckSquare, AlarmClock, Type, Calculator, DollarSign, Target, Clock4 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useEffect, useState } from "react";

const features = [
  { icon: Clock, title: "Digital Clock", description: "Real-time clock display", path: "/clock", color: "text-blue-500" },
  { icon: Timer, title: "Stopwatch", description: "Track elapsed time", path: "/stopwatch", color: "text-green-500" },
  { icon: Repeat, title: "Tasbeeh Counter", description: "Multi-event counter", path: "/tasbeeh", color: "text-purple-500" },
  { icon: Calendar, title: "Calendar", description: "Events & notes", path: "/calendar", color: "text-red-500" },
  { icon: FileText, title: "Notes", description: "Quick notes", path: "/notes", color: "text-yellow-500" },
  { icon: CheckSquare, title: "To-Do List", description: "Task management", path: "/todos", color: "text-indigo-500" },
  { icon: AlarmClock, title: "Alarm Clock", description: "Set alarms", path: "/alarms", color: "text-orange-500" },
  { icon: Type, title: "Word Clock", description: "Time in words", path: "/word-clock", color: "text-pink-500" },
  { icon: Calculator, title: "Calculator", description: "Scientific calculator", path: "/calculator", color: "text-cyan-500" },
  { icon: DollarSign, title: "Finance Tracker", description: "Income & expenses", path: "/finance", color: "text-emerald-500" },
  { icon: Target, title: "Habit Tracker", description: "Break bad habits", path: "/habits", color: "text-rose-500" },
  { icon: Clock4, title: "Prayer Times", description: "5 daily prayers", path: "/prayer-times", color: "text-amber-500" },
];

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <MobileLayout title="Life Trifecta">
      <div className="space-y-6">
        {/* Current Time Display */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-mono font-bold text-primary">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {formatDate(currentTime)}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">Active Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">5</div>
              <div className="text-xs text-muted-foreground">Habits Tracked</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.path} to={feature.path}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${feature.color}`} />
                        <CardTitle className="text-sm">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}