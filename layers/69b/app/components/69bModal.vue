<script setup lang="ts">
import { helpers, integer, maxLength, required } from '@vuelidate/validators';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { _69bPayload, _69bRecord } from '../types/_69b';
import { use69bApi } from '../composables/use69bApi';
import DynamicSelect from '#layers/shared/app/components/forms/DynamicSelect.vue';

type Form69b = Omit<_69bPayload, 'status_id'>;

const initialForm: Form69b = {
  name: '',
  tax_id: null,
  taxpayer_69b_status_id: null,
  presumption_number: null,
  presumption_date: null,
  sat_global_official_number: null,
  sat_global_official_date: null,
};

const props = withDefaults(
  defineProps<{
    mode?: ModalMode;
    record69b?: _69bRecord | null;
  }>(),
  {
    mode: 'create',
    record69b: null,
  },
);

const showModal = defineModel<boolean>({ default: false });
const emit = defineEmits<{
  saved: [message: string];
  hidden: [];
}>();

const { create69bRecord, update69bRecord } = use69bApi();
const validator = useValidation();
const formHelper = useForm();
const isSubmitting = ref(false);
const formMessage = ref('');
const backendErrors = ref<Record<string, string[]>>({});
const savedMessage = ref<string | null>(null);

const form = reactive<Form69b>({ ...initialForm });

const rules = {
  form: {
    name: {
      required: helpers.withMessage('El nombre es obligatorio.', required),
      maxLength: helpers.withMessage('El nombre no debe exceder los 255 caracteres.', maxLength(255)),
    },
    tax_id: {
      maxLength: helpers.withMessage('El RFC / Tax ID no debe exceder los 20 caracteres.', maxLength(20)),
    },
    taxpayer_69b_status_id: {
      required: helpers.withMessage('La situación del contribuyente es obligatoria.', required),
      integer: helpers.withMessage('La situación debe ser un ID numérico.', integer),
    },
    presumption_number: {
      maxLength: helpers.withMessage('El número de presunción no debe exceder los 100 caracteres.', maxLength(100)),
    },
    presumption_date: {},
    sat_global_official_number: {
      maxLength: helpers.withMessage(
        'El número de oficio global SAT no debe exceder los 100 caracteres.',
        maxLength(100),
      ),
    },
    sat_global_official_date: {},
  },
};

validator.create(rules, form);
const isEditing = computed(() => props.mode === 'edit');
const modalTitle = computed(() => `${isEditing.value ? 'Editar' : 'Agregar'} registro 69b`);

function resetForm() {
  formHelper.resetReactive(form, initialForm);
  formMessage.value = '';
  backendErrors.value = {};
  validator.reset();
}

function populateForm(record: _69bRecord | null) {
  resetForm();

  if (!record) return;

  syncObject(form, {
    name: record.name,
    tax_id: record.tax_id,
    taxpayer_69b_status_id: record.taxpayer_69b_status_id,
    presumption_number: record.presumption_number,
    presumption_date: normalizeDateInput(record.presumption_date),
    sat_global_official_number: record.sat_global_official_number,
    sat_global_official_date: normalizeDateInput(record.sat_global_official_date),
  });
}

function normalizeOptional(value: string | null): string | null {
  const normalized = value?.trim() ?? '';
  return normalized || null;
}

