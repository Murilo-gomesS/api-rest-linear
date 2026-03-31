import {
  ItemListResponse,
  MessageResponse,
  PrimitiveValue,
  StatsSummary,
  ValueResponse
} from "../types/structures";
import { apiRequest } from "./apiClient";

function encodeValue(value: PrimitiveValue) {
  return encodeURIComponent(String(value));
}

export const linearStructuresService = {
  getStats: () => apiRequest<StatsSummary>("/stats"),

  stack: {
    push: (value: PrimitiveValue) =>
      apiRequest<MessageResponse>("/stack/push", {
        method: "POST",
        body: JSON.stringify({ value })
      }),
    pop: () => apiRequest<ValueResponse>("/stack/pop", { method: "DELETE" }),
    peek: () => apiRequest<ValueResponse>("/stack/peek"),
    list: () => apiRequest<ItemListResponse>("/stack/items"),
    clear: () => apiRequest<MessageResponse>("/stack/clear", { method: "DELETE" })
  },

  queue: {
    enqueue: (value: PrimitiveValue) =>
      apiRequest<MessageResponse>("/queue/enqueue", {
        method: "POST",
        body: JSON.stringify({ value })
      }),
    dequeue: () => apiRequest<ValueResponse>("/queue/dequeue", { method: "DELETE" }),
    front: () => apiRequest<ValueResponse>("/queue/front"),
    list: () => apiRequest<ItemListResponse>("/queue/items"),
    clear: () => apiRequest<MessageResponse>("/queue/clear", { method: "DELETE" })
  },

  list: {
    append: (value: PrimitiveValue) =>
      apiRequest<MessageResponse>("/list/append", {
        method: "POST",
        body: JSON.stringify({ value })
      }),
    pop: () => apiRequest<ValueResponse>("/list/pop", { method: "DELETE" }),
    last: () => apiRequest<ValueResponse>("/list/last"),
    listAll: () => apiRequest<ItemListResponse>("/list/items"),
    getByIndex: (index: number) =>
      apiRequest<ValueResponse>(`/list/index/${index}`),
    removeByIndex: (index: number) =>
      apiRequest<ValueResponse>(`/list/index/${index}`, { method: "DELETE" }),
    clear: () => apiRequest<MessageResponse>("/list/clear", { method: "DELETE" }),
    removeByValue: (value: PrimitiveValue) =>
      apiRequest<MessageResponse>(`/list/value/${encodeValue(value)}`, {
        method: "DELETE"
      })
  }
};