import { useState, useEffect } from "react";
import { Plus, Minus, RotateCcw, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { TasbeehEvent, saveTasbeehEvents, loadTasbeehEvents } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

export default function TasbeehCounter() {
  const [events, setEvents] = useState<TasbeehEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TasbeehEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [newEventGoal, setNewEventGoal] = useState("33");

  useEffect(() => {
    const loadedEvents = loadTasbeehEvents();
    setEvents(loadedEvents);
    if (loadedEvents.length > 0) {
      setSelectedEvent(loadedEvents[0]);
    }
  }, []);

  useEffect(() => {
    saveTasbeehEvents(events);
  }, [events]);

  const createEvent = () => {
    if (!newEventName.trim()) {
      toast({ title: "Please enter an event name" });
      return;
    }

    const newEvent: TasbeehEvent = {
      id: Date.now().toString(),
      name: newEventName.trim(),
      dailyGoal: parseInt(newEventGoal) || 33,
      dailyCount: 0,
      totalCount: 0,
      lastUpdated: new Date(),
    };

    setEvents(prev => [...prev, newEvent]);
    setSelectedEvent(newEvent);
    setIsDialogOpen(false);
    setNewEventName("");
    setNewEventGoal("33");
    toast({ title: "Tasbeeh event created!" });
  };

  const increment = () => {
    if (!selectedEvent) return;

    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { 
            ...event, 
            dailyCount: event.dailyCount + 1,
            totalCount: event.totalCount + 1,
            lastUpdated: new Date()
          }
        : event
    ));

    setSelectedEvent(prev => prev ? {
      ...prev,
      dailyCount: prev.dailyCount + 1,
      totalCount: prev.totalCount + 1,
      lastUpdated: new Date()
    } : null);
  };

  const decrement = () => {
    if (!selectedEvent || selectedEvent.dailyCount === 0) return;

    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { 
            ...event, 
            dailyCount: Math.max(0, event.dailyCount - 1),
            totalCount: Math.max(0, event.totalCount - 1),
            lastUpdated: new Date()
          }
        : event
    ));

    setSelectedEvent(prev => prev ? {
      ...prev,
      dailyCount: Math.max(0, prev.dailyCount - 1),
      totalCount: Math.max(0, prev.totalCount - 1),
      lastUpdated: new Date()
    } : null);
  };

  const resetDaily = () => {
    if (!selectedEvent) return;

    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, dailyCount: 0, lastUpdated: new Date() }
        : event
    ));

    setSelectedEvent(prev => prev ? {
      ...prev,
      dailyCount: 0,
      lastUpdated: new Date()
    } : null);

    toast({ title: "Daily count reset!" });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    if (selectedEvent?.id === eventId) {
      const remainingEvents = events.filter(event => event.id !== eventId);
      setSelectedEvent(remainingEvents.length > 0 ? remainingEvents[0] : null);
    }
    toast({ title: "Tasbeeh event deleted!" });
  };

  const progress = selectedEvent 
    ? Math.min((selectedEvent.dailyCount / selectedEvent.dailyGoal) * 100, 100)
    : 0;

  return (
    <MobileLayout title="Tasbeeh Counter">
      <div className="space-y-6">
        {/* Event Selection */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {events.map((event) => (
            <Button
              key={event.id}
              variant={selectedEvent?.id === event.id ? "default" : "outline"}
              className="flex-shrink-0"
              onClick={() => setSelectedEvent(event)}
            >
              {event.name}
            </Button>
          ))}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tasbeeh Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="eventName">Event Name</Label>
                  <Input
                    id="eventName"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g., SubhanAllah, Alhamdulillah"
                  />
                </div>
                <div>
                  <Label htmlFor="dailyGoal">Daily Goal</Label>
                  <Input
                    id="dailyGoal"
                    type="number"
                    value={newEventGoal}
                    onChange={(e) => setNewEventGoal(e.target.value)}
                    placeholder="33"
                  />
                </div>
                <Button onClick={createEvent} className="w-full">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selectedEvent ? (
          <>
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedEvent.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEvent(selectedEvent.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-primary">
                    {selectedEvent.dailyCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {selectedEvent.dailyGoal} daily goal
                  </div>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2 mb-4">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  Total: {selectedEvent.totalCount} • Progress: {Math.round(progress)}%
                </div>
              </CardContent>
            </Card>

            {/* Counter Controls */}
            <div className="flex gap-4">
              <Button
                onClick={decrement}
                variant="outline"
                size="lg"
                className="flex-1 h-16"
                disabled={selectedEvent.dailyCount === 0}
              >
                <Minus className="h-6 w-6" />
              </Button>
              
              <Button
                onClick={increment}
                size="lg"
                className="flex-2 h-16 text-xl"
              >
                <Plus className="h-6 w-6 mr-2" />
                Count
              </Button>
              
              <Button
                onClick={resetDaily}
                variant="outline"
                size="lg"
                className="h-16 px-4"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No tasbeeh events yet. Create your first one!
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tasbeeh Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileLayout>
  );
}