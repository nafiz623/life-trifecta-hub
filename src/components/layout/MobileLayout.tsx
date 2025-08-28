import { ReactNode } from "react";
import { TopAppBar } from "./TopAppBar";
import { BottomNavigation } from "./BottomNavigation";

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
}

export function MobileLayout({ children, title }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopAppBar title={title} />
      
      <main className="pb-20 px-4 py-4">
        {children}
      </main>
      
      <BottomNavigation />
    </div>
  );
}