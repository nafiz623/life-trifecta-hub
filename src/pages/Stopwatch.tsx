import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { saveStopwatchState, loadStopwatchState } from "@/lib/storage";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const savedState = loadStopwatchState();
    if (savedState.isRunning && savedState.startTime) {
      const elapsed = Date.now() - savedState.startTime;
      setTime(savedState.time + elapsed);
      setStartTime(Date.now() - (savedState.time + elapsed));
    } else {
      setTime(savedState.time);
    }
    setIsRunning(savedState.isRunning);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning, startTime]);

  useEffect(() => {
    saveStopwatchState({
      time: isRunning ? 0 : time,
      isRunning,
      startTime: isRunning ? startTime : undefined,
    });
  }, [time, isRunning, startTime]);

  const handleStart = () => {
    setStartTime(Date.now() - time);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setStartTime(0);
  };

  const formatTime = (timeMs: number) => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((timeMs % 1000) / 10);

    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(milliseconds).padStart(2, '0'),
    };
  };

  const formattedTime = formatTime(time);

  return (
    <MobileLayout title="Stopwatch">
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-mono font-bold text-primary">
              {formattedTime.minutes}:{formattedTime.seconds}
            </div>
            <div className="text-2xl font-mono text-muted-foreground mt-2">
              .{formattedTime.milliseconds}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 w-full max-w-md">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              size="lg"
              className="flex-1 h-14 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="secondary"
              size="lg"
              className="flex-1 h-14 text-lg"
            >
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="h-14 px-6"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-blue-500">
                {formattedTime.minutes}
              </div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-green-500">
                {formattedTime.seconds}
              </div>
              <div className="text-xs text-muted-foreground">Seconds</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-orange-500">
                {formattedTime.milliseconds}
              </div>
              <div className="text-xs text-muted-foreground">Centiseconds</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}