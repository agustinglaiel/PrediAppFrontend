import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'testing.gopredi.com',
      'http://testing.gopredi.com',
      'https://testing.gopredi.com',
    ]
  }
});
