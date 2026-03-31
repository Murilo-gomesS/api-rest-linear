import { FormEvent, useEffect, useState } from "react";
import { Feedback } from "../components/Feedback";
import { getActiveService } from "../services/serviceDetector";
import { PrimitiveValue } from "../types/structures";

export function ListPage() {
  const [value, setValue] = useState<string>("");
  const [index, setIndex] = useState<string>("");
  const [items, setItems] = useState<PrimitiveValue[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  async function refreshItems() {
    const service = getActiveService();
    const response = await service.list.listAll();
    setItems(response.items);
  }

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

  useEffect(() => {
    refreshItems().catch((err) => {
      const message = err instanceof Error ? err.message : "Falha ao listar itens da lista";
      setFeedback({ type: "error", message });
    });
  }, []);

  function getValidIndex() {
    const parsed = Number(index);
    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new Error("Indice invalido. Informe um numero inteiro maior ou igual a zero.");
    }
    return parsed;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!value.trim()) {
      setFeedback({ type: "error", message: "Informe um valor valido antes de adicionar." });
      return;
    }

    await handleAction(async () => {
      const service = getActiveService();
      await service.list.append(value.trim());
      setValue("");
    }, "Item adicionado na lista.");
  }

  return (
    <section className="page-card">
      <h1>Lista</h1>
      <p>Operacoes: adicionar, remover ultimo, consultar ultimo, consultar/remover por indice, listar e limpar.</p>

      <form onSubmit={onSubmit} className="inline-form">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Digite o valor"
          aria-label="Valor para a lista"
        />
        <button type="submit">Adicionar Item</button>
      </form>

      <div className="inline-form">
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
          placeholder="Indice"
          aria-label="Indice"
        />
        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const validIndex = getValidIndex();
              const response = await service.list.getByIndex(validIndex);
              setFeedback({ type: "info", message: `Valor no indice ${validIndex}: ${response.value}` });
            })
          }
        >
          Consultar por Indice
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const validIndex = getValidIndex();
              const response = await service.list.removeByIndex(validIndex);
              setFeedback({ type: "info", message: `Removido no indice ${validIndex}: ${response.value}` });
            })
          }
        >
          Remover por Indice
        </button>
      </div>

      <div className="actions-grid">
        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const response = await service.list.pop();
              setFeedback({ type: "info", message: `Ultimo removido: ${response.value}` });
            })
          }
        >
          Remover Ultimo
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              const response = await service.list.last();
              setFeedback({ type: "info", message: `Ultimo atual: ${response.value}` });
            })
          }
        >
          Consultar Ultimo
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(async () => {
              const service = getActiveService();
              await service.list.clear();
            }, "Lista limpa com sucesso.")
          }
        >
          Limpar Lista
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
        <h2>Itens na Lista</h2>
        {items.length === 0 ? (
          <p>Estrutura vazia.</p>
        ) : (
          <ol>
            {items.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`}>
                [{itemIndex}] {item}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}