export type ExcelPrimitive = string | number | boolean | null | undefined;

export interface ExcelRowObject {
  [key: string]: unknown;
}
export type ExcelArrayRow = string[];

export type ExcelJsonRow = ExcelRowObject | ExcelArrayRow;

export type ExcelExportData = ExcelRowObject[];
