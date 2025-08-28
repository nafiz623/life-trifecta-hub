import { useState, useEffect } from "react";
import { Plus, Clock, Trash2, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Alarm, saveAlarms, loadAlarms } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AlarmClock() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmLabel, setAlarmLabel] = useState("");
  const [selectedDays, setSelectedDays] = useState<boolean[]>([false, false, false, false, false, false, false]);

  useEffect(() => {
    setAlarms(loadAlarms());
  }, []);

  useEffect(() => {
    saveAlarms(alarms);
  }, [alarms]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addAlarm = () => {
    if (!alarmTime) {
      toast({ title: "Please set alarm time" });
      return;
    }

    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: alarmTime,
      label: alarmLabel.trim() || "Alarm",
      enabled: true,
      daysOfWeek: selectedDays,
    };

    setAlarms(prev => [newAlarm, ...prev]);
    setIsDialogOpen(false);
    setAlarmTime("");
    setAlarmLabel("");
    setSelectedDays([false, false, false, false, false, false, false]);
    toast({ title: "Alarm created!" });
  };

  const toggleAlarm = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm =>
      alarm.id === alarmId
        ? { ...alarm, enabled: !alarm.enabled }
        : alarm
    ));
  };

  const deleteAlarm = (alarmId: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== alarmId));
    toast({ title: "Alarm deleted!" });
  };

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => {
      const newDays = [...prev];
      newDays[dayIndex] = !newDays[dayIndex];
      return newDays;
    });
  };

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getActiveDaysText = (daysOfWeek: boolean[]) => {
    const activeDays = daysOfWeek
      .map((active, index) => active ? dayNames[index] : null)
      .filter(Boolean);
    
    if (activeDays.length === 7) return "Daily";
    if (activeDays.length === 0) return "No repeat";
    if (activeDays.length === 5 && 
        daysOfWeek.slice(1, 6).every(d => d) && 
        !daysOfWeek[0] && !daysOfWeek[6]) return "Weekdays";
    if (activeDays.length === 2 && daysOfWeek[0] && daysOfWeek[6]) return "Weekends";
    
    return activeDays.join(", ");
  };

  const getNextAlarmTime = () => {
    const activeAlarms = alarms.filter(alarm => alarm.enabled);
    if (activeAlarms.length === 0) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTimeStr = now.toTimeString().slice(0, 5);

    let nextAlarm: { alarm: Alarm; nextTime: Date } | null = null;

    activeAlarms.forEach(alarm => {
      // Check today first
      if (alarm.daysOfWeek[currentDay] && alarm.time > currentTimeStr) {
        const nextTime = new Date();
        const [hours, minutes] = alarm.time.split(':').map(Number);
        nextTime.setHours(hours, minutes, 0, 0);

        if (!nextAlarm || nextTime < nextAlarm.nextTime) {
          nextAlarm = { alarm, nextTime };
        }
      } else {
        // Check upcoming days
        for (let i = 1; i <= 7; i++) {
          const dayIndex = (currentDay + i) % 7;
          if (alarm.daysOfWeek[dayIndex]) {
            const nextTime = new Date();
            nextTime.setDate(nextTime.getDate() + i);
            const [hours, minutes] = alarm.time.split(':').map(Number);
            nextTime.setHours(hours, minutes, 0, 0);

            if (!nextAlarm || nextTime < nextAlarm.nextTime) {
              nextAlarm = { alarm, nextTime };
            }
            break;
          }
        }
      }
    });

    return nextAlarm;
  };

  const nextAlarm = getNextAlarmTime();

  return (
    <MobileLayout title="Alarm Clock">
      <div className="space-y-6">
        {/* Current Time */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-mono font-bold text-primary">
              {currentTime.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Alarm */}
        {nextAlarm && (
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Next Alarm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatTime12Hour(nextAlarm.alarm.time)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {nextAlarm.alarm.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {nextAlarm.nextTime.toLocaleDateString() === new Date().toLocaleDateString() 
                    ? 'Today' 
                    : nextAlarm.nextTime.toLocaleDateString('en-US', { weekday: 'long' })
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Alarm Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Alarm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Alarm</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="alarmTime">Time</Label>
                <Input
                  id="alarmTime"
                  type="time"
                  value={alarmTime}
                  onChange={(e) => setAlarmTime(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="alarmLabel">Label</Label>
                <Input
                  id="alarmLabel"
                  value={alarmLabel}
                  onChange={(e) => setAlarmLabel(e.target.value)}
                  placeholder="Wake up, Meeting, etc."
                />
              </div>
              
              <div>
                <Label>Repeat Days</Label>
                <div className="flex gap-2 mt-2">
                  {dayNames.map((day, index) => (
                    <Button
                      key={day}
                      variant={selectedDays[index] ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDay(index)}
                      className="flex-1"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button onClick={addAlarm} className="w-full">
                Create Alarm
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Alarms List */}
        <div className="space-y-3">
          {alarms.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  No alarms set. Create your first alarm!
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Alarm
                </Button>
              </CardContent>
            </Card>
          ) : (
            alarms.map((alarm) => (
              <Card key={alarm.id} className={`transition-opacity ${alarm.enabled ? '' : 'opacity-50'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-2xl font-bold font-mono">
                        {formatTime12Hour(alarm.time)}
                      </div>
                      <div className="text-sm font-medium">{alarm.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {getActiveDaysText(alarm.daysOfWeek)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlarm(alarm.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        {alarm.enabled ? (
                          <Bell className="h-4 w-4 text-green-500" />
                        ) : (
                          <BellOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Switch
                          checked={alarm.enabled}
                          onCheckedChange={() => toggleAlarm(alarm.id)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {alarms.filter(a => a.enabled).length}
              </div>
              <div className="text-xs text-muted-foreground">Active Alarms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{alarms.length}</div>
              <div className="text-xs text-muted-foreground">Total Alarms</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}