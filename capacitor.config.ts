import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a427fa5ff05c49adb6187dee1ffc4ad7',
  appName: 'life-trifecta-hub',
  webDir: 'dist',
  server: {
    url: 'https://a427fa5f-f05c-49ad-b618-7dee1ffc4ad7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;