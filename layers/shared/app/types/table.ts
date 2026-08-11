export type TableStatusValue = number | string;

export interface TableRow {
  id?: unknown;
  permissions?: readonly string[] | string;
  status?: TableStatusValue | { id?: TableStatusValue };
  status_id?: TableStatusValue;
}
