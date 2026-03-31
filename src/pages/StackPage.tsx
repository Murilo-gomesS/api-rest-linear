import { FormEvent, useEffect, useState } from "react";
import { Feedback } from "../components/Feedback";
import { getActiveService } from "../services/serviceDetector";
import { PrimitiveValue } from "../types/structures";

export function StackPage() {
  const [value, setValue] = useState<string>("");
  const [items, setItems] = useState<PrimitiveValue[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  async function refreshItems() {
    const service = getActiveService();
    const response = await service.stack.list();
    setItems(response.items);
  }

  useEffect(() => {
    refreshItems().catch((err) => {
      const message = err instanceof Error ? err.message : "Falha ao listar itens da pilha";
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

  function validateInput(rawValue: string) {
    if (!rawValue.trim()) {
      throw new Error("Informe um valor valido antes de adicionar.");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      validateInput(value);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Entrada invalida";
      setFeedback({ type: "error", message });
      return;
    }

    await handleAction(async () => {
      const service = getActiveService();
      await service.stack.push(value.trim());
      setValue("");
    }, "Item adicionado na pilha.");
  }

  return (
    <section className="page-card">
      <h1>Pilha</h1>
      <p>Operacoes: adicionar, remover topo, consultar topo, listar e limpar.</p>

      <form onSubmit={onSubmit} className="inline-form">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Digite o valor"
          aria-label="Valor para a pilha"
        />
        <button type="submit">Adicionar Item</button>
      </form>

      <div className="actions-grid">
        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const response = await service.stack.pop();
              setFeedback({ type: "info", message: `Removido do topo: ${response.value}` });
            })
          }
        >
          Remover Topo
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const response = await service.stack.peek();
              setFeedback({ type: "info", message: `Topo atual: ${response.value}` });
            })
          }
        >
          Consultar Topo
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              await service.stack.clear();
            }, "Pilha limpa com sucesso.")
          }
        >
          Limpar Pilha
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
        <h2>Itens na Pilha</h2>
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