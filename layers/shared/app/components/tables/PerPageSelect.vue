<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    options?: readonly number[];
    optionSelected?: number;
  }>(),
  {
    options: () => [10, 25, 50, 100],
    optionSelected: 10,
  },
);

const emit = defineEmits<{
  change: [perPage: number];
}>();

const itemsPerPage = ref(props.optionSelected);

watch(
  () => props.optionSelected,
  (value) => {
    itemsPerPage.value = value;
  },
);

watch(itemsPerPage, (value) => emit('change', value));
</script>

<template>
  <BCol cols="12" md="6">
    <div class="dataTables_length">
      <label class="d-inline-flex align-items-center">
        Mostrando&nbsp;
        <BFormSelect v-model="itemsPerPage" size="sm" :options="options" />
        &nbsp;registros
      </label>
    </div>
  </BCol>
</template>
