import type { RecordStatus } from '#layers/shared/app/types/RecordStatus';

export interface Taxpayer69bStatus {
  id: number;
  name: string;
  status_id: string | number;
  status?: RecordStatus;
  created_at: string;
  updated_at: string;
}

export interface Taxpayer69bStatusPayload {
  name: string;
  status_id: number;
}
