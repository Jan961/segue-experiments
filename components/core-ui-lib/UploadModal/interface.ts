export enum FileStatusVals {
  Selected = 'selected',
  Uploading = 'uploading',
  Uploaded = 'uploaded',
}

export interface UploadedFile {
  id?: number;
  size: number;
  name: string;
  error?: string;
  file?: File;
  imageUrl?: string;
  location?: string;
  fileId?: number;
}

export interface FileCardProps {
  fileName: string;
  fileSize?: number;
  onDelete: () => void;
  progress?: number;
  errorMessage?: string;
  imageUrl?: string;
}

export interface UploadModalProps {
  title: string;
  visible: boolean;
  onClose?: () => void;
  info: string;
  isMultiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  allowedFormats: string[];
  testId?: string;
  onChange?: (selectedFiles: UploadedFile[]) => void;
  onSave?: (
    selectedFiles: UploadedFile[],
    onProgress: (file: File, uploadProgress: number) => void,
    onError: (file: File, errorMessage: string) => void,
    onUploadingImage: (file: File, imageUrl: string) => void,
  ) => void;
  value?: UploadedFile[] | UploadedFile;
  customHandleFileDelete?: (deletedFile?: any) => Promise<void>;
}

export const attachmentMimeTypes = {
  marketing: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'text/plain',
  ],
};
