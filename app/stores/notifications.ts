import type { AppNotification } from '~/types/notifications';

export const useNotificationsStore = defineStore('notifications', () => {
  const items = ref<AppNotification[]>([
    {
      id: '1',
      title: 'Nueva solicitud',
      message: 'Se ha recibido una nueva solicitud.',
      createdAtLabel: 'Hace 3 minutos',
      read: false,
      icon: 'bx-cart',
      variant: 'primary',
      to: '/',
    },
    {
      id: '2',
      title: 'Información actualizada',
      message: 'Los datos fueron actualizados correctamente.',
      createdAtLabel: 'Hace 10 minutos',
      read: false,
      icon: 'bx-check-circle',
      variant: 'success',
      to: '/',
    },
    {
      id: '3',
      title: 'Recordatorio',
      message: 'Tienes una actividad pendiente.',
      createdAtLabel: 'Hace una hora',
      read: true,
      icon: 'bx-time-five',
      variant: 'warning',
      to: '/',
    },
  ]);

  const unreadCount = computed(() => {
    return items.value.filter((item) => !item.read).length;
  });

  function markAsRead(id: string) {
    const notification = items.value.find((item) => item.id === id);

    if (notification) {
      notification.read = true;
    }
  }

  function markAllAsRead() {
    for (const notification of items.value) {
      notification.read = true;
    }
  }

  function replaceItems(notifications: AppNotification[]) {
    items.value = notifications;
  }

  function addItem(notification: AppNotification) {
    items.value.unshift(notification);
  }

  function clear() {
    items.value = [];
  }

  return {
    items,
    unreadCount,
    markAsRead,
    markAllAsRead,
    replaceItems,
    addItem,
    clear,
  };
});