function normalizeDateInput(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

async function onSubmit() {
  validator.touch();
  if (validator.isInvalid() || isSubmitting.value) return;

  isSubmitting.value = true;
  formMessage.value = '';
  backendErrors.value = {};

  const payload: _69bPayload = {
    name: form.name.trim(),
    tax_id: normalizeOptional(form.tax_id),
    taxpayer_69b_status_id: form.taxpayer_69b_status_id ? Number(form.taxpayer_69b_status_id) : null,
    presumption_number: normalizeOptional(form.presumption_number),
    presumption_date: form.presumption_date || null,
    sat_global_official_number: normalizeOptional(form.sat_global_official_number),
    sat_global_official_date: form.sat_global_official_date || null,
    status_id: isEditing.value && props.record69b ? Number(props.record69b.status_id) : 1,
  };

  try {
    const response =
      isEditing.value && props.record69b
        ? await update69bRecord(props.record69b.id, payload)
        : await create69bRecord(payload);

    savedMessage.value = response.message;
    showModal.value = false;
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    formMessage.value = data.message ?? 'No fue posible guardar el registro 69b.';
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
    if (isVisible) populateForm(props.record69b);
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
    ok-title="Guardar"
    cancel-title="Cancelar"
    no-close-on-backdrop
    no-close-on-esc
    @ok.prevent="onSubmit"
    @hidden="onHidden">
    <BForm novalidate @submit.prevent="onSubmit">
      <BAlert v-if="formMessage" variant="danger" :model-value="true">
        {{ formMessage }}
      </BAlert>

      <BFormGroup class="mb-3" label="Nombre" label-for="record-69b-name">
        <BFormInput
          id="record-69b-name"
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

      <BFormGroup class="mb-3" label="RFC / Tax ID" label-for="record-69b-tax-id">
        <BFormInput
          id="record-69b-tax-id"
          v-model="form.tax_id"
          maxlength="20"
          placeholder="Ingresa el RFC / Tax ID"
          :disabled="isSubmitting"
          :class="[validator.getClassName('tax_id'), { 'is-invalid': backendErrors.tax_id?.length }]"
          @blur="validator.touchElement('tax_id')" />
        <FormsInputErrors :errors="validator.getErrors('tax_id')" />
        <div v-for="message in backendErrors.tax_id" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Situación del contribuyente" label-for="record-69b-taxpayer-status-id">
        <!-- <BFormInput
          id="record-69b-taxpayer-status-id"
          v-model="form.taxpayer_69b_status_id"
          type="number"
          min="1"
          placeholder="Ingresa el ID de la situación"
          :disabled="isSubmitting"
          :class="[validator.getClassName('taxpayer_69b_status_id'), { 'is-invalid': backendErrors.taxpayer_69b_status_id?.length }]"
          @blur="validator.touchElement('taxpayer_69b_status_id')" /> -->
        <DynamicSelect
          label=""
          uri="/taxpayer-69b-statuses/active"
          v-model="form.taxpayer_69b_status_id"
          :class-name="validator.getClassName('taxpayer_69b_status_id')" />
        <FormsInputErrors :errors="validator.getErrors('taxpayer_69b_status_id')" />
        <div v-for="message in backendErrors.taxpayer_69b_status_id" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Número de presunción" label-for="record-69b-presumption-number">
        <BFormInput
          id="record-69b-presumption-number"
          v-model="form.presumption_number"
          maxlength="100"
          placeholder="Ingresa el número de presunción"
          :disabled="isSubmitting"
          :class="[
            validator.getClassName('presumption_number'),
            { 'is-invalid': backendErrors.presumption_number?.length },
          ]"
          @blur="validator.touchElement('presumption_number')" />
        <FormsInputErrors :errors="validator.getErrors('presumption_number')" />
        <div v-for="message in backendErrors.presumption_number" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Fecha de presunción" label-for="record-69b-presumption-date">
        <BFormInput
          id="record-69b-presumption-date"
          v-model="form.presumption_date"
          type="date"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': backendErrors.presumption_date?.length }" />
        <div v-for="message in backendErrors.presumption_date" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Número de oficio global SAT" label-for="record-69b-sat-number">
        <BFormInput
          id="record-69b-sat-number"
          v-model="form.sat_global_official_number"
          maxlength="100"
          placeholder="Ingresa el número de oficio global SAT"
          :disabled="isSubmitting"
          :class="[
            validator.getClassName('sat_global_official_number'),
            { 'is-invalid': backendErrors.sat_global_official_number?.length },
          ]"
          @blur="validator.touchElement('sat_global_official_number')" />
        <FormsInputErrors :errors="validator.getErrors('sat_global_official_number')" />
        <div
          v-for="message in backendErrors.sat_global_official_number"
          :key="message"
          class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Fecha de oficio global SAT" label-for="record-69b-sat-date">
        <BFormInput
          id="record-69b-sat-date"
          v-model="form.sat_global_official_date"
          type="date"
          :disabled="isSubmitting"
          :class="{ 'is-invalid': backendErrors.sat_global_official_date?.length }" />
        <div v-for="message in backendErrors.sat_global_official_date" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>
    </BForm>
  </BModal>
</template>
