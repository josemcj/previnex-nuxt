export interface StandardStatus {
  id: number;
  name: string;
  name_es: string;
  name_zh: string;
  created_at: string;
  updated_at: string;
}

export interface Standard {
  id: number;
  name: string;
  norm_key: string;
  complement_1: string | null;
  complement_2: string | null;
  complement_3: string | null;
  status_id: string | number;
  status: StandardStatus;
  created_at: string;
  updated_at: string;
  trackings: unknown[];
}

export interface StandardPayload {
  norm_key: string;
  complement_1: string;
  complement_2: string | null;
  complement_3: string | null;
  status_id: number;
}

export interface StandardApiResponse {
  status: boolean;
  code: number;
  message: string;
  data: Standard;
}
