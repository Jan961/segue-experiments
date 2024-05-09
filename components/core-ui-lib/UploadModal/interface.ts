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
  index: number;
  onDelete: (index: number) => void;
  progress?: number;
  errorMessage?: string;
}

export interface UploadModalProps {
  title: string;
  visible: boolean;
  onClose?: () => void;
  info: string;
  isMultiple?: boolean;
  maxFiles: number;
  maxFileSize: number;
  allowedFormats: string[];
  onChange?: (selectedFiles: FileProps[]) => void;
  onSave?: (
    selectedFiles: FileProps[],
    onProgress: (file: File, uploadProgress: number) => void,
    onError: (file: File, errorMessage: string) => void,
  ) => void;
}
