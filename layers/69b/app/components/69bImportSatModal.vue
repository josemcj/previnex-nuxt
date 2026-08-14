<script setup lang="ts">
import * as XLSX from 'xlsx';
import type { ExcelArrayRow } from '#layers/shared/app/types/xlsx';
import type { Import69bPayloadItem } from '../types/_69b';
import { use69bApi } from '../composables/use69bApi';

const showModal = defineModel<boolean>({ default: false });
const emit = defineEmits<{
  imported: [message: string];
}>();

const files = ref<File[]>([]);
const formMessage = ref('');
const isSubmitting = ref(false);
const parsedCount = ref(0);
const unmappedSituations = ref<string[]>([]);
const isDragActive = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const { import69b } = use69bApi();

const situationMap: Record<string, number> = {
  definitivo: 1,
  presunto: 4,
};

function normalizeText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeSituationKey(value: unknown): string {
  return normalizeText(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function excelSerialToDate(value: number): string | null {
  const parsed = XLSX.SSF.parse_date_code(value);
  if (!parsed) return null;
  const month = String(parsed.m).padStart(2, '0');
  const day = String(parsed.d).padStart(2, '0');
  return `${parsed.y}-${month}-${day}`;
}

function normalizeDate(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return excelSerialToDate(value);

  const text = normalizeText(value);
  if (!text) return null;

  const isoMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

  const slashMatch = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, rawDay = '', rawMonth = '', rawYear = ''] = slashMatch;
    return `${rawYear}-${rawMonth.padStart(2, '0')}-${rawDay.padStart(2, '0')}`;
  }

  return null;
}

function findHeaderRow(rows: ExcelArrayRow[]): number {
  const candidates = ['rfc', 'nombre', 'situacion', 'situación'];

  return rows.findIndex((row) => {
    const joined = row.map((cell) => normalizeSituationKey(cell)).join('|');
    return candidates.every((token) => joined.includes(normalizeSituationKey(token)));
  });
}

function buildHeaderMap(row: ExcelArrayRow): Record<string, number> {
  const map: Record<string, number> = {};

  row.forEach((cell, index) => {
    const key = normalizeSituationKey(cell);
    if (key) map[key] = index;
  });

  return map;
}

function resolveIndex(map: Record<string, number>, keys: string[], fallback: number): number {
  for (const key of keys) {
    const normalized = normalizeSituationKey(key);
    const index = map[normalized];
    if (index !== undefined) return index;
  }

  return fallback;
}

function parseRows(rows: ExcelArrayRow[]): Import69bPayloadItem[] {
  const headerRowIndex = findHeaderRow(rows);
  const dataStartIndex = headerRowIndex >= 0 ? headerRowIndex + 1 : 3;
  const headerMap = headerRowIndex >= 0 ? buildHeaderMap(rows[headerRowIndex] ?? []) : {};

  const taxIdIndex = resolveIndex(headerMap, ['rfc', 'tax id', 'tax_id'], 0);
  const nameIndex = resolveIndex(headerMap, ['nombre', 'razon social', 'razón social', 'name'], 1);
  const situationIndex = resolveIndex(headerMap, ['situacion', 'situación', 'situacion del contribuyente'], 2);
  const presumptionNumberIndex = resolveIndex(headerMap, ['numero presuncion', 'número presunción', 'presumption_number'], 3);
  const presumptionDateIndex = resolveIndex(headerMap, ['fecha presuncion', 'fecha presunción', 'presumption_date'], 4);
  const satNumberIndex = resolveIndex(headerMap, ['num oficio global sat', 'número oficio global sat', 'sat_global_official_number'], 5);
  const satDateIndex = resolveIndex(headerMap, ['fecha oficio global sat', 'sat_global_official_date'], 6);

  const unknownSituations = new Set<string>();
  const parsed: Import69bPayloadItem[] = [];

  rows.slice(dataStartIndex).forEach((row) => {
    const tax_id = normalizeText(row[taxIdIndex]);
    const name = normalizeText(row[nameIndex]);
    const situationRaw = row[situationIndex];
    const situationLabel = normalizeText(situationRaw);
    const situationKey = normalizeSituationKey(situationLabel);
    const mappedStatusId = typeof situationRaw === 'number' ? situationRaw : situationMap[situationKey] ?? null;

    if (situationLabel && mappedStatusId === null) {
      unknownSituations.add(situationLabel);
    }

    if (!tax_id || !name) return;

    parsed.push({
      tax_id,
      name,
      taxpayer_69b_status_id: mappedStatusId,
      presumption_number: normalizeText(row[presumptionNumberIndex]) || null,
      presumption_date: normalizeDate(row[presumptionDateIndex]),
      sat_global_official_number: normalizeText(row[satNumberIndex]) || null,
      sat_global_official_date: normalizeDate(row[satDateIndex]),
    });
  });

  parsedCount.value = parsed.length;
  unmappedSituations.value = Array.from(unknownSituations);

  return parsed;
}

async function readWorkbookRows(file: File): Promise<ExcelArrayRow[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error('El archivo no contiene hojas.');
  }

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    throw new Error('No fue posible obtener la hoja del archivo.');
  }

  return XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true }) as ExcelArrayRow[];
}

function assignFiles(selectedFiles: FileList | File[] | null | undefined) {
  const source = Array.from(selectedFiles ?? []);
  files.value = source.filter((file) => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    return ['csv', 'xls', 'xlsx'].includes(extension);
  });
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement | null;
  assignFiles(target?.files);
}

function openFileSelector() {
  fileInput.value?.click();
}

function onDragEnter() {
  isDragActive.value = true;
}

function onDragLeave() {
  isDragActive.value = false;
}

function onDrop(event: DragEvent) {
  event.preventDefault();
  isDragActive.value = false;
  assignFiles(event.dataTransfer?.files);
}

async function onSubmit() {
  if (isSubmitting.value) return;
  if (files.value.length === 0) {
    formMessage.value = 'Debes seleccionar un archivo para importar.';
    return;
  }

  isSubmitting.value = true;
  formMessage.value = '';

  try {
    const file = files.value[0];
    if (!file) {
      throw new Error('Debes seleccionar un archivo para importar.');
    }

    const rows = await readWorkbookRows(file);
    const payload = parseRows(rows);

    if (payload.length === 0) {
      throw new Error('No fue posible obtener filas válidas del archivo.');
    }

    const response = await import69b(payload);
    emit('imported', response.message);
    showModal.value = false;
  } catch (error: unknown) {
    formMessage.value =
      error instanceof Error ? error.message : getApiErrorData(error).message ?? 'No fue posible importar el archivo.';
  } finally {
    isSubmitting.value = false;
  }
}

function onHidden() {
  files.value = [];
  formMessage.value = '';
  parsedCount.value = 0;
  unmappedSituations.value = [];
  isDragActive.value = false;

  if (fileInput.value) {
    fileInput.value.value = '';
  }
}
</script>

<template>
  <BModal
    v-model="showModal"
    title="Importar Archivo SAT 69-B"
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
    @hidden="onHidden">
    <div class="import-69b-panel">
      <BAlert variant="info" :model-value="true" class="mb-4">
        <strong>Formato esperado:</strong>
        <div>Archivo CSV o Excel (.csv, .xlsx, .xls) del SAT.</div>
        <div>Formato oficial del "Listado completo de contribuyentes (Artículo 69-B del CFF)"</div>
        <div>Los datos deben comenzar en la fila 4</div>
        <div>Se extraerán: RFC, Nombre, Situación, Oficios y Fechas</div>
        <div><strong>Nota:</strong> Se excluirán automáticamente RFC inválidos (XXXXX, XXX, etc.)</div>
        <div><strong>Nota:</strong> Se deduplicará por RFC + Nombre (tax_id + name) antes de enviar</div>
      </BAlert>

      <BAlert v-if="formMessage" variant="danger" :model-value="true" class="mb-3">
        {{ formMessage }}
      </BAlert>

      <input
        ref="fileInput"
        type="file"
        accept=".csv,.xls,.xlsx"
        class="d-none"
        @change="onFileChange" />

      <div
        class="import-69b-dropzone"
        :class="{ 'is-drag-active': isDragActive }"
        role="button"
        tabindex="0"
        @click="openFileSelector"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop="onDrop"
        @keydown.enter.prevent="openFileSelector"
        @keydown.space.prevent="openFileSelector">
        <div class="import-69b-dropzone-text">
          Arrastra y suelta los archivos aquí o haz clic para seleccionarlos
        </div>
      </div>

      <div v-if="files.length > 0" class="import-69b-file-name">
        {{ files[0]?.name }}
      </div>

      <BAlert v-if="parsedCount > 0" variant="secondary" :model-value="true" class="mt-3 mb-0">
        Se detectaron {{ parsedCount }} filas válidas para importar.
      </BAlert>

      <BAlert v-if="unmappedSituations.length > 0" variant="warning" :model-value="true" class="mt-3 mb-0">
        Algunas situaciones no se pudieron mapear a un ID 69-B y se enviarán vacías:
        {{ unmappedSituations.join(', ') }}
      </BAlert>
    </div>

    <div class="d-flex justify-content-end gap-2">
      <BButton variant="danger" @click="showModal = false">Cerrar</BButton>
      <BButton variant="success" :disabled="isSubmitting || files.length === 0" @click="onSubmit">
        <BSpinner v-if="isSubmitting" small class="me-2" />
        Importar SAT
      </BButton>
    </div>
  </BModal>
</template>

<style scoped>
.import-69b-panel {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #eef3fb;
  border-radius: 0.75rem;
}

.import-69b-dropzone {
  min-height: 120px;
  padding: 1.5rem;
  border: 2px solid #778496;
  border-radius: 1rem;
  background: #f5f8fd;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.import-69b-dropzone.is-drag-active {
  border-color: #2bb7da;
  background-color: #eefbff;
}

.import-69b-dropzone-text {
  color: #2b2b2b;
  font-weight: 700;
  line-height: 1.5;
}

.import-69b-file-name {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #4b5563;
  text-align: center;
}
</style>
