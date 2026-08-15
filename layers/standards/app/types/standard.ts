import type { RecordStatus } from '#layers/shared/app/types/RecordStatus';

export interface Standard {
  id: number;
  name: string;
  norm_key: string;
  complement_1: string | null;
  complement_2: string | null;
  complement_3: string | null;
  status_id: string | number;
  status: RecordStatus;
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
