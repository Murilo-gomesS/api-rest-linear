import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest } from "../src/services/apiClient";

describe("apiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("retorna o JSON quando a resposta eh bem-sucedida", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      );

    const data = await apiRequest<{ ok: boolean }>("/stats");

    expect(data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("faz retry em erro 5xx e conclui na segunda tentativa", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "Erro temporario" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ items: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      );

    const data = await apiRequest<{ items: unknown[] }>("/stack/items");

    expect(data.items).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retorna ApiError quando falha de rede persiste", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new TypeError("Network error"));

    await expect(apiRequest("/stats")).rejects.toBeInstanceOf(ApiError);
    await expect(apiRequest("/stats")).rejects.toMatchObject({ status: 503 });
    expect(fetchMock).toHaveBeenCalled();
  });
});