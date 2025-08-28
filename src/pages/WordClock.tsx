import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function WordClock() {
  return (
    <MobileLayout title="Word Clock">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Word Clock feature coming soon!</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
}