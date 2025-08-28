import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function PrayerTimes() {
  return (
    <MobileLayout title="Prayer Times">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Prayer Times feature coming soon!</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
}