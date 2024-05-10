import React, { useEffect, useRef, useState } from 'react';
import Modal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import FileCard from './UploadFileCard';
import { fileSizeFormatter } from 'utils/index';
import { FileProps, UploadModalProps } from './interface';

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
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileProps[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const isUploadDisabled =
    selectedFiles?.length === 0 ||
    selectedFiles.some((file) => file.error) ||
    isUploading ||
    Object.keys(errorMessages).length > 0;

  const onProgress = (file: File, uploadProgress: number) => {
    setProgress((prev) => ({ ...prev, [file.name]: uploadProgress }));
  };

  const onError = (file: File, errorMessage: string) => {
    setErrorMessages((prev) => ({ ...prev, [file.name]: errorMessage }));
  };

  useEffect(() => {
    onChange?.(selectedFiles);
  }, [selectedFiles]);

  const clearAll = () => {
    setError('');
    setSelectedFiles([]);
    setIsUploading(false);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = '';
    }
    setProgress({});
    setErrorMessages({});
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length === 0) {
      setError('No file selected');
      setSelectedFiles([]);
      onChange?.([]);
      return;
    }

    if (maxFiles && files.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} files.`);
      setSelectedFiles([]);
      onChange?.([]);
      return;
    }

    for (const file of Array.from(files)) {
      if (maxFileSize && file.size > maxFileSize) {
        errorMessages[file.name] = 'This file is too big. Please upload a smaller file.';
      }
      if (allowedFormats && !allowedFormats.includes(file.type)) {
        errorMessages[file.name] = `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}.`;
      }
    }

    const filesList = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      file,
    }));
    setError('');
    setSelectedFiles(filesList);
    onChange?.(filesList);
  };

  const handleUpload = () => {
    if (Object.keys(errorMessages).length === 0) {
      setIsUploading(true);
      onSave?.(selectedFiles, onProgress, onError);
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
          className="h-[200px] w-full md:w-[535px] bg-silver-gray-100 flex flex-col justify-center items-center cursor-pointer relative"
          onClick={() => hiddenFileInput.current?.click()}
          id="image"
          data-testid="image"
        >
          <Icon iconName={'upload-to-cloud'} variant="7xl" />
          <p className="text-secondary max-w-[222px] text-[15px] text-center font-normal mt-2">
            <span className=" font-bold text-primary">Browse computer</span> or drag and drop
            {maxFileSize && `(Max File Size: ${fileSizeFormatter(maxFileSize)})`}
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
        {error && (
          <div data-testid="error" className="text-primary-red text-sm text-center">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 mt-3 max-h-60 overflow-y-auto">
          {selectedFiles.map((file, index) => (
            <FileCard
              key={index}
              file={file}
              index={index}
              progress={progress[file.name]}
              errorMessage={errorMessages[file.name]}
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
          <Button className="w-[132px]" disabled={isUploadDisabled} onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
