import {
  PrimitiveValue,
  StatsSummary
} from "../types/structures";

let mockStack: PrimitiveValue[] = [];
let mockQueue: PrimitiveValue[] = [];
let mockList: PrimitiveValue[] = [];

export const mockLinearStructuresService = {
  getStats: async (): Promise<StatsSummary> => {
    await new Promise((r) => setTimeout(r, 300));
    return {
      totalStructures: mockStack.length + mockQueue.length + mockList.length,
      inUse: {
        stack: mockStack.length,
        queue: mockQueue.length,
        list: mockList.length
      }
    };
  },

  stack: {
    push: async (value: PrimitiveValue) => {
      mockStack.push(value);
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Item adicionado." };
    },
    pop: async () => {
      if (mockStack.length === 0) throw new Error("Pilha vazia.");
      const value = mockStack.pop()!;
      await new Promise((r) => setTimeout(r, 200));
      return { value };
    },
    peek: async () => {
      if (mockStack.length === 0) throw new Error("Pilha vazia.");
      await new Promise((r) => setTimeout(r, 200));
      return { value: mockStack[mockStack.length - 1] };
    },
    list: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return { items: [...mockStack] };
    },
    clear: async () => {
      mockStack = [];
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Pilha limpa." };
    }
  },

  queue: {
    enqueue: async (value: PrimitiveValue) => {
      mockQueue.push(value);
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Item adicionado." };
    },
    dequeue: async () => {
      if (mockQueue.length === 0) throw new Error("Fila vazia.");
      const value = mockQueue.shift()!;
      await new Promise((r) => setTimeout(r, 200));
      return { value };
    },
    front: async () => {
      if (mockQueue.length === 0) throw new Error("Fila vazia.");
      await new Promise((r) => setTimeout(r, 200));
      return { value: mockQueue[0] };
    },
    list: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return { items: [...mockQueue] };
    },
    clear: async () => {
      mockQueue = [];
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Fila limpa." };
    }
  },

  list: {
    append: async (value: PrimitiveValue) => {
      mockList.push(value);
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Item adicionado." };
    },
    pop: async () => {
      if (mockList.length === 0) throw new Error("Lista vazia.");
      const value = mockList.pop()!;
      await new Promise((r) => setTimeout(r, 200));
      return { value };
    },
    last: async () => {
      if (mockList.length === 0) throw new Error("Lista vazia.");
      await new Promise((r) => setTimeout(r, 200));
      return { value: mockList[mockList.length - 1] };
    },
    listAll: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return { items: [...mockList] };
    },
    getByIndex: async (index: number) => {
      if (index < 0 || index >= mockList.length)
        throw new Error("Indice fora do intervalo.");
      await new Promise((r) => setTimeout(r, 200));
      return { value: mockList[index] };
    },
    removeByIndex: async (index: number) => {
      if (index < 0 || index >= mockList.length)
        throw new Error("Indice fora do intervalo.");
      const value = mockList.splice(index, 1)[0];
      await new Promise((r) => setTimeout(r, 200));
      return { value };
    },
    clear: async () => {
      mockList = [];
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Lista limpa." };
    },
    removeByValue: async (value: PrimitiveValue) => {
      const index = mockList.indexOf(value);
      if (index === -1) throw new Error("Valor nao encontrado.");
      mockList.splice(index, 1);
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Item removido." };
    }
  }
};