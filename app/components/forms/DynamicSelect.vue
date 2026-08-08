<script setup lang="ts">
import type { SelectOption } from '@/types/forms';

type SelectValue = string | number | null;
type SelectRecord = Record<string, unknown>;

interface CollectionResponse {
  data: SelectRecord[];
}

const props = withDefaults(
  defineProps<{
    label: string;
    uri: string;
    className?: string;
    required?: boolean;
  }>(),
  {
    className: '',
    required: true,
  },
);

const value = defineModel<SelectValue>({ default: null });
const emit = defineEmits<{
  change: [value: SelectValue];
}>();

const { $api } = useNuxtApp();
const formSelect = useForm().select();
const elementId = useId();
const options = ref<SelectOption<SelectRecord>[]>(formSelect.loading);

async function fetchOptions(): Promise<void> {
  options.value = formSelect.loading;

  try {
    const response = await $api<CollectionResponse>(props.uri);

    options.value = response.data.length > 0 ? formSelect.create(response.data) : formSelect.createEmpty();
  } catch {
    options.value = formSelect.createError();
  }
}

onMounted(fetchOptions);

watch(
  () => props.uri,
  () => void fetchOptions(),
);
</script>

<template>
  <BFormGroup
    :id="`input-group-${elementId}`"
    :label="label"
    :label-for="`select-${elementId}`"
    label-class="fw-normal"
    class="mb-3">
    <BFormSelect
      :id="`select-${elementId}`"
      v-model="value"
      :options="options"
      :class="className"
      :required="required"
      @change="emit('change', value)" />
    <slot />
  </BFormGroup>
</template>
