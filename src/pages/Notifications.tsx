import { useState } from "react";
import { Bell, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MobileLayout } from "@/components/layout/MobileLayout";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'alarm' | 'prayer' | 'task' | 'reminder';
  time: Date;
  isActive: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Fajr Prayer Time',
    description: 'Time for Fajr prayer',
    type: 'prayer',
    time: new Date(),
    isActive: true,
  },
  {
    id: '2',
    title: 'Morning Alarm',
    description: 'Wake up time',
    type: 'alarm',
    time: new Date(Date.now() - 1000 * 60 * 30),
    isActive: false,
  },
  {
    id: '3',
    title: 'Task Reminder',
    description: 'Complete daily workout',
    type: 'task',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isActive: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'alarm': return <Clock className="h-4 w-4" />;
    case 'prayer': return <Bell className="h-4 w-4" />;
    case 'task': return <CheckCircle className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'alarm': return 'text-orange-500';
    case 'prayer': return 'text-green-500';
    case 'task': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

export default function Notifications() {
  const [notifications] = useState<Notification[]>(mockNotifications);

  const activeNotifications = notifications.filter(n => n.isActive);
  const historyNotifications = notifications.filter(n => !n.isActive);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <MobileLayout title="Notifications">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Active ({activeNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({historyNotifications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="mt-6">
          <div className="space-y-4">
            {activeNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active notifications</p>
                </CardContent>
              </Card>
            ) : (
              activeNotifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={getNotificationColor(notification.type)}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <CardTitle className="text-sm">{notification.title}</CardTitle>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-2">
                      {notification.description}
                    </CardDescription>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(notification.time)} • {formatDate(notification.time)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {historyNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notification history</p>
                </CardContent>
              </Card>
            ) : (
              historyNotifications.map((notification) => (
                <Card key={notification.id} className="opacity-75">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={getNotificationColor(notification.type)}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <CardTitle className="text-sm">{notification.title}</CardTitle>
                      </div>
                      <Badge variant="outline">Past</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-2">
                      {notification.description}
                    </CardDescription>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(notification.time)} • {formatDate(notification.time)}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
}