import React, { useEffect, useRef, useState } from 'react';
import Modal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import FileCard from './UploadFileCard';
import { fileSizeFormatter } from './util';

interface SelectedFileProps {
  size: number;
  name: string;
  status: 'selected' | 'uploading' | 'uploaded';
  progress: number;
  error?: string;
  file: File;
}

interface UploadModalProps {
  title: string;
  visible: boolean;
  onClose?: () => void;
  info: string;
  isMultiple?: boolean;
  maxFiles: number;
  maxFileSize: number;
  allowedFormats: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave?: (selectedFiles: SelectedFileProps[]) => void;
  onProgress: { [key: string]: number };
}

const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  title,
  onClose,
  info,
  isMultiple,
  maxFiles,
  maxFileSize,
  allowedFormats,
  onChange,
  onSave,
  onProgress,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileProps[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (onProgress) {
      setSelectedFiles((prevFiles) =>
        prevFiles.map((file) => ({
          ...file,
          progress: onProgress[file.name] !== undefined ? onProgress[file.name] : file.progress,
        })),
      );
    }
  }, [onProgress]);

  const clearAll = () => {
    setError('');
    setSelectedFiles([]);
    setIsUploading(false);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''; // Clear the input value
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length === 0) {
      setError('No file selected');
      setSelectedFiles([]);
      onChange?.(e);
      return;
    }

    // Validate maxFiles
    if (maxFiles && files.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} files.`);
      setSelectedFiles([]);
      onChange?.(e);
      return;
    }

    // Validate file size and allowed formats
    const invalidFiles: { file: File; error: string }[] = [];
    for (const file of Array.from(files)) {
      if (maxFileSize && file.size > maxFileSize) {
        invalidFiles.push({ file, error: 'This file is too big. Please upload a smaller file.' });
      }
      if (allowedFormats && !allowedFormats.includes(file.type)) {
        invalidFiles.push({ file, error: `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}.` });
      }
    }

    if (invalidFiles.length > 0) {
      setError('');
      setSelectedFiles(
        Array.from(files).map((file) => {
          const invalidFile = invalidFiles.find((f) => f.file.name === file.name);
          return {
            name: file.name,
            status: 'selected',
            progress: 0,
            size: file.size,
            file,
            error: invalidFile?.error,
          };
        }),
      );
      onChange?.(e);
      return;
    }

    setError('');
    setSelectedFiles(
      Array.from(files).map((file) => ({
        name: file.name,
        status: 'selected',
        progress: 0,
        size: file.size,
        file,
      })),
    );
    onChange?.(e); // Call the provided onChange handler
  };

  const handleUpload = () => {
    const filesWithErrors = selectedFiles.filter((file) => file.error);

    if (filesWithErrors.length > 0) {
      setSelectedFiles((prevFiles) =>
        prevFiles.map((file) => {
          const fileWithError = filesWithErrors.find((f) => f.name === file.name);
          return fileWithError || file;
        }),
      );
    } else {
      setIsUploading(true);
      onSave?.(selectedFiles);
      // setSelectedFiles((prevFiles) => prevFiles.map((file) => ({ ...file, status: 'uploaded', progress: 100 })));
    }
  };

  return (
    <Modal
      panelClass="w-full md:w-[592px]"
      show={visible}
      titleClass="text-primary-navy text-xl"
      onClose={() => {
        clearAll();
        onClose?.();
      }}
    >
      <div className="flex flex-col gap-2 w-full md:w-[592px] font-calibri non-italic pr-3">
        <div className="text-primary text-xl font-bold">{title}</div>
        <div className="text-secondary w-full md:w-[533px] text-[15px] font-normal">{info}</div>
        <div
          className="h-[200px] w-full md:w-[535px] bg-[#D9D9D9] flex flex-col justify-center items-center cursor-pointer relative"
          onClick={() => hiddenFileInput.current?.click()}
          id="image"
          data-testid="image"
        >
          <Icon iconName={'upload-to-cloud'} variant="7xl" />
          <p className="text-secondary max-w-[222px] text-[15px] text-center font-normal mt-2">
            <span className=" font-bold text-primary">Browse computer</span> or drag and drop (Max File Size:{' '}
            {fileSizeFormatter(maxFileSize)})
          </p>
          <input
            data-testid="hidden-input"
            type="file"
            ref={hiddenFileInput}
            className="hidden"
            accept={allowedFormats.join(',') || '*'}
            multiple={isMultiple}
            onChange={handleFileInput}
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <div className="grid grid-cols-1 gap-4 mt-3 max-h-60 overflow-y-auto border-black">
          {selectedFiles.map((file, index) => (
            <FileCard
              key={index}
              file={file}
              index={index}
              onDelete={(idx) => setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
        <div className="flex w-full md:w-[535px] items-center justify-end gap-6 mt-5">
          <Button
            className="w-[132px]"
            variant="secondary"
            onClick={() => {
              clearAll();
              onClose?.();
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-[132px]"
            disabled={selectedFiles?.length === 0 || selectedFiles.some((file) => file.error) || isUploading}
            onClick={handleUpload}
          >
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
