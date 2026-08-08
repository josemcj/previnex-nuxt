export interface User {
  name: string;
  last_name: string;
  [key: string]: any;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}
