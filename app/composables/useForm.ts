import type { SelectOption, PluckedObject } from '@/types/forms';

export function useForm() {
  function isObject(element: unknown): element is Record<string, unknown> {
    return typeof element === 'object' && element !== null && !Array.isArray(element);
  }

  function select() {
    const loading: SelectOption[] = [
      {
        value: '',
        text: 'Cargando...',
        selected: true,
        disabled: true,
      },
    ];

    const baseOption: SelectOption = {
      value: '',
      text: 'Selecciona una opción',
      selected: true,
      disabled: true,
    };

    function create<T extends Record<string, any>>(
      data: T[],
      valueField: keyof T = 'id',
      textField: keyof T = 'name',
      disabledValues: Array<T[keyof T]> = [],
    ): SelectOption<T>[] {
      const selectOptions = data.map((item) => ({
        value: item[valueField],
        text: item[textField],
        disabled: disabledValues.includes(item[valueField]),
        original: { ...item },
      }));

      return [baseOption, ...selectOptions];
    }

    function createEmpty(): SelectOption[] {
      return [
        {
          value: '',
          text: 'No hay datos para mostrar',
          selected: true,
          disabled: true,
        },
      ];
    }

    function createError(): SelectOption[] {
      return [
        {
          value: '',
          text: 'Ha ocurrido un error',
          selected: true,
          disabled: true,
        },
      ];
    }

    function fromPluck(object: PluckedObject): { id: string; name: string }[] {
      return Object.entries(object).map(([id, name]) => ({
        id,
        name,
      }));
    }

    return { loading, baseOption, create, createEmpty, createError, fromPluck };
  }

  function reset<T extends Record<string, any>>(object: T): T {
    const cleanObject: any = {};

    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];

        if (value !== null && value !== undefined && value !== '' && !Array.isArray(value) && !isObject(value)) {
          cleanObject[key] = '';
        } else if (Array.isArray(value)) {
          cleanObject[key] = [];
        } else if (isObject(value)) {
          cleanObject[key] = reset(value);
        }
      }
    }

    return cleanObject;
  }

  function resetReactive<T extends Record<string, any>>(object: T): void {
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const value = object[key];

        if (value !== null && value !== undefined && value !== '' && !Array.isArray(value) && !isObject(value)) {
          object[key] = '' as any;
        } else if (Array.isArray(value)) {
          object[key] = [] as any;
        } else if (isObject(value)) {
          resetReactive(value);
        }
      }
    }
  }

  return { select, reset, resetReactive };
}
