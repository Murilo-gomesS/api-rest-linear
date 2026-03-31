import { afterEach, describe, expect, it, vi } from "vitest";
import { linearStructuresService } from "../src/services/linearStructuresService";

describe("linearStructuresService", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("chama endpoint de estatisticas", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ totalStructures: 0, inUse: { stack: 0, queue: 0, list: 0 } }), { status: 200 }));

    await linearStructuresService.getStats();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/stats",
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" })
      })
    );
  });

  it("envia push da pilha com POST e body correto", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

    await linearStructuresService.stack.push("abc");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/stack/push",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ value: "abc" })
      })
    );
  });

  it("usa DELETE para pop da pilha", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ value: "x" }), { status: 200 }));

    await linearStructuresService.stack.pop();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/stack/pop",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("envia enqueue da fila com POST", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

    await linearStructuresService.queue.enqueue("fila");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/queue/enqueue",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ value: "fila" })
      })
    );
  });

  it("consulta item da lista por indice", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ value: "v" }), { status: 200 }));

    await linearStructuresService.list.getByIndex(3);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/list/index/3",
      expect.objectContaining({
        headers: expect.objectContaining({ "Content-Type": "application/json" })
      })
    );
  });

  it("remove item da lista por indice com DELETE", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ value: "v" }), { status: 200 }));

    await linearStructuresService.list.removeByIndex(2);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/list/index/2",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("remove item da lista por valor com encode de URL", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "ok" }), { status: 200 }));

    await linearStructuresService.list.removeByValue("a b");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/list/value/a%20b",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});