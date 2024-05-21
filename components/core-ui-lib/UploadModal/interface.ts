export enum FileStatusVals {
  Selected = 'selected',
  Uploading = 'uploading',
  Uploaded = 'uploaded',
}

export interface FileProps {
  size: number;
  name: string;
  error?: string;
  file: File;
}

export interface FileCardProps {
  file: FileProps;
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
  onChange?: (selectedFiles: FileProps[]) => void;
  onSave?: (
    selectedFiles: FileProps[],
    onProgress: (file: File, uploadProgress: number) => void,
    onError: (file: File, errorMessage: string) => void,
    onUploadingImage: (file: File, imageUrl: string) => void,
  ) => void;
}
