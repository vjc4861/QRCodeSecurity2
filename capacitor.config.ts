import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'QR-Code-Security',
  webDir: 'www',
  server: {
    androidScheme: 'http'
  }
  // "server": {
  //   "url": "http://YOUR_COMPUTER_IP_ADDRESS:8100"
  // },
};

export default config;
