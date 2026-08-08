<script setup lang="ts">
import type { AppNotification } from '~/types/notifications';

const emit = defineEmits<{
  toggleMenu: [];
}>();

const authStore = useAuthStore();

const appConfig = useAppConfig();
const notificationsStore = useNotificationsStore();

const displayName = computed(() => {
  return authStore.getFullName() || 'Usuario';
});

const { items: notifications } = storeToRefs(notificationsStore);

async function selectNotification(notification: AppNotification) {
  notificationsStore.markAsRead(notification.id);

  if (notification.to) {
    await navigateTo(notification.to);
  }
}

async function toggleFullscreen() {
  if (!import.meta.client) {
    return;
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  await document.documentElement.requestFullscreen();
}

async function logout() {
  authStore.forceLogout();
  await navigateTo('/login');
}
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <div class="navbar-brand-box">
          <NuxtLink to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="~/assets/images/logo.svg" :alt="appConfig.title" height="22" />
            </span>

            <span class="logo-lg">
              <img src="~/assets/images/logo.svg" :alt="appConfig.title" height="34" />
            </span>
          </NuxtLink>

          <NuxtLink to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="~/assets/images/logo-light.svg" :alt="appConfig.title" height="22" />
            </span>

            <span class="logo-lg">
              <img src="~/assets/images/logo-light.svg" :alt="appConfig.title" height="34" />
            </span>
          </NuxtLink>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item"
          aria-label="Contraer o expandir menú lateral"
          @click="emit('toggleMenu')">
          <i class="fa fa-fw fa-bars" />
        </button>

        <form class="app-search d-none d-lg-block" @submit.prevent>
          <div class="position-relative">
            <input type="search" class="form-control" placeholder="Buscar..." aria-label="Buscar" />

            <span class="bx bx-search-alt" />
          </div>
        </form>
      </div>

      <div class="d-flex align-items-center">
        <button
          v-if="appConfig.features.toggleFullScreen"
          type="button"
          class="btn header-item d-none d-sm-inline-block"
          aria-label="Activar pantalla completa"
          @click="toggleFullscreen">
          <i class="bx bx-fullscreen font-size-24" />
        </button>

        <NotificationsDropdown
          v-if="appConfig.features.notifications"
          :items="notifications"
          view-all-to="#"
          @select="selectNotification"
          @mark-all-as-read="notificationsStore.markAllAsRead()" />

        <BDropdown variant="link" toggle-class="header-item" menu-class="dropdown-menu-end" no-caret>
          <template #button-content>
            <img src="~/assets/images/users/avatar-1.jpg" alt="" class="rounded-circle header-profile-user" />

            <span class="d-none d-xl-inline-block ms-1">
              {{ displayName }}
            </span>

            <i class="mdi mdi-chevron-down d-none d-xl-inline-block" />
          </template>

          <BDropdownItem to="/">
            <i class="bx bx-user font-size-16 align-middle me-1" />
            Perfil
          </BDropdownItem>

          <BDropdownDivider />

          <BDropdownItem href="#" @click.prevent="logout">
            <i class="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            Cerrar sesión
          </BDropdownItem>
        </BDropdown>
      </div>
    </div>
  </header>
</template>
