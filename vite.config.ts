import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from "@tailwindcss/vite";
import Pages from "vite-plugin-pages";
import react from "@vitejs/plugin-react-swc";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), Pages()],
  resolve: {
	  // 路径别名（简化导入）
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    // 自动补全扩展名
    extensions: ['.js', '.ts', '.jsx', '.tsx']
  },
})


