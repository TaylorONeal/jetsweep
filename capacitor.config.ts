import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jetsweep.app",
  appName: "JetSweep",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: "#0a0a0a",
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0a0a0a",
    },
  },
};

export default config;
