import ImagePreviewModal from './ImagePreviewModal';
import { useState } from 'react';

export default {
  component: ImagePreviewModal,
};

const Template = (args) => {
  const [isClosed, setIsClosed] = useState<boolean>(true);

  const handleModalClose = () => {
    setIsClosed(!isClosed);
  };

  return (
    <div className="p-4">
      <ImagePreviewModal show={isClosed} onClose={handleModalClose} imageUrl={args.srcUrl} altText={args.alt} />
    </div>
  );
};

export const DefaultImage = Template.bind({});
DefaultImage.args = {
  srcUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg', // Replace with your image URL or path
  alt: 'Default Image',
};
