<script setup lang="ts">
import { helpers, maxLength, required } from '@vuelidate/validators';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { Taxpayer69bStatus, Taxpayer69bStatusPayload } from '../types/TaxpayerStatus';

type Taxpayer69bStatusForm = Omit<Taxpayer69bStatusPayload, 'status_id'>;

const initialForm: Taxpayer69bStatusForm = { name: '' };

const props = withDefaults(
  defineProps<{
    mode?: ModalMode;
    taxpayerStatus?: Taxpayer69bStatus | null;
  }>(),
  {
    mode: 'create',
    taxpayerStatus: null,
  },
);

const showModal = defineModel<boolean>({ default: false });
const emit = defineEmits<{
  saved: [message: string];
  hidden: [];
}>();

const { createTaxpayerStatus, updateTaxpayerStatus } = use69bTaxpayerStatusApi();
const validator = useValidation();
const formHelper = useForm();
const isSubmitting = ref(false);
const formMessage = ref('');
const backendErrors = ref<Record<string, string[]>>({});
const savedMessage = ref<string | null>(null);

const form = reactive<Taxpayer69bStatusForm>({ ...initialForm });

const rules = {
  form: {
    name: {
      required: helpers.withMessage('El nombre es obligatorio.', required),
      maxLength: helpers.withMessage('El nombre no debe exceder los 255 caracteres.', maxLength(255)),
    },
  },
};

validator.create(rules, form);
const isEditing = computed(() => props.mode === 'edit');
const modalTitle = computed(() => `${isEditing.value ? 'Editar' : 'Agregar'} estado`);

function resetForm() {
  formHelper.resetReactive(form, initialForm);

  formMessage.value = '';
  backendErrors.value = {};
  validator.reset();
}

function populateForm(taxpayerStatus: Taxpayer69bStatus | null) {
  resetForm();

  if (!taxpayerStatus) return;

  syncObject(form, {
    name: taxpayerStatus.name ?? '',
  });
}

async function onSubmit() {
  validator.touch();
  if (validator.isInvalid() || isSubmitting.value) return;

  isSubmitting.value = true;
  formMessage.value = '';
  backendErrors.value = {};

  const payload: Taxpayer69bStatusPayload = {
    name: form.name.trim(),
    status_id: 1,
  };

  try {
    const response =
      isEditing.value && props.taxpayerStatus
        ? await updateTaxpayerStatus(props.taxpayerStatus.id, payload)
        : await createTaxpayerStatus(payload);

    savedMessage.value = response.message;
    showModal.value = false;
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    formMessage.value = data.message ?? 'No fue posible guardar el estado.';
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
    if (isVisible) populateForm(props.taxpayerStatus);
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

      <BFormGroup class="mb-3" label="Nombre" label-for="taxpayer-name">
        <BFormInput
          id="taxpayer-name"
          v-model="form.name"
          maxlength="255"
          placeholder="Ingresa el nombre"
          :disabled="isSubmitting"
          :class="[validator.getClassName('name'), { 'is-invalid': backendErrors.name?.length }]"
          @blur="validator.touchElement('name')" />
        <FormsInputErrors :errors="validator.getErrors('name')" />
        <div v-for="message in backendErrors.name" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>
    </BForm>
  </BModal>
</template>
