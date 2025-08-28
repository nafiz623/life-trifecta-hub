import { useState, useEffect } from "react";
import { Clock, Bell, BellOff, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PrayerTime, savePrayerTimes, loadPrayerTimes } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function PrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingPrayer, setEditingPrayer] = useState<PrayerTime | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    setPrayerTimes(loadPrayerTimes());
  }, []);

  useEffect(() => {
    savePrayerTimes(prayerTimes);
  }, [prayerTimes]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const togglePrayer = (prayerId: string) => {
    setPrayerTimes(prev => prev.map(prayer =>
      prayer.id === prayerId
        ? { ...prayer, enabled: !prayer.enabled }
        : prayer
    ));
  };

  const openEditDialog = (prayer: PrayerTime) => {
    setEditingPrayer(prayer);
    setNewTime(prayer.time);
    setIsDialogOpen(true);
  };

  const updatePrayerTime = () => {
    if (!editingPrayer || !newTime) return;

    setPrayerTimes(prev => prev.map(prayer =>
      prayer.id === editingPrayer.id
        ? { ...prayer, time: newTime }
        : prayer
    ));

    setIsDialogOpen(false);
    setEditingPrayer(null);
    setNewTime("");
    toast({ title: `${editingPrayer.name} time updated!` });
  };

  const getNextPrayer = () => {
    const currentTimeStr = currentTime.toTimeString().slice(0, 5);
    const enabledPrayers = prayerTimes.filter(p => p.enabled);
    
    for (const prayer of enabledPrayers) {
      if (prayer.time > currentTimeStr) {
        return prayer;
      }
    }
    
    // If no prayer found for today, return first prayer of tomorrow
    return enabledPrayers[0];
  };

  const getTimeUntilNext = (nextPrayer: PrayerTime | undefined) => {
    if (!nextPrayer) return null;

    const [hours, minutes] = nextPrayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);

    // If prayer time has passed today, set it for tomorrow
    if (prayerTime <= currentTime) {
      prayerTime.setDate(prayerTime.getDate() + 1);
    }

    const diffMs = prayerTime.getTime() - currentTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return { hours: diffHours, minutes: diffMinutes };
  };

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getPrayerIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'fajr': return '🌅';
      case 'dhuhr': return '☀️';
      case 'asr': return '🌤️';
      case 'maghrib': return '🌅';
      case 'isha': return '🌙';
      default: return '🕌';
    }
  };

  const nextPrayer = getNextPrayer();
  const timeUntilNext = getTimeUntilNext(nextPrayer);

  return (
    <MobileLayout title="Prayer Times">
      <div className="space-y-6">
        {/* Current Time */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-mono font-bold text-primary">
              {currentTime.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </CardContent>
        </Card>

        {/* Next Prayer */}
        {nextPrayer && timeUntilNext && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">{getPrayerIcon(nextPrayer.name)}</span>
                Next: {nextPrayer.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatTime12Hour(nextPrayer.time)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  in {timeUntilNext.hours}h {timeUntilNext.minutes}m
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prayer Times List */}
        <div className="space-y-3">
          {prayerTimes.map((prayer) => (
            <Card key={prayer.id} className={`transition-opacity ${prayer.enabled ? '' : 'opacity-50'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getPrayerIcon(prayer.name)}</span>
                    <div>
                      <div className="font-medium text-lg">{prayer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime12Hour(prayer.time)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(prayer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      {prayer.enabled ? (
                        <Bell className="h-4 w-4 text-green-500" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Switch
                        checked={prayer.enabled}
                        onCheckedChange={() => togglePrayer(prayer.id)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {prayerTimes.filter(p => p.enabled).length}
              </div>
              <div className="text-xs text-muted-foreground">Active Prayers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">5</div>
              <div className="text-xs text-muted-foreground">Total Prayers</div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Prayer Time Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {editingPrayer?.name} Time
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="prayerTime">Prayer Time</Label>
                <Input
                  id="prayerTime"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Current: {editingPrayer && formatTime12Hour(editingPrayer.time)}
              </div>
              <Button onClick={updatePrayerTime} className="w-full">
                Update Time
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
}