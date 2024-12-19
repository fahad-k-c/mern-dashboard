import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Import path module

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001", // Adjust this to your backend server URL
        changeOrigin: true, // Ensure the host header is correctly set
        secure: false, // Set to true if you're using HTTPS for the backend
      },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"), // Path alias for easier imports
    },
  },
});
