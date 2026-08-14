import type { RecordStatus } from '#layers/shared/app/types/RecordStatus';

export interface ERequiredDocument {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface EDocumentType {
  id: number;
  user_id?: number | null;
  name: string;
  vucem_code: string | null;
  required_document_id: number | null;
  status_id: number | string;
  status?: RecordStatus;
  requiredDocument?: ERequiredDocument | null;
  created_at?: string;
  updated_at?: string;
}

export interface EDocumentTypePayload {
  name: string;
  vucem_code: string | null;
  required_document_id: number | null;
  status_id: number;
}

export type DocumentType = EDocumentType;
export type DocumentTypePayload = EDocumentTypePayload;
