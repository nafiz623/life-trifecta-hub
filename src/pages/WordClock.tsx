import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";

const numberToWords = {
  0: "twelve", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven",
  12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen",
  20: "twenty", 21: "twenty-one", 22: "twenty-two", 23: "twenty-three",
  24: "twenty-four", 25: "twenty-five", 26: "twenty-six", 27: "twenty-seven",
  28: "twenty-eight", 29: "twenty-nine", 30: "thirty", 31: "thirty-one",
  32: "thirty-two", 33: "thirty-three", 34: "thirty-four", 35: "thirty-five",
  36: "thirty-six", 37: "thirty-seven", 38: "thirty-eight", 39: "thirty-nine",
  40: "forty", 41: "forty-one", 42: "forty-two", 43: "forty-three",
  44: "forty-four", 45: "forty-five", 46: "forty-six", 47: "forty-seven",
  48: "forty-eight", 49: "forty-nine", 50: "fifty", 51: "fifty-one",
  52: "fifty-two", 53: "fifty-three", 54: "fifty-four", 55: "fifty-five",
  56: "fifty-six", 57: "fifty-seven", 58: "fifty-eight", 59: "fifty-nine"
};

export default function WordClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const convertTimeToWords = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const isAM = hours < 12;
    
    // Convert to 12-hour format
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;

    let timeInWords = "It's ";

    if (minutes === 0) {
      timeInWords += `${numberToWords[hours as keyof typeof numberToWords]} o'clock`;
    } else if (minutes === 15) {
      timeInWords += `quarter past ${numberToWords[hours as keyof typeof numberToWords]}`;
    } else if (minutes === 30) {
      timeInWords += `half past ${numberToWords[hours as keyof typeof numberToWords]}`;
    } else if (minutes === 45) {
      const nextHour = hours === 12 ? 1 : hours + 1;
      timeInWords += `quarter to ${numberToWords[nextHour as keyof typeof numberToWords]}`;
    } else if (minutes < 30) {
      timeInWords += `${numberToWords[minutes as keyof typeof numberToWords]} past ${numberToWords[hours as keyof typeof numberToWords]}`;
    } else {
      const nextHour = hours === 12 ? 1 : hours + 1;
      const minutesToNext = 60 - minutes;
      timeInWords += `${numberToWords[minutesToNext as keyof typeof numberToWords]} to ${numberToWords[nextHour as keyof typeof numberToWords]}`;
    }

    timeInWords += ` in the ${isAM ? 'morning' : 'evening'}`;

    return timeInWords;
  };

  const formatDigitalTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <MobileLayout title="Word Clock">
      <div className="space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-8 text-center">
            <div className="text-2xl font-semibold text-primary leading-relaxed mb-6">
              {convertTimeToWords(currentTime)}
            </div>
            <div className="text-lg text-muted-foreground">
              {formatDigitalTime(currentTime)}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 w-full">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg font-medium text-blue-500 mb-2">
                Current Hour
              </div>
              <div className="text-xl">
                {numberToWords[currentTime.getHours() > 12 ? currentTime.getHours() - 12 : currentTime.getHours() === 0 ? 12 : currentTime.getHours() as keyof typeof numberToWords]}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-lg font-medium text-green-500 mb-2">
                Current Minute
              </div>
              <div className="text-xl">
                {numberToWords[currentTime.getMinutes() as keyof typeof numberToWords] || currentTime.getMinutes()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}