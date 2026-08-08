<script setup lang="ts">
import type { AppNotification } from '~/types/notifications';

const props = withDefaults(
  defineProps<{
    items?: AppNotification[];
    title?: string;
    viewAllTo?: string;
    viewAllLabel?: string;
    emptyText?: string;
  }>(),
  {
    items: () => [],
    title: 'Notificaciones',
    viewAllTo: '/',
    viewAllLabel: 'Ver más',
    emptyText: 'No tienes notificaciones',
  },
);

const emit = defineEmits<{
  select: [notification: AppNotification];
  viewAll: [];
  markAllAsRead: [];
}>();

const unreadCount = computed(() => {
  return props.items.filter((item) => !item.read).length;
});

async function selectNotification(notification: AppNotification) {
  emit('select', notification);

  if (notification.to) {
    await navigateTo(notification.to);
  }
}

function viewAll() {
  emit('viewAll');
}

function markAllAsRead() {
  emit('markAllAsRead');
}
</script>

<template>
  <BDropdown
    id="notifications-dropdown"
    variant="link"
    toggle-class="header-item noti-icon"
    menu-class="dropdown-menu-lg p-0 dropdown-menu-end skote-notifications-menu"
    no-caret>
    <template #button-content>
      <i class="bx bx-bell bx-tada" />

      <span v-if="unreadCount" class="badge bg-danger rounded-pill">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>

      <span class="visually-hidden">{{ unreadCount }} notificaciones sin leer</span>
    </template>

    <div class="p-3">
      <div class="row align-items-center">
        <div class="col">
          <h6 class="m-0">
            {{ title }}
          </h6>
        </div>

        <div class="col-auto">
          <a v-if="unreadCount" href="#" class="small" @click.prevent.stop="markAllAsRead">Marcar todas como leídas</a>
          <span v-else class="small text-muted">Todo leído</span>
        </div>
      </div>
    </div>

    <div data-simplebar style="max-height: 230px; overflow: auto">
      <div v-if="items.length === 0" class="p-3 text-center text-muted">
        {{ emptyText }}
      </div>

      <a
        v-for="notification in items"
        v-else
        :key="notification.id"
        href="#"
        class="text-reset notification-item"
        :class="{
          'notification-item-unread': !notification.read,
        }"
        @click.prevent="selectNotification(notification)">
        <div class="d-flex">
          <img
            v-if="notification.avatar"
            :src="notification.avatar"
            :alt="notification.title"
            class="me-3 rounded-circle avatar-xs" />

          <div v-else class="avatar-xs me-3">
            <span
              :class="['avatar-title', `bg-${notification.variant || 'primary'}`, 'rounded-circle', 'font-size-16']">
              <i :class="['bx', notification.icon || 'bx-bell']" />
            </span>
          </div>

          <div class="flex-grow-1">
            <h6 class="mt-0 mb-1">
              {{ notification.title }}
            </h6>

            <div class="font-size-12 text-muted">
              <p class="mb-1">
                {{ notification.message }}
              </p>

              <p class="mb-0">
                <i class="mdi mdi-clock-outline" />
                {{ notification.createdAtLabel }}
              </p>
            </div>
          </div>
          <span v-if="!notification.read" class="notification-unread-dot" aria-label="Notificación sin leer" />
        </div>
      </a>
    </div>

    <div class="p-2 border-top d-grid">
      <NuxtLink :to="viewAllTo" class="btn btn-sm btn-link font-size-14 text-center" @click="viewAll">
        <i class="mdi mdi-arrow-right-circle me-1" />
        <span>{{ viewAllLabel }}</span>
      </NuxtLink>
    </div>
  </BDropdown>
</template>
