import React, { useEffect, useMemo, useRef, useState } from 'react';
import Modal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';
import FileCard from './UploadFileCard';
import { fileSizeFormatter } from 'utils/index';
import { UploadedFile, UploadModalProps } from './interface';

const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  title,
  onClose,
  info,
  isMultiple,
  maxFiles = 1,
  maxFileSize,
  allowedFormats,
  onChange,
  onSave,
  value,
  customHandleFileDelete,
  testId = 'core-ui-lib-upload-model',
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>(() => {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [uploadedImageUrls, setUploadedImageUrls] = useState<Record<string, string>>(() => {
    if (!value) return {};
    return (Array.isArray(value) ? value : [value]).reduce((urlMap, upload) => {
      urlMap[upload.name] = upload.imageUrl;
      return urlMap;
    }, {});
  });

  useEffect(() => {
    if (value) {
      const urls = (Array.isArray(value) ? value : [value]).reduce((urlMap, upload) => {
        urlMap[upload.name] = upload.imageUrl;
        return urlMap;
      }, {});
      setUploadedImageUrls(urls);
      setSelectedFiles(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const isUploadDisabled = useMemo(
    () =>
      selectedFiles?.length === 0 ||
      selectedFiles.some((file) => file?.error) ||
      isUploading ||
      Object.keys(errorMessages).length > 0,
    [selectedFiles, isUploading, errorMessages],
  );

  const isUploadComplete = useMemo(() => {
    // this has return true if selected files is zero to handle deletion case
    if (selectedFiles.length === 0) return true;
    return selectedFiles.every((file) => progress[file?.name] === 100 || file.id);
  }, [selectedFiles, progress]);

  const onProgress = (file: File, uploadProgress: number) => {
    setProgress((prev) => ({ ...prev, [file?.name]: uploadProgress }));
  };

  const onError = (file: File, errorMessage: string) => {
    setErrorMessages((prev) => ({ ...prev, [file?.name]: errorMessage }));
  };

  const onUploadingImage = (file: File, imageUrl: string) => {
    setUploadedImageUrls((prev) => ({ ...prev, [file?.name]: imageUrl }));
  };

  useEffect(() => {
    const fileerrors = Object.fromEntries(
      Object.entries(errorMessages).filter(([filename]) => selectedFiles.some((file) => file?.file?.name === filename)),
    );
    setErrorMessages(fileerrors);
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
    setUploadedImageUrls({});
  };

  const handleFileDelete = (fileName) => {
    const deletedFile = selectedFiles.find((file) => file?.name === fileName);
    if (customHandleFileDelete) {
      customHandleFileDelete(deletedFile);
    }

    const filesList = selectedFiles.filter((file) => file?.name !== fileName);
    setSelectedFiles(filesList);
    onChange?.(filesList);
    const newProgress = { ...progress };
    delete newProgress[fileName];
    setProgress(newProgress);

    const newErrors = { ...errorMessages };
    delete newErrors[fileName];
    setErrorMessages(newErrors);

    const newUploadUrls = { ...uploadedImageUrls };
    delete uploadedImageUrls[fileName];
    setUploadedImageUrls(newUploadUrls);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setIsUploading(false);
    if (!files || files?.length === 0) {
      setError('No file selected');
      setSelectedFiles([]);
      onChange?.([]);
      return;
    }

    if (maxFiles && files.length + selectedFiles.length > maxFiles) {
      setError(maxFiles === 1 ? 'You can upload 1 file' : `You can upload up to ${maxFiles} files.`);
      setSelectedFiles(selectedFiles);
      setIsUploading(false);
      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = '';
      }
      setProgress({});
      setErrorMessages({});
      setUploadedImageUrls(uploadedImageUrls);
      return;
    }

    for (const file of Array.from(files)) {
      if (maxFileSize && file?.size > maxFileSize) {
        errorMessages[file?.name] = 'This file is too big. Please upload a smaller file.';
      }
      if (allowedFormats && !allowedFormats.includes(file?.type)) {
        errorMessages[file?.name] = `Invalid file format. Allowed formats: ${allowedFormats.join(', ')}.`;
      }
    }

    const filesList: UploadedFile[] = Array.from(files).map((file) => ({
      name: file?.name,
      size: file?.size,
      file,
    }));
    setError('');
    setSelectedFiles([...selectedFiles, ...filesList]);
    onChange?.(filesList);
    hiddenFileInput.current.value = '';
  };

  const handleUpload = () => {
    if (isUploadComplete) {
      return onClose();
    }
    if (Object.keys(errorMessages).length === 0) {
      setIsUploading(true);
      onSave?.(selectedFiles, onProgress, onError, onUploadingImage);
    }
  };

  return (
    <Modal
      show={visible}
      onClose={() => {
        clearAll();
        onClose?.();
      }}
      title={title}
    >
      <div className="flex flex-col gap-2 w-full md:w-[562px] font-calibri non-italic">
        <div data-testid={`${testId}-info`} className="text-secondary w-full md:w-[533px] text-[15px] font-normal">
          {info}
        </div>
        <div
          className="h-[200px] w-full md:w-[535px] bg-silver-gray-100 flex flex-col justify-center items-center cursor-pointer relative"
          onClick={() => hiddenFileInput.current?.click()}
          id="image"
          data-testid={`${testId}-upload-image`}
        >
          <Icon iconName="upload-to-cloud" variant="7xl" />
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
          <div data-testid="error" className="text-primary-red text-sm ">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4  max-h-60 overflow-y-auto">
          {selectedFiles?.map((file, index) => (
            <FileCard
              key={index}
              fileName={file?.name}
              fileSize={file?.size}
              progress={progress[file?.name]}
              errorMessage={errorMessages[file?.name]}
              imageUrl={uploadedImageUrls[file?.name]}
              onDelete={() => {
                handleFileDelete(file?.name);
              }}
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
          <Button className="w-[132px]" disabled={isUploadDisabled && !isUploadComplete} onClick={handleUpload}>
            {isUploadComplete ? 'OK' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
