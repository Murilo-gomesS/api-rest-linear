export type PrimitiveValue = string | number;

export interface StatsSummary {
  totalStructures: number;
  inUse: {
    stack: number;
    queue: number;
    list: number;
  };
}

export interface ItemListResponse {
  items: PrimitiveValue[];
}

export interface ValueResponse {
  value: PrimitiveValue;
}

export interface MessageResponse {
  message: string;
}

export interface ApiErrorShape {
  message?: string;
  error?: string;
}