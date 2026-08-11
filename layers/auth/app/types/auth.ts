export interface User {
  id: number;
  name: string;
  last_name: string;
  second_last_name: string | null;
  username: string;
  email: string;
  role_id: string;
  status_id: string;
  language_id: string;
  organization_id: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: true;
  code: 200;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface LogoutResponse {
  status: true;
  code: 200;
  message: string;
  data: unknown[];
}

export interface ApiErrorResponse {
  status: false;
  code: number;
  message: string;
  errors: unknown[];
}
