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
  <BCol cols="12" md="6">
    <div class="dataTables_filter text-md-end">
      <label class="d-inline-flex align-items-center">
        <i class="mdi mdi-magnify search-icon" />
        <BFormInput
          v-model="search"
          type="search"
          placeholder="Buscar..."
          class="form-control rounded bg-light border-0 ms-2" />
      </label>
    </div>
  </BCol>
</template>
