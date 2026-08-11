import type { SweetAlertIcon, SweetAlertPosition } from 'sweetalert2';

export interface ErrorAlertOptions {
  title?: string;
  text?: string;
  html?: string;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export interface WarningAlertOptions {
  title?: string;
  text?: string;
  icon?: SweetAlertIcon;
  confirmButtonColor?: string;
  confirmButtonText?: string;
}

export interface ToastOptions {
  position?: SweetAlertPosition;
  showConfirmButton?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
  icon?: SweetAlertIcon;
}
