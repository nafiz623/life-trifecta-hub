import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { CalendarEvent, saveCalendarEvents, loadCalendarEvents } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    setEvents(loadCalendarEvents());
  }, []);

  useEffect(() => {
    saveCalendarEvents(events);
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(dateKey);
    setIsDialogOpen(true);
  };

  const addEvent = () => {
    if (!selectedDate || !eventTitle.trim()) {
      toast({ title: "Please enter an event title" });
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: eventTitle.trim(),
      description: eventDescription.trim(),
      createdAt: new Date(),
    };

    setEvents(prev => [...prev, newEvent]);
    setIsDialogOpen(false);
    setEventTitle("");
    setEventDescription("");
    toast({ title: "Event added!" });
  };

  const getEventsForDate = (dateKey: string) => {
    return events.filter(event => event.date === dateKey);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(dateKey);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-12 p-1 rounded-lg border text-sm relative hover:bg-accent transition-colors",
            isToday && "bg-primary text-primary-foreground",
            dayEvents.length > 0 && "border-primary"
          )}
        >
          <div className="font-medium">{day}</div>
          {dayEvents.length > 0 && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          )}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <MobileLayout title="Calendar">
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No events yet. Tap on a date to add one!
              </p>
            ) : (
              <div className="space-y-3">
                {events.slice(-5).reverse().map(event => (
                  <div key={event.id} className="border-l-4 border-l-primary pl-3">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    {event.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Event Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="eventDescription">Description (Optional)</Label>
                <Textarea
                  id="eventDescription"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>
              {selectedDate && (
                <div className="text-sm text-muted-foreground">
                  Date: {new Date(selectedDate).toLocaleDateString()}
                </div>
              )}
              <Button onClick={addEvent} className="w-full">
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
}