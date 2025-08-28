import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function HabitTracker() {
  return (
    <MobileLayout title="Habit Tracker">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Habit Tracker feature coming soon!</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
}