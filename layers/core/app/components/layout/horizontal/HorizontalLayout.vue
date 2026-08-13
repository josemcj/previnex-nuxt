<script setup lang="ts">
const appConfig = useAppConfig();

const { width: layoutWidth, topbar } = appConfig.layout;

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
