import React from 'react';
import PopupModal from '../PopupModal';

export interface ImagePreviewModalProps {
  show: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  show,
  onClose,
  imageUrl,
  altText = 'Image preview',
}) => {
  return (
    <PopupModal
      title=""
      show={show}
      onClose={onClose}
      panelClass="w-screen h-screen bg-transparent"
      closeOnOverlayClick={true}
    >
      <div className="flex justify-center p-4">
        <img data-testid="preview-image" src={imageUrl} alt={altText} className="w-11/12 h-1/2" />
      </div>
    </PopupModal>
  );
};

export default ImagePreviewModal;
