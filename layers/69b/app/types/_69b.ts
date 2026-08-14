export interface _69bStatus {
  id: number | string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Taxpayer69bStatus {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface _69bRecord {
  id: number;
  name: string;
  tax_id: string | null;
  taxpayer_69b_status_id: number | null;
  taxpayer_69b_status?: Taxpayer69bStatus;
  presumption_number: string | null;
  presumption_date: string | null;
  sat_global_official_number: string | null;
  sat_global_official_date: string | null;
  status_id: number | string;
  status?: _69bStatus;
  created_at?: string;
  updated_at?: string;
}

export interface _69bPayload {
  name: string;
  tax_id: string | null;
  taxpayer_69b_status_id: number | null;
  presumption_number: string | null;
  presumption_date: string | null;
  sat_global_official_number: string | null;
  sat_global_official_date: string | null;
  status_id: number;
}

export interface Verify69bPayload {
  search: string;
}

export interface Import69bPayloadItem {
  tax_id: string;
  name: string;
  taxpayer_69b_status_id?: number | null;
  presumption_number?: string | null;
  presumption_date?: string | null;
  sat_global_official_number?: string | null;
  sat_global_official_date?: string | null;
}

export interface Import69bSummary {
  imported: number;
  skipped: number;
  errors: string[];
  message: string;
}

export interface Import69bSyncResult {
  pending?: unknown;
  providers?: number;
  importers?: number;
  consignees?: number;
  customers?: number;
}

export interface Import69bResponseData {
  import: Import69bSummary;
  sync: Import69bSyncResult;
  message: string;
}
