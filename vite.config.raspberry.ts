import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Déploiement Pi / derrière Nginx+HTTPS : base UNIQUEMENT en chemin relatif.
// Ne jamais mettre base: 'http://192.168.x.x/mhcse/' → mixed content dans le navigateur.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/mhcse/",
});
