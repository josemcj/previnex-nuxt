export type ValidationError = {
  $uid: string;
  $message: string;
};

export type ValidationNode = {
  $dirty?: boolean;
  $error?: boolean;
  $invalid?: boolean;
  $errors?: ValidationError[];
  $touch?: () => void;
  $reset?: () => void;
  [key: string]: unknown;
};

