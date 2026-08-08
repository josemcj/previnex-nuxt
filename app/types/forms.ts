export interface SelectOption<T = any> {
  value: string | number;
  text: string;
  selected?: boolean;
  disabled?: boolean;
  original?: T;
}

export type PluckedObject = Record<string, string>;
