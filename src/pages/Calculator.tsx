import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function Calculator() {
  return (
    <MobileLayout title="Calculator">
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Calculator feature coming soon!</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
}