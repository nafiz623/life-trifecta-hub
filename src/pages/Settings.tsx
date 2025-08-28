import { Moon, Sun, Monitor, Smartphone, Volume2, VolumeX, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <MobileLayout title="Settings">
      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Choose your preferred theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div
                  key={option.value}
                  className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent"
                  onClick={() => setTheme(option.value as any)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    theme === option.value 
                      ? 'bg-primary border-primary' 
                      : 'border-muted-foreground'
                  }`} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Push Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Receive notifications for alarms, prayers, and reminders
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex items-center gap-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <div>
                  <div className="text-sm font-medium">Sound</div>
                  <div className="text-xs text-muted-foreground">
                    Play sounds with notifications
                  </div>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card>
          <CardHeader>
            <CardTitle>Data & Storage</CardTitle>
            <CardDescription>
              Manage your app data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Import Data
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full justify-start">
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Version</span>
              <span className="text-sm text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Build</span>
              <span className="text-sm text-muted-foreground">React + Capacitor</span>
            </div>
            <Separator />
            <Button variant="outline" className="w-full justify-start">
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Terms of Service
            </Button>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}