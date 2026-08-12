import type { TableFieldRaw } from 'bootstrap-vue-next';
import type { Ref } from 'vue';
import type { ApiMethod } from '~~/layers/shared/app/types/paginatedTable';
import type { TableRow } from '~~/layers/shared/app/types/table';

export function usePaginatedTable<T extends TableRow>(
  fields: readonly TableFieldRaw<T>[],
  apiMethod: ApiMethod<T>,
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
      const response = await apiMethod({
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value || undefined,
      });

      tableItems.value = response.data ?? [];
      totalRows.value = response.total ?? 0;
      currentPage.value = response.current_page ?? currentPage.value;
      perPage.value = response.per_page ?? perPage.value;
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
