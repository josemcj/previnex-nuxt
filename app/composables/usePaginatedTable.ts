import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { Ref } from 'vue';
import type { ApiMethod } from '@/types/paginatedTable';

export function usePaginatedTable<T extends Record<string, unknown>>(
  fields: readonly TableFieldRaw<T>[],
  apiMethod: ApiMethod<T> = async () => ({
    status: 200,
    data: {
      data: [],
      total: 0,
    },
  }),
  itemsPerPage: number = 10,
) {
  const tableFields: readonly TableFieldRaw<T>[] = fields;
  const tableItems: Ref<T[]> = ref([]);
  const currentPage = ref(1);
  const perPage = ref(itemsPerPage);
  const totalRows = ref(0);
  const isBusy = ref(false);
  const search = ref('');

  const fetchData = async (): Promise<void> => {
    isBusy.value = true;

    try {
      const response = await apiMethod(currentPage.value, perPage.value, search.value);

      if (response?.status === 200) {
        const { data } = response;
        tableItems.value = data.data ?? [];
        totalRows.value = data.total ?? 0;
      }
    } finally {
      isBusy.value = false;
    }
  };

  const onSearch = (value: string): void => {
    search.value = value;
    currentPage.value = 1;
    void fetchData();
  };

  const onTableChange = (currPage: number, itemsPerPage: number): void => {
    currentPage.value = currPage;
    perPage.value = itemsPerPage;
    void fetchData();
  };

  const onPerPageChange = (itemsPerPage: number): void => {
    perPage.value = itemsPerPage;
    currentPage.value = 1;
    void fetchData();
  };

  const onCurrentPageChange = (currPage: number): void => {
    currentPage.value = currPage;
    void fetchData();
  };

  return {
    tableFields,
    tableItems,
    isBusy,
    currentPage,
    perPage,
    totalRows,
    fetchData,
    onSearch,
    onPerPageChange,
    onCurrentPageChange,
    onTableChange,
  };
}
