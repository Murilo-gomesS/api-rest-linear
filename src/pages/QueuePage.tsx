import { FormEvent, useEffect, useState } from "react";
import { Feedback } from "../components/Feedback";
import { getActiveService } from "../services/serviceDetector";
import { PrimitiveValue } from "../types/structures";

export function QueuePage() {
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<PrimitiveValue[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  async function refreshItems() {
    const service = getActiveService();
    const response = await service.queue.list();
    setItems(response.items);
  }

  useEffect(() => {
    refreshItems().catch((err) => {
      const message = err instanceof Error ? err.message : "Falha ao listar itens da fila";
      setFeedback({ type: "error", message });
    });
  }, []);

  async function handleAction(action: () => Promise<void>, successMessage?: string) {
    try {
      await action();
      await refreshItems();
      if (successMessage) {
        setFeedback({ type: "success", message: successMessage });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      setFeedback({ type: "error", message });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!value.trim()) {
      setFeedback({ type: "error", message: "Informe um valor valido antes de adicionar." });
      return;
    }

    await handleAction(async () => {
      const service = getActiveService();
      await service.queue.enqueue(value.trim());
      setValue("");
    }, "Item adicionado na fila.");
  }

  return (
    <section className="page-card">
      <h1>Fila</h1>
      <p>Operacoes: adicionar, remover frente, consultar frente, listar e limpar.</p>

      <form onSubmit={onSubmit} className="inline-form">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Digite o valor"
          aria-label="Valor para a fila"
        />
        <button type="submit">Adicionar Item</button>
      </form>

      <div className="actions-grid">
        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const response = await service.queue.dequeue();
              setFeedback({ type: "info", message: `Removido da frente: ${response.value}` });
            })
          }
        >
          Remover Frente
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const response = await service.queue.front();
              setFeedback({ type: "info", message: `Frente atual: ${response.value}` });
            })
          }
        >
          Consultar Frente
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              await service.queue.clear();
            }, "Fila limpa com sucesso.")
          }
        >
          Limpar Fila
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              await refreshItems();
            }, "Lista atualizada.")
          }
        >
          Listar Itens
        </button>
      </div>

      {feedback && <Feedback type={feedback.type} message={feedback.message} />}

      <div className="items-panel">
        <h2>Itens na Fila</h2>
        {items.length === 0 ? (
          <p>Estrutura vazia.</p>
        ) : (
          <ol>
            {items.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}