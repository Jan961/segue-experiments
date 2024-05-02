import React, { useMemo, useRef, useState } from 'react';
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
  allowedFormats: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave?: () => void;
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
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [selectedImages, setSelectedImages] = useState<(string | null)[]>([]);

  const isImage = useMemo(() => {
    return ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(allowedFormats[0]);
  }, [allowedFormats]);

  const clearAll = () => {
    setError('');
    setSelectedImages([]);
    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = ''; // Clear the input value
    }
  };

  const handleError = (errorText = '', e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorText !== '') {
      setError(errorText);
    }
    setSelectedImages([]);
    onChange?.(e);
  };

  const renderInfo = () => {
    const noOfImages = selectedImages?.length;
    if (noOfImages === 1) {
      return (
        <>
          <p>You have uploaded the following image.</p>
          <p className="pt-2">Do you wish to save this image?</p>
        </>
      );
    } else if (noOfImages > 1) {
      return (
        <>
          <p>You have uploaded the {noOfImages} images.</p>

          <p className="pt-2">Do you wish to save these images?</p>
        </>
      );
    } else {
      return info;
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length === 0) {
      handleError('No file selected', e);
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
    if (isImage) {
      setSelectedImages(Array.from(files).map((file) => URL.createObjectURL(file)));
    }
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
          <div className="text-secondary text-sm font-normal">
            {/* {info} */}
            {renderInfo()}
          </div>
        </div>
        <div className="flex-col w-[300px]">
          <input
            data-testid="hidden-input"
            type="file"
            ref={hiddenFileInput}
            className="hidden"
            accept={allowedFormats.join(',') || '*'}
            multiple={isMultiple}
            onChange={handleFileInput}
          />
          {selectedImages?.length > 0 && isImage && (
            <div
              className={`grid grid-cols-${selectedImages.length === 1 ? 1 : 2} gap-2 h-[200px]`}
              onClick={() => hiddenFileInput.current?.click()}
              id="image"
              data-testid="image"
            >
              {selectedImages.map((image, index) => (
                <div
                  key={index}
                  className="bg-gray-300 flex justify-center items-center"
                  style={{
                    backgroundImage: image ? `url(${image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                 />
              ))}
            </div>
          )}
          {!(selectedImages?.length > 0) && (
            <div
              className="h-[200px] bg-gray-300 flex justify-center items-center cursor-pointer relative"
              onClick={() => hiddenFileInput.current?.click()}
              id="image"
              data-testid="image"
            >
              {error ? (
                <p className="text-lg text-center text-red-500 font-semibold px-5">{error}</p>
              ) : isImage ? (
                <Icon iconName={'camera-solid'} fill="#FFF" variant="7xl" />
              ) : (
                <Icon iconName={'document-solid'} fill="#FFF" variant="7xl" />
              )}
            </div>
          )}

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
            {selectedImages?.length === 0 ? (
              <Button className="w-[132px]" onClick={() => hiddenFileInput.current?.click()}>
                Upload Image
              </Button>
            ) : (
              <Button className="w-[132px]" onClick={() => onSave()}>
                Save
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;
