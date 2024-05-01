import React, { useRef, useState } from 'react';
import Modal from 'components/core-ui-lib/PopupModal';
import Button from 'components/core-ui-lib/Button';
import Icon from 'components/core-ui-lib/Icon';

interface UploadModalProps {
  title: string;
  visible: boolean;
  onClose?: () => void;
  info: string;
  isMultiple?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  allowedFormats?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const clearAll = () => {
    setError('');
    setSelectedImage(null);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''; // Clear the input value
    }
  };

  const handleError = (errorText = '', e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorText !== '') {
      setError(errorText);
    }
    setSelectedImage(null);
    onChange?.(e);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length === 0) {
      handleError('', e);
      return;
    }

    // Validate maxFiles
    if (maxFiles && files.length > maxFiles) {
      handleError(`You can upload up to ${maxFiles} files.`, e);
      return;
    }

    // Validate file size
    if (maxFileSize) {
      for (const file of files) {
        const fileSize = file.size;
        if (fileSize > maxFileSize) {
          handleError('This image is too big. Please upload a smaller image.', e);
          hiddenFileInput.current.value = '';
          return;
        }
      }
    }

    // Validate allowed formats
    if (allowedFormats) {
      for (const file of files) {
        if (!allowedFormats.includes(file.type)) {
          hiddenFileInput.current.value = '';
          handleError(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}.`, e);
          return;
        }
      }
    }

    setError('');
    setSelectedImage(URL.createObjectURL(files[0]));
    onChange?.(e); // Call the provided onChange handler
  };

  return (
    <Modal
      panelClass="!px-5 !pr-6 !py-6 w-[600px]"
      show={visible}
      titleClass="text-primary-navy text-xl"
      onClose={() => {
        clearAll();
        onClose?.();
      }}
    >
      <div className="flex gap-6 font-calibri non-italic pr-3">
        <div className="flex-col gap-2 grow">
          <div className="text-primary text-xl font-bold">{title}</div>
          <div className="text-secondary text-sm font-normal">{info}</div>
        </div>
        <div className="flex-col w-[300px]">
          <div
            className="h-[200px] bg-gray-300 flex justify-center items-center cursor-pointer relative"
            onClick={() => hiddenFileInput.current?.click()}
            id="image"
            style={
              selectedImage
                ? { backgroundImage: `url(${selectedImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                : {}
            }
          >
            <input
              type="file"
              ref={hiddenFileInput}
              className="hidden"
              accept={allowedFormats.join(',') || '*'}
              multiple={isMultiple}
              onChange={handleFileInput}
            />
            {error ? (
              <p className="text-lg text-center text-red-500 font-semibold px-5">{error}</p>
            ) : (
              !selectedImage && <Icon iconName={'camera-solid'} fill="#FFF" variant="7xl" />
            )}
          </div>
          <div className="flex items-center justify-center gap-6 mt-5">
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
            <Button className="w-[132px]" onClick={() => hiddenFileInput.current.click()}>
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
