<script setup lang="ts">
import { helpers, maxLength, required } from '@vuelidate/validators';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { EDocumentType, EDocumentTypePayload } from '../types/e-document-types'
import { useEDocumentTypesApi } from '../composables/useEDocumentTypesApi';

type EDocumentTypeForm = Omit<EDocumentTypePayload, 'status_id'>;

const initialForm: EDocumentTypeForm = {
  name: '',
  vucem_code: null,
  required_document_id: null,
};

const props = withDefaults(
  defineProps<{
    mode?: ModalMode;
    eDocumentType?: EDocumentType | null;
  }>(),
  {
    mode: 'create',
    eDocumentType: null,
  },
);

const showModal = defineModel<boolean>({ default: false });
const emit = defineEmits<{
  saved: [message: string];
  hidden: [];
}>();

const { createDocumentType, updateDocumentType } = useEDocumentTypesApi();
const validator = useValidation();
const formHelper = useForm();
const isSubmitting = ref(false);
const formMessage = ref('');
const backendErrors = ref<Record<string, string[]>>({});
const savedMessage = ref<string | null>(null);

const form = reactive<EDocumentTypeForm>({ ...initialForm });

const rules = {
  form: {
    name: {
      required: helpers.withMessage('El nombre del documento es obligatorio.', required),
      maxLength: helpers.withMessage('El nombre no debe exceder los 255 caracteres.', maxLength(255)),
    },
    vucem_code: {
      maxLength: helpers.withMessage('El codigo VUCEM no debe exceder los 255 caracteres.', maxLength(255)),
    },
  },
};

validator.create(rules, form);
const isEditing = computed(() => props.mode === 'edit');
const modalTitle = computed(() => `${isEditing.value ? 'Editar' : 'Agregar'} tipo de documento`);

function resetForm() {
  formHelper.resetReactive(form, initialForm);

  formMessage.value = '';
  backendErrors.value = {};
  validator.reset();
}

function populateForm(eDocumentType: EDocumentType | null) {
  resetForm();

  if (!eDocumentType) return;

  syncObject(form, {
    name: eDocumentType.name,
    vucem_code: eDocumentType.vucem_code,
    required_document_id: eDocumentType.required_document_id,
  });
}

function normalizeOptional(value: string | null): string | null {
  const normalized = value?.trim() ?? '';
  return normalized || null;
}

async function onSubmit() {
  validator.touch();
  if (validator.isInvalid() || isSubmitting.value) return;

  isSubmitting.value = true;
  formMessage.value = '';
  backendErrors.value = {};

  const payload: EDocumentTypePayload = {
    name: form.name.trim(),
    vucem_code: normalizeOptional(form.vucem_code),
    required_document_id: form.required_document_id ? Number(form.required_document_id) : null,
    status_id: isEditing.value && props.eDocumentType ? Number(props.eDocumentType.status_id) : 1,
  };

  try {
    const response =
      isEditing.value && props.eDocumentType
        ? await updateDocumentType(props.eDocumentType.id, payload)
        : await createDocumentType(payload);

    savedMessage.value = response.message;
    showModal.value = false;
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    formMessage.value = data.message ?? 'No fue posible guardar el tipo de documento.';
    backendErrors.value = data.errors ?? {};
  } finally {
    isSubmitting.value = false;
  }
}

function onHidden() {
  const message = savedMessage.value;
  savedMessage.value = null;
  resetForm();
  emit('hidden');

  if (message) {
    emit('saved', message);
  }
}

watch(
  () => showModal.value,
  (isVisible) => {
    if (isVisible) populateForm(props.eDocumentType);
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
    :ok-title="isSubmitting ? 'Guardando...' : 'Guardar'"
    cancel-title="Cancelar"
    @ok.prevent="onSubmit"
    @hidden="onHidden">
    <BForm novalidate @submit.prevent="onSubmit">
      <BAlert v-if="formMessage" variant="danger" :model-value="true">
        {{ formMessage }}
      </BAlert>

      <BFormGroup class="mb-3" label="Nombre del documento" label-for="e-document-type-name">
        <BFormInput
          id="e-document-type-name"
          v-model="form.name"
          maxlength="255"
          placeholder="Ingresa el nombre del documento"
          :disabled="isSubmitting"
          :class="[validator.getClassName('name'), { 'is-invalid': backendErrors.name?.length }]"
          @blur="validator.touchElement('name')" />
        <FormsInputErrors :errors="validator.getErrors('name')" />
        <div v-for="message in backendErrors.name" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Codigo VUCEM" label-for="e-document-type-vucem-code">
        <BFormInput
          id="e-document-type-vucem-code"
          v-model="form.vucem_code"
          maxlength="255"
          placeholder="Ingresa el codigo VUCEM"
          :disabled="isSubmitting"
          :class="[validator.getClassName('vucem_code'), { 'is-invalid': backendErrors.vucem_code?.length }]"
          @blur="validator.touchElement('vucem_code')" />
        <FormsInputErrors :errors="validator.getErrors('vucem_code')" />
        <div v-for="message in backendErrors.vucem_code" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Documento requerido (ID)" label-for="e-document-type-required-document-id">
        <BFormInput
          id="e-document-type-required-document-id"
          v-model="form.required_document_id"
          type="number"
          min="1"
          placeholder="Ingresa el ID del documento requerido"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': backendErrors.required_document_id?.length }" />
        <div v-for="message in backendErrors.required_document_id" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>
    </BForm>
  </BModal>
</template>
