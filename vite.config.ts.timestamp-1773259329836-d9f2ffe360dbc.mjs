// vite.config.ts
import { defineConfig } from "file:///D:/main/boy-script-website/boy-script-forge-86365/node_modules/vite/dist/node/index.js";
import react from "file:///D:/main/boy-script-website/boy-script-forge-86365/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///D:/main/boy-script-website/boy-script-forge-86365/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\main\\boy-script-website\\boy-script-forge-86365";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@radix-ui/react-accordion", "@radix-ui/react-alert-dialog", "@radix-ui/react-aspect-ratio", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "@radix-ui/react-collapsible", "@radix-ui/react-context-menu", "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-hover-card", "@radix-ui/react-label", "@radix-ui/react-menubar", "@radix-ui/react-navigation-menu", "@radix-ui/react-popover", "@radix-ui/react-progress", "@radix-ui/react-radio-group", "@radix-ui/react-scroll-area", "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-slider", "@radix-ui/react-slot", "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-toast", "@radix-ui/react-toggle", "@radix-ui/react-toggle-group", "@radix-ui/react-tooltip"]
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxtYWluXFxcXGJveS1zY3JpcHQtd2Vic2l0ZVxcXFxib3ktc2NyaXB0LWZvcmdlLTg2MzY1XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxtYWluXFxcXGJveS1zY3JpcHQtd2Vic2l0ZVxcXFxib3ktc2NyaXB0LWZvcmdlLTg2MzY1XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9tYWluL2JveS1zY3JpcHQtd2Vic2l0ZS9ib3ktc2NyaXB0LWZvcmdlLTg2MzY1L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgaG9zdDogXCI6OlwiLFxyXG4gICAgICAgIHBvcnQ6IDgwODAsXHJcbiAgICB9LFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHJlYWN0KCksXHJcbiAgICAgICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxyXG4gICAgICAgIGNvbXBvbmVudFRhZ2dlcigpLFxyXG4gICAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxyXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgICAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcclxuICAgICAgICAgICAgICAgICAgICB1aTogWydAcmFkaXgtdWkvcmVhY3QtYWNjb3JkaW9uJywgJ0ByYWRpeC11aS9yZWFjdC1hbGVydC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LWFzcGVjdC1yYXRpbycsICdAcmFkaXgtdWkvcmVhY3QtYXZhdGFyJywgJ0ByYWRpeC11aS9yZWFjdC1jaGVja2JveCcsICdAcmFkaXgtdWkvcmVhY3QtY29sbGFwc2libGUnLCAnQHJhZGl4LXVpL3JlYWN0LWNvbnRleHQtbWVudScsICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgJ0ByYWRpeC11aS9yZWFjdC1kcm9wZG93bi1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC1ob3Zlci1jYXJkJywgJ0ByYWRpeC11aS9yZWFjdC1sYWJlbCcsICdAcmFkaXgtdWkvcmVhY3QtbWVudWJhcicsICdAcmFkaXgtdWkvcmVhY3QtbmF2aWdhdGlvbi1tZW51JywgJ0ByYWRpeC11aS9yZWFjdC1wb3BvdmVyJywgJ0ByYWRpeC11aS9yZWFjdC1wcm9ncmVzcycsICdAcmFkaXgtdWkvcmVhY3QtcmFkaW8tZ3JvdXAnLCAnQHJhZGl4LXVpL3JlYWN0LXNjcm9sbC1hcmVhJywgJ0ByYWRpeC11aS9yZWFjdC1zZWxlY3QnLCAnQHJhZGl4LXVpL3JlYWN0LXNlcGFyYXRvcicsICdAcmFkaXgtdWkvcmVhY3Qtc2xpZGVyJywgJ0ByYWRpeC11aS9yZWFjdC1zbG90JywgJ0ByYWRpeC11aS9yZWFjdC1zd2l0Y2gnLCAnQHJhZGl4LXVpL3JlYWN0LXRhYnMnLCAnQHJhZGl4LXVpL3JlYWN0LXRvYXN0JywgJ0ByYWRpeC11aS9yZWFjdC10b2dnbGUnLCAnQHJhZGl4LXVpL3JlYWN0LXRvZ2dsZS1ncm91cCcsICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCddLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZVLFNBQVMsb0JBQW9CO0FBQzFXLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN2QyxRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDVjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNwQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGNBQWM7QUFBQSxVQUNWLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDakQsSUFBSSxDQUFDLDZCQUE2QixnQ0FBZ0MsZ0NBQWdDLDBCQUEwQiw0QkFBNEIsK0JBQStCLGdDQUFnQywwQkFBMEIsaUNBQWlDLDhCQUE4Qix5QkFBeUIsMkJBQTJCLG1DQUFtQywyQkFBMkIsNEJBQTRCLCtCQUErQiwrQkFBK0IsMEJBQTBCLDZCQUE2QiwwQkFBMEIsd0JBQXdCLDBCQUEwQix3QkFBd0IseUJBQXlCLDBCQUEwQixnQ0FBZ0MseUJBQXlCO0FBQUEsUUFDdndCO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
