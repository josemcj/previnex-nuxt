<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    debounce?: number;
  }>(),
  {
    debounce: 1500,
  },
);

const emit = defineEmits<{
  search: [value: string];
}>();

const search = ref('');
let timeout: ReturnType<typeof setTimeout> | undefined;

watch(search, (value) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => emit('search', value), props.debounce);
});

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
});
</script>

<template>
  <div class="dataTables_filter">
    <label class="d-inline-flex align-items-center mb-0">
      <i class="bx bx-search-alt search-icon" />
      <BFormInput
        v-model="search"
        type="search"
        placeholder="Buscar..."
        class="form-control rounded bg-light border-0 ms-2" />
    </label>
  </div>
</template>
