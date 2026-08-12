<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers, maxLength, required } from '@vuelidate/validators';
import type { Standard, StandardPayload } from '#layers/standards/app/types/standard';

type ModalMode = 'create' | 'edit';

interface ApiErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}

const props = withDefaults(
  defineProps<{
    mode?: ModalMode;
    standard?: Standard | null;
  }>(),
  {
    mode: 'create',
    standard: null,
  },
);

const showModal = defineModel<boolean>({ default: false });
const emit = defineEmits<{
  saved: [message: string];
  hidden: [];
}>();

const { createStandard, updateStandard } = useStandardsApi();
const isSubmitting = ref(false);
const formMessage = ref('');
const backendErrors = ref<Record<string, string[]>>({});

const form = reactive<StandardPayload>({
  norm_key: '',
  complement_1: '',
  complement_2: null,
  complement_3: null,
  status_id: 1,
});

const rules = {
  norm_key: {
    required: helpers.withMessage('La clave de la norma es obligatoria.', required),
    maxLength: helpers.withMessage('La clave no debe exceder los 255 caracteres.', maxLength(255)),
  },
  complement_1: {
    required: helpers.withMessage('El complemento 1 es obligatorio.', required),
    maxLength: helpers.withMessage('El complemento 1 no debe exceder los 255 caracteres.', maxLength(255)),
  },
  complement_2: {
    maxLength: helpers.withMessage('El complemento 2 no debe exceder los 255 caracteres.', maxLength(255)),
  },
  complement_3: {
    maxLength: helpers.withMessage('El complemento 3 no debe exceder los 255 caracteres.', maxLength(255)),
  },
  status_id: {
    required: helpers.withMessage('El estatus es obligatorio.', required),
  },
};

const v$ = useVuelidate(rules, form);
const isEditing = computed(() => props.mode === 'edit');
const modalTitle = computed(() => `${isEditing.value ? 'Editar' : 'Agregar'} norma`);
const statusOptions = [
  { value: 1, text: 'Activo' },
  { value: 2, text: 'Inactivo' },
];

function resetForm() {
  Object.assign(form, {
    norm_key: '',
    complement_1: '',
    complement_2: null,
    complement_3: null,
    status_id: 1,
  } satisfies StandardPayload);

  formMessage.value = '';
  backendErrors.value = {};
  v$.value.$reset();
}

function populateForm(standard: Standard | null) {
  resetForm();

  if (!standard) return;

  Object.assign(form, {
    norm_key: standard.norm_key,
    complement_1: standard.complement_1 ?? '',
    complement_2: standard.complement_2,
    complement_3: standard.complement_3,
    status_id: Number(standard.status_id),
  } satisfies StandardPayload);
}

function normalizeOptional(value: string | null): string | null {
  const normalized = value?.trim() ?? '';
  return normalized || null;
}

function getApiError(error: unknown): ApiErrorData {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data;
    if (typeof data === 'object' && data !== null) return data as ApiErrorData;
  }

  return {};
}

async function onSubmit() {
  const isValid = await v$.value.$validate();
  if (!isValid || isSubmitting.value) return;

  isSubmitting.value = true;
  formMessage.value = '';
  backendErrors.value = {};

  const payload: StandardPayload = {
    norm_key: form.norm_key.trim(),
    complement_1: form.complement_1.trim(),
    complement_2: normalizeOptional(form.complement_2),
    complement_3: normalizeOptional(form.complement_3),
    status_id: Number(form.status_id),
  };

  try {
    const response =
      isEditing.value && props.standard
        ? await updateStandard(props.standard.id, payload)
        : await createStandard(payload);

    showModal.value = false;
    emit('saved', response.message);
  } catch (error: unknown) {
    const data = getApiError(error);
    formMessage.value = data.message ?? 'No fue posible guardar la norma.';
    backendErrors.value = data.errors ?? {};
  } finally {
    isSubmitting.value = false;
  }
}

function onHidden() {
  resetForm();
  emit('hidden');
}

watch(
  () => showModal.value,
  (isVisible) => {
    if (isVisible) populateForm(props.standard);
  },
);
</script>

<template>
  <BModal
    v-model="showModal"
    :title="modalTitle"
    :busy="isSubmitting"
    :ok-disabled="isSubmitting"
    :cancel-disabled="isSubmitting"
    no-close-on-backdrop
    no-close-on-esc
    ok-title="Guardar"
    cancel-title="Cancelar"
    @ok.prevent="onSubmit"
    @hidden="onHidden">
    <BForm novalidate @submit.prevent="onSubmit">
      <BAlert v-if="formMessage" variant="danger" :model-value="true">
        {{ formMessage }}
      </BAlert>

      <BFormGroup class="mb-3" label="Clave de la norma" label-for="standard-norm-key">
        <BFormInput
          id="standard-norm-key"
          v-model="form.norm_key"
          maxlength="255"
          placeholder="Ingresa la clave"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': v$.norm_key.$error || backendErrors.norm_key?.length }"
          @blur="v$.norm_key.$touch()" />
        <FormsInputErrors :errors="v$.norm_key.$errors" />
        <div v-for="message in backendErrors.norm_key" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Complemento 1" label-for="standard-complement-1">
        <BFormInput
          id="standard-complement-1"
          v-model="form.complement_1"
          maxlength="255"
          placeholder="Ingresa el complemento 1"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': v$.complement_1.$error || backendErrors.complement_1?.length }"
          @blur="v$.complement_1.$touch()" />
        <FormsInputErrors :errors="v$.complement_1.$errors" />
        <div v-for="message in backendErrors.complement_1" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Complemento 2" label-for="standard-complement-2">
        <BFormInput
          id="standard-complement-2"
          v-model="form.complement_2"
          maxlength="255"
          placeholder="Ingresa el complemento 2"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': v$.complement_2.$error || backendErrors.complement_2?.length }"
          @blur="v$.complement_2.$touch()" />
        <FormsInputErrors :errors="v$.complement_2.$errors" />
        <div v-for="message in backendErrors.complement_2" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Complemento 3" label-for="standard-complement-3">
        <BFormInput
          id="standard-complement-3"
          v-model="form.complement_3"
          maxlength="255"
          placeholder="Ingresa el complemento 3"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': v$.complement_3.$error || backendErrors.complement_3?.length }"
          @blur="v$.complement_3.$touch()" />
        <FormsInputErrors :errors="v$.complement_3.$errors" />
        <div v-for="message in backendErrors.complement_3" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Estatus" label-for="standard-status">
        <BFormSelect
          id="standard-status"
          v-model="form.status_id"
          :options="statusOptions"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': v$.status_id.$error || backendErrors.status_id?.length }"
          @blur="v$.status_id.$touch()" />
        <FormsInputErrors :errors="v$.status_id.$errors" />
        <div v-for="message in backendErrors.status_id" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>
    </BForm>
  </BModal>
</template>
