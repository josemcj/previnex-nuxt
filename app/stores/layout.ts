import type { LayoutState } from '~/types/layouts';

type RuntimeLayoutState = Pick<LayoutState, 'loader'>;

export const useLayoutStore = defineStore('layout', {
  state: (): RuntimeLayoutState => ({
    loader: false,
  }),

  actions: {
    changeLoaderValue(loader: boolean) {
      this.loader = loader;
    },
  },
});
