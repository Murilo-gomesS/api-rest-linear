import { ApiErrorShape } from "../types/structures";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 8000);
const API_RETRY_COUNT = Number(import.meta.env.VITE_API_RETRY_COUNT ?? 1);
const RETRY_DELAY_MS = 300;

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriableStatus(status: number) {
  return status >= 500;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "Variavel VITE_API_BASE_URL nao configurada. Crie o arquivo .env na raiz do projeto.",
      500
    );
  }

  let attempt = 0;

  while (attempt <= API_RETRY_COUNT) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers
        },
        ...options,
        signal: controller.signal
      });

      if (!response.ok) {
        let message = "Falha ao comunicar com a API.";

        try {
          const body = (await response.json()) as ApiErrorShape;
          message = body.message ?? body.error ?? message;
        } catch {
          message = response.statusText || message;
        }

        if (attempt < API_RETRY_COUNT && isRetriableStatus(response.status)) {
          attempt += 1;
          await sleep(RETRY_DELAY_MS);
          continue;
        }

        throw new ApiError(message, response.status);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      const isAbort = error instanceof DOMException && error.name === "AbortError";
      const message = isAbort
        ? "Tempo limite excedido ao chamar a API."
        : "Nao foi possivel conectar com a API. Verifique se o backend esta ativo, a URL VITE_API_BASE_URL e as configuracoes de CORS.";

      if (attempt < API_RETRY_COUNT) {
        attempt += 1;
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      throw new ApiError(message, isAbort ? 504 : 503);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new ApiError("Falha inesperada na comunicacao com a API.", 500);
}