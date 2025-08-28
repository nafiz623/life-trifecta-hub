import { useState, useEffect } from "react";
import { Plus, Target, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Habit, saveHabits, loadHabits } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

  useEffect(() => {
    setHabits(loadHabits());
  }, []);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addHabit = () => {
    if (!habitName.trim()) {
      toast({ title: "Please enter a habit name" });
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      description: habitDescription.trim(),
      startDate: new Date(),
    };

    setHabits(prev => [newHabit, ...prev]);
    setIsDialogOpen(false);
    setHabitName("");
    setHabitDescription("");
    toast({ title: "Habit tracking started!" });
  };

  const recordRelapse = (habitId: string) => {
    setHabits(prev => prev.map(habit =>
      habit.id === habitId
        ? { ...habit, lastRelapseDate: new Date() }
        : habit
    ));
    toast({ title: "Relapse recorded. Don't give up, keep trying!" });
  };

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    toast({ title: "Habit deleted!" });
  };

  const calculateTimeSince = (startDate: Date, lastRelapseDate?: Date) => {
    const referenceDate = lastRelapseDate || startDate;
    const now = new Date();
    const diffInMs = now.getTime() - referenceDate.getTime();
    
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    return { days, hours, minutes, months, remainingDays };
  };

  const formatDuration = (time: ReturnType<typeof calculateTimeSince>) => {
    if (time.months > 0) {
      return `${time.months}m ${time.remainingDays}d ${time.hours}h`;
    } else if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m`;
    } else {
      return `${time.minutes}m`;
    }
  };

  const getStreakColor = (days: number) => {
    if (days < 7) return "text-red-500";
    if (days < 30) return "text-orange-500";
    if (days < 90) return "text-blue-500";
    if (days < 365) return "text-green-500";
    return "text-purple-500";
  };

  const getStreakBadge = (days: number) => {
    if (days < 7) return "🔥 Starting";
    if (days < 30) return "💪 Building";
    if (days < 90) return "🚀 Strong";
    if (days < 365) return "🏆 Champion";
    return "👑 Master";
  };

  return (
    <MobileLayout title="Habit Tracker">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{habits.length}</div>
              <div className="text-xs text-muted-foreground">Active Habits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {habits.filter(h => calculateTimeSince(h.startDate, h.lastRelapseDate).days >= 30).length}
              </div>
              <div className="text-xs text-muted-foreground">30+ Day Streaks</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Habit Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Track New Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start Tracking Bad Habit</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="habitName">Habit Name</Label>
                <Input
                  id="habitName"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g., Smoking, Social Media, Junk Food"
                />
              </div>
              <div>
                <Label htmlFor="habitDescription">Description (Optional)</Label>
                <Textarea
                  id="habitDescription"
                  value={habitDescription}
                  onChange={(e) => setHabitDescription(e.target.value)}
                  placeholder="What triggered this habit? What's your goal?"
                  rows={3}
                />
              </div>
              <Button onClick={addHabit} className="w-full">
                Start Tracking
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Habits List */}
        <div className="space-y-4">
          {habits.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No habits being tracked yet. Start your journey to break bad habits!
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Track First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            habits.map((habit) => {
              const timeData = calculateTimeSince(habit.startDate, habit.lastRelapseDate);
              const streakColor = getStreakColor(timeData.days);
              const streakBadge = getStreakBadge(timeData.days);
              
              return (
                <Card key={habit.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{habit.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {streakBadge}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteHabit(habit.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Timer Display */}
                      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                        <div className={`text-2xl font-bold font-mono ${streakColor}`}>
                          {formatDuration(timeData)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {habit.lastRelapseDate ? 'Since last relapse' : 'Since started'}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-500">{timeData.days}</div>
                          <div className="text-xs text-muted-foreground">Days</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-500">{timeData.hours}</div>
                          <div className="text-xs text-muted-foreground">Hours</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-500">{timeData.minutes}</div>
                          <div className="text-xs text-muted-foreground">Minutes</div>
                        </div>
                      </div>

                      {/* Description */}
                      {habit.description && (
                        <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                          {habit.description}
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        onClick={() => recordRelapse(habit.id)}
                        variant="destructive"
                        className="w-full"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Record Relapse
                      </Button>

                      {/* Start Date */}
                      <div className="text-xs text-muted-foreground text-center">
                        Started: {habit.startDate.toLocaleDateString()}
                        {habit.lastRelapseDate && (
                          <span className="block">
                            Last relapse: {habit.lastRelapseDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
}