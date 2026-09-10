import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jetsweep.app",
  appName: "JetSweep",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  backgroundColor: "#0b1014",
  plugins: { SystemBars: { style: "DARK" } },
  ios: {
    contentInset: "never",
  },
};

export default config;
