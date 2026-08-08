import type { SweetAlertOptions } from 'sweetalert2';
import type { ErrorAlertOptions, WarningAlertOptions, ToastOptions } from '~/types/swal';

async function getSwal() {
  if (!import.meta.client) {
    return null;
  }

  const { default: Swal } = await import('sweetalert2');

  return Swal;
}

export function useSwal() {
  async function success(title: string, showConfirmButton = true) {
    const Swal = await getSwal();

    return Swal?.fire({
      icon: 'success',
      title,
      showConfirmButton,
    });
  }

  async function error(options: ErrorAlertOptions) {
    const Swal = await getSwal();

    return Swal?.fire({
      title: options.title ?? '',
      text: options.text ?? '',
      icon: 'error',
      html: options.html ?? '',
      showConfirmButton: options.showConfirmButton ?? true,
      showCancelButton: options.showCancelButton ?? false,
      confirmButtonText: options.confirmButtonText ?? 'Aceptar',
      cancelButtonText: options.cancelButtonText ?? '',
    });
  }

  async function warning(options: WarningAlertOptions = {}): Promise<boolean> {
    const Swal = await getSwal();

    if (!Swal) {
      return false;
    }

    const result = await Swal.fire({
      title: options.title ?? '',
      text: options.text ?? '',
      icon: options.icon ?? 'warning',
      showCancelButton: true,
      confirmButtonColor: options.confirmButtonColor ?? '#010f60',
      cancelButtonColor: '#74788d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: options.confirmButtonText ?? 'Aceptar',
      customClass: {
        confirmButton: 'text-white',
      },
    });

    return result.isConfirmed;
  }

  async function toast(message: string, options: ToastOptions = {}) {
    const Swal = await getSwal();

    if (!Swal) {
      return;
    }

    const Toast = Swal.mixin({
      toast: true,
      position: options.position ?? 'top-end',
      showConfirmButton: options.showConfirmButton ?? false,
      timer: options.timer ?? 3000,
      timerProgressBar: options.timerProgressBar ?? true,
      didOpen: (toastElement) => {
        toastElement.onmouseenter = Swal.stopTimer;
        toastElement.onmouseleave = Swal.resumeTimer;
      },
    } satisfies SweetAlertOptions);

    return Toast.fire({
      icon: options.icon ?? 'success',
      text: message,
    });
  }

  return {
    success,
    error,
    warning,
    toast,
  };
}
