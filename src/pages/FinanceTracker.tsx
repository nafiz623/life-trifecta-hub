import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function FinanceTracker() {
  return (
    <MobileLayout title="Finance Tracker">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Finance Tracker feature coming soon!</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
}