import * as XLSX from 'xlsx';
import type { ExcelArrayRow, ExcelExportData, ExcelJsonRow, ExcelRowObject } from '@/types/xlsx';

export function useXLSX() {
  function isValidFile(file: File | null | undefined): boolean {
    if (!file) return false;

    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

    return allowedExtensions.includes(fileExtension);
  }

  function toJson(file: File, hasHeaders: boolean = true, cellsToString: boolean = true): Promise<ExcelJsonRow[]> {
    if (!isValidFile(file)) {
      return Promise.reject(new Error('No se proporcionó un archivo válido.'));
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result;

          if (!(result instanceof ArrayBuffer)) {
            reject(new Error('No fue posible leer el contenido del archivo.'));
            return;
          }

          const data = new Uint8Array(result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];

          if (!sheetName) {
            reject(new Error('El archivo no contiene hojas.'));
            return;
          }

          const sheet = workbook.Sheets[sheetName];

          if (!sheet) {
            reject(new Error('No fue posible obtener la hoja del archivo.'));
            return;
          }
          const rawData = hasHeaders
            ? (XLSX.utils.sheet_to_json(sheet) as ExcelRowObject[])
            : (XLSX.utils.sheet_to_json(sheet, { header: 1 }) as ExcelArrayRow[]);

          if (cellsToString) {
            resolve(convertCellsToString(rawData));
            return;
          }

          resolve(rawData);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error desconocido';
          reject(new Error(`Error al procesar el archivo: ${message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  function convertCellsToString(json: ExcelJsonRow[]): ExcelJsonRow[] {
    return json.map((row) => {
      if (Array.isArray(row)) {
        return row.map((cell) => String(cell ?? ''));
      }

      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, String(value ?? '')]),
      ) as ExcelRowObject;
    });
  }

  function flattenObject(
    obj: ExcelRowObject,
    parentKey: string = '',
    result: Record<string, unknown> = {},
  ): Record<string, unknown> {
    for (const key in obj) {
      const value = obj[key];
      const propName = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flattenObject(value as ExcelRowObject, propName, result);
      } else {
        result[propName] = value;
      }
    }

    return result;
  }

  function toExcel(data: ExcelExportData, fileName: string = 'file', excludeFields: string[] = []): void {
    if (!Array.isArray(data) || data.length === 0) return;

    const cleanData = data.map((item) => {
      const shallowCopy: Record<string, unknown> = { ...item };

      excludeFields
        .filter((field) => !field.includes('.'))
        .forEach((field) => {
          delete shallowCopy[field];
        });

      const flattened = flattenObject(shallowCopy as ExcelRowObject);

      return Object.fromEntries(
        Object.entries(flattened).filter(([key]) => {
          return !excludeFields.some((excluded) => key === excluded || key.startsWith(`${excluded}.`));
        }),
      );
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  return { isValidFile, toJson, toExcel };
}
