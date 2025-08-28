import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";

export default function DigitalClock() {
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

  const formatTimeZone = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      timeZoneName: 'short'
    }).split(' ').pop();
  };

  return (
    <MobileLayout title="Digital Clock">
      <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="text-5xl font-mono font-bold text-primary mb-4">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-muted-foreground mb-2">
              {formatDate(currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatTimeZone(currentTime)}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {String(currentTime.getHours()).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Hours</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {String(currentTime.getMinutes()).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">
                {String(currentTime.getSeconds()).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Seconds</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {String(currentTime.getMilliseconds()).padStart(3, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Milliseconds</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}