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
    <label class="search-field mb-0">
      <i class="bx bx-search-alt search-icon" />
      <BFormInput
        v-model="search"
        type="search"
        placeholder="Buscar..."
        class="search-input form-control rounded bg-light border-0" />
    </label>
  </div>
</template>

<style scoped>
.dataTables_filter,
.search-field {
  width: 100%;
}

.search-field {
  position: relative;
  display: block;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.8rem;
  z-index: 2;
  transform: translateY(-50%);
}

.search-input {
  width: 100%;
  padding-left: 2.25rem;
}

@media (min-width: 576px) {
  .dataTables_filter,
  .search-field,
  .search-input {
    width: 240px;
  }
}
</style>
