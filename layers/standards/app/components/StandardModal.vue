<script setup lang="ts">
import { helpers, maxLength, required } from '@vuelidate/validators';
import type { ModalMode } from '#layers/shared/app/types/crud';
import type { Standard, StandardPayload } from '#layers/standards/app/types/standard';

type StandardForm = Omit<StandardPayload, 'status_id'>;

const initialForm: StandardForm = {
  norm_key: '',
  complement_1: '',
  complement_2: null,
  complement_3: null,
};

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
const validator = useValidation();
const formHelper = useForm();
const isSubmitting = ref(false);
const formMessage = ref('');
const backendErrors = ref<Record<string, string[]>>({});

const form = reactive<StandardForm>({ ...initialForm });

const rules = {
  form: {
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
  },
};

validator.create(rules, form);
const isEditing = computed(() => props.mode === 'edit');
const modalTitle = computed(() => `${isEditing.value ? 'Editar' : 'Agregar'} norma`);

function resetForm() {
  formHelper.resetReactive(form, initialForm);

  formMessage.value = '';
  backendErrors.value = {};
  validator.reset();
}

function populateForm(standard: Standard | null) {
  resetForm();

  if (!standard) return;

  syncObject(form, {
    norm_key: standard.norm_key,
    complement_1: standard.complement_1 ?? '',
    complement_2: standard.complement_2,
    complement_3: standard.complement_3,
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

  const payload: StandardPayload = {
    norm_key: form.norm_key.trim(),
    complement_1: form.complement_1.trim(),
    complement_2: normalizeOptional(form.complement_2),
    complement_3: normalizeOptional(form.complement_3),
    status_id: isEditing.value && props.standard ? Number(props.standard.status_id) : 1,
  };

  try {
    const response =
      isEditing.value && props.standard
        ? await updateStandard(props.standard.id, payload)
        : await createStandard(payload);

    showModal.value = false;
    emit('saved', response.message);
  } catch (error: unknown) {
    const data = getApiErrorData(error);
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
          :class="[validator.getClassName('norm_key'), { 'is-invalid': backendErrors.norm_key?.length }]"
          @blur="validator.touchElement('norm_key')" />
        <FormsInputErrors :errors="validator.getErrors('norm_key')" />
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
          :class="[validator.getClassName('complement_1'), { 'is-invalid': backendErrors.complement_1?.length }]"
          @blur="validator.touchElement('complement_1')" />
        <FormsInputErrors :errors="validator.getErrors('complement_1')" />
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
          :class="[validator.getClassName('complement_2'), { 'is-invalid': backendErrors.complement_2?.length }]"
          @blur="validator.touchElement('complement_2')" />
        <FormsInputErrors :errors="validator.getErrors('complement_2')" />
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
          :class="[validator.getClassName('complement_3'), { 'is-invalid': backendErrors.complement_3?.length }]"
          @blur="validator.touchElement('complement_3')" />
        <FormsInputErrors :errors="validator.getErrors('complement_3')" />
        <div v-for="message in backendErrors.complement_3" :key="message" class="invalid-feedback d-block">
          {{ message }}
        </div>
      </BFormGroup>
    </BForm>
  </BModal>
</template>
