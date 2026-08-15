<script setup lang="ts">
import { helpers, required } from '@vuelidate/validators';
import type { _69bRecord } from '../types/_69b';
import { use69bApi } from '../composables/use69bApi';

const showModal = defineModel<boolean>({ default: false });

const validator = useValidation();
const isSubmitting = ref(false);
const search = ref('');
const formMessage = ref('');
const results = ref<_69bRecord[]>([]);
const hasSearched = ref(false);

const rules = {
  search: {
    required: helpers.withMessage('Debes ingresar un RFC o razón social.', required),
  },
};

validator.create(rules, { search });

const { verify69b } = use69bApi();

async function onSubmit() {
  validator.touch();
  if (validator.isInvalid() || isSubmitting.value) return;

  isSubmitting.value = true;
  formMessage.value = '';

  try {
    results.value = await verify69b({ search: search.value.trim() });
    hasSearched.value = true;

    if (results.value.length === 0) {
      formMessage.value = 'No se encontraron coincidencias en 69-B.';
    }
  } catch (error: unknown) {
    const data = getApiErrorData(error);
    formMessage.value = data.message ?? 'No fue posible verificar el RFC o razón social.';
    results.value = [];
    hasSearched.value = true;
  } finally {
    isSubmitting.value = false;
  }
}

function resetState() {
  search.value = '';
  formMessage.value = '';
  results.value = [];
  hasSearched.value = false;
  validator.reset();
}

function onHidden() {
  resetState();
}
</script>

<template>
  <BModal
    v-model="showModal"
    title="Verificar RFC o Razón Social en 69-B"
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
    @hidden="onHidden">
    <BForm novalidate @submit.prevent="onSubmit">
      <BAlert v-if="formMessage" variant="info" :model-value="true" class="mb-3">
        {{ formMessage }}
      </BAlert>

      <BFormGroup class="mb-3" label="RFC o Razón Social" label-for="verify-69b-search">
        <div class="d-flex gap-2">
          <BFormInput
            id="verify-69b-search"
            v-model="search"
            placeholder="Ingresa RFC o Razón Social..."
            :disabled="isSubmitting"
            :class="[validator.getClassName('search')]"
            @blur="validator.touchElement('search')" />
          <BButton type="submit" variant="primary" :disabled="isSubmitting">
            <BSpinner v-if="isSubmitting" small class="me-2" />
            Verificar
          </BButton>
        </div>
        <FormsInputErrors :errors="validator.getErrors('search')" />
      </BFormGroup>
    </BForm>

    <div v-if="results.length > 0" class="table-responsive">
      <BTable
        :items="results"
        :fields="[
          { key: 'tax_id', label: 'RFC/Tax ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'taxpayer_69b_status.name', label: 'Situación' },
          { key: 'status_id', label: 'Estado' },
        ]"
        small
        striped
        hover>
        <template #cell(status_id)="data">
          <TablesStatusBadge :status="Number(data.item.status_id) || 0" />
        </template>
      </BTable>
    </div>

    <div v-else-if="hasSearched" class="text-muted small">
      La búsqueda terminó sin coincidencias.
    </div>
  </BModal>
</template>
