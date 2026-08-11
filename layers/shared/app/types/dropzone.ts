export interface DropzoneProps {
  isMultiple?: boolean;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

export interface PreviewEntry {
  isImage: boolean;
  isPdf: boolean;
  url: string | undefined;
}

export type DropzoneFiles = File[];