import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true
  },
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify("http://localhost:8080"),
    "import.meta.env.VITE_API_TIMEOUT_MS": JSON.stringify("200"),
    "import.meta.env.VITE_API_RETRY_COUNT": JSON.stringify("1")
  }
});