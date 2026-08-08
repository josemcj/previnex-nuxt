<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import { useDropzone } from 'vue3-dropzone';
import type { DropzoneProps, PreviewEntry, DropzoneFiles } from '@/types/dropzone';

const props = withDefaults(defineProps<DropzoneProps>(), {
  isMultiple: false,
  allowedExtensions: () => [],
  allowedMimeTypes: () => [],
});

const files = defineModel<DropzoneFiles>({ default: () => [] });
const previewEntries = ref<PreviewEntry[]>([]);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  multiple: props.isMultiple,
  // accept: props.allowedMimeTypes,
});

function onDrop(acceptFiles: File[]): void {
  const validExtensions = props.allowedExtensions.map((ext) => ext.toLowerCase());

  const filteredFiles = acceptFiles.filter((file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.length) return true;
    return validExtensions.includes(ext);
  });

  files.value = filteredFiles;
}

function handleClickDeleteFile(index: number): void {
  files.value.splice(index, 1);
  files.value = [...files.value];
}

function onDeleteAll(): void {
  files.value = [];
}

const revokePreviews = (): void => {
  previewEntries.value.forEach((entry) => {
    if (entry.url) {
      URL.revokeObjectURL(entry.url);
    }
  });

  previewEntries.value = [];
};

const getFileExtension = (file: File): string => file.name?.split('.').pop()?.toLowerCase() || '';

const isImageFile = (file: File | null | undefined): boolean => {
  if (!file) return false;
  if (file.type && file.type.startsWith('image/')) return true;
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(getFileExtension(file));
};

const isPdfFile = (file: File | null | undefined): boolean => {
  if (!file) return false;
  if (file.type === 'application/pdf') return true;
  return getFileExtension(file) === 'pdf';
};

const buildPreviews = (fileList: File[] = []): void => {
  revokePreviews();

  previewEntries.value = fileList.map((file): PreviewEntry => {
    const isImage = isImageFile(file);
    const isPdf = isPdfFile(file);
    const needsUrl = isImage || isPdf;

    return {
      isImage,
      isPdf,
      url: needsUrl ? URL.createObjectURL(file) : undefined,
    };
  });
};

watch(
  files,
  (currentFiles) => {
    buildPreviews(currentFiles ?? []);
  },
  { deep: true, immediate: true },
);

onBeforeUnmount(() => {
  revokePreviews();
});
</script>

<template>
  <div class="dropzone text-center dz-clickable">
    <div class="dz-message needsclick" v-bind="getRootProps()">
      <div class="mb-3">
        <i class="display-4 text-muted uil uil-cloud-upload"></i>
      </div>

      <h5>
        {{ isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra los archivos aquí o da clic para subir' }}
      </h5>

      <label for="galleryDropzoneFile"></label>
      <input v-bind="getInputProps()" :accept="allowedExtensions.map((ext) => '.' + ext).join(',')" />
    </div>
  </div>

  <ul class="list-unstyled mb-0" id="dropzone-preview2">
    <li class="mt-2" id="dropzone-preview-list2">
      <div class="border rounded mb-1" v-for="(file, index) of files" :key="index">
        <div class="d-flex p-2 align-items-center">
          <div class="flex-shrink-0 me-3">
            <div class="avatar-sm bg-light rounded d-flex justify-content-center align-items-center overflow-hidden">
              <img
                v-if="previewEntries[index]?.isImage"
                :src="previewEntries[index]?.url"
                alt="Vista previa del documento"
                class="dropzone-preview-image" />
              <i v-else class="uil-paperclip fs-2"></i>
            </div>
          </div>
          <div class="flex-grow-1">
            <div class="pt-1">
              <h5 class="fs-md mb-1">
                {{ file.name }}
              </h5>
              <p class="fs-sm text-muted mb-0">{{ (file.size / 1024).toFixed(2) }} KB</p>
              <strong class="error text-danger"></strong>
            </div>
          </div>
          <div class="flex-shrink-0 ms-3 d-flex justify-content-center align-items-center">
            <BButton
              size="sm"
              variant="danger"
              @click="handleClickDeleteFile(index)"
              v-b-tooltip.hover.top="'Eliminar'">
              <i class="uil-trash-alt"></i>
            </BButton>
          </div>
        </div>
        <div v-if="previewEntries[index]?.isImage || previewEntries[index]?.isPdf" class="dropzone-preview-pane">
          <img
            v-if="previewEntries[index]?.isImage"
            :src="previewEntries[index]?.url"
            alt="Vista previa del documento"
            class="dropzone-preview-large" />
          <iframe
            v-else-if="previewEntries[index]?.isPdf"
            :src="previewEntries[index]?.url"
            title="Vista previa del PDF"
            class="dropzone-preview-pdf"></iframe>
        </div>
      </div>
    </li>
  </ul>

  <div v-if="files.length > 0" class="d-flex justify-content-end mt-3">
    <button class="btn btn-link" @click="onDeleteAll">
      <i class="uil-trash-alt"></i>
      Borrar todo
    </button>
  </div>
</template>

<style scoped>
.dropzone-preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.dropzone-preview-pane {
  padding: 0 1rem 1rem;
}

.dropzone-preview-large {
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  border-radius: 8px;
}

.dropzone-preview-pdf {
  width: 100%;
  height: 320px;
  border: none;
  border-radius: 8px;
}
</style>
