import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function AlarmClock() {
  return (
    <MobileLayout title="Alarm Clock">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Alarm Clock feature coming soon!</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
}