import type { Ref } from 'vue';
import { useVuelidate, type Validation } from '@vuelidate/core';
import type { ValidationError, ValidationNode } from '~/types/validationError';


type ValidationRoot = ValidationNode & {
  form?: ValidationNode;
};

export function useValidation() {
  let v$: Ref<Validation> | null = null;

  function create(rules: unknown, form: Record<string, unknown>): void {
    v$ = useVuelidate(rules as never, { form } as never) as Ref<Validation>;
  }
  
  function getNestedValue(obj: ValidationNode | undefined, path: string): ValidationNode | undefined {
    if (!obj || !path) return undefined;

    return path
      .split('.')
      .reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as ValidationNode)[key] : undefined), obj) as
      | ValidationNode
      | undefined;
  }

  function getInstance(): Ref<Validation> | null {
    return v$;
  }

  function getFormRoot(): ValidationNode | undefined {
    return v$?.value?.form as ValidationNode | undefined;
  }

  function getElement(path: string): ValidationNode | undefined {
    return getNestedValue(getFormRoot(), path);
  }

  function getClassName(key: string): string {
    const element = getElement(key);
    if (!element) return '';

    if (element.$dirty && element.$error) return 'is-invalid';
    if (element.$dirty && !element.$error) return 'is-valid';
    return '';
  }

  function getErrors(key: string): ValidationError[] {
    return getElement(key)?.$errors ?? [];
  }

  function isInvalid(name?: string): boolean {
    const formRoot = getFormRoot();
    if (!formRoot) return false;

    if (name) return getElement(name)?.$invalid ?? false;
    return formRoot.$invalid ?? false;
  }

  function touch(): void {
    v$?.value?.$touch?.();
  }

  function touchElement(name: string): void {
    getElement(name)?.$touch?.();
  }

  function reset(): void {
    v$?.value?.$reset?.();
  }

  function resetElement(name: string): void {
    getElement(name)?.$reset?.();
  }

  function touchField(name: string): void {
    touchElement(name);
  }

  return {
    getInstance,
    create,
    isInvalid,
    getClassName,
    getErrors,
    touch,
    touchElement,
    touchField,
    reset,
    resetElement,
  };
}
