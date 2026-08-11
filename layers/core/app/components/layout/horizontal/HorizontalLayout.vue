<script setup lang="ts">
const appConfig = useAppConfig();

const { width: layoutWidth, topbar } = appConfig.layout;

const layoutStore = useLayoutStore();
const { loader } = storeToRefs(layoutStore);

const menuOpen = ref(false);

useHead(() => ({
  bodyAttrs: {
    'data-layout': 'horizontal',
    'data-topbar': topbar,
    'data-layout-size': layoutWidth === 'boxed' ? 'boxed' : null,
  },
}));

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}
</script>

<template>
  <div>
    <div v-if="loader" id="preloader">
      <div id="status">
        <div class="spinner-chase">
          <div v-for="index in 6" :key="index" class="chase-dot" />
        </div>
      </div>
    </div>

    <div id="layout-wrapper">
      <LayoutHorizontalHeader :menu-open="menuOpen" @toggle-menu="toggleMenu" />
      <LayoutHorizontalNav :open="menuOpen" @close="menuOpen = false" />

      <div class="main-content">
        <div class="page-content">
          <BContainer fluid>
            <slot />
          </BContainer>
        </div>

        <LayoutFooter />
      </div>
    </div>
  </div>
</template>
