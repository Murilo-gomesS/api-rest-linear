import { useEffect, useState } from "react";
import { linearStructuresService } from "./linearStructuresService";
import { mockLinearStructuresService } from "./mockService";

export type ServiceMode = "api" | "mock";
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK_MODE === "true";

let cachedApi: typeof linearStructuresService | null = null;
let cachedMode: ServiceMode | null = null;

export async function detectServiceMode(): Promise<ServiceMode> {
  if (cachedMode) return cachedMode;

  if (ENABLE_MOCK) {
    cachedMode = "mock";
    cachedApi = mockLinearStructuresService;
    return "mock";
  }

  try {
    await linearStructuresService.getStats();
    cachedMode = "api";
    cachedApi = linearStructuresService;
    return "api";
  } catch {
    if (ENABLE_MOCK) {
      cachedMode = "mock";
      cachedApi = mockLinearStructuresService;
      return "mock";
    }

    throw new Error("API indisponivel e modo simulado desabilitado.");
  }
}

export function getActiveService() {
  if (ENABLE_MOCK) {
    return mockLinearStructuresService;
  }

  return cachedApi || linearStructuresService;
}

export function useServiceMode() {
  const [mode, setMode] = useState<ServiceMode>(ENABLE_MOCK ? "mock" : "api");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    detectServiceMode()
      .then((m) => setMode(m))
      .finally(() => setLoading(false));
  }, []);

  return { mode, loading };
}