import Icon from 'components/core-ui-lib/Icon';
import ProgressBar from '../ProgressBar';
import { fileSizeFormatter, getStatusFromProgress } from 'utils/index';
import { FileCardProps } from './interface';
import { useCallback, useMemo, useState } from 'react';
import ImagePreviewModal from '../ImagePreviewModal';

const FileCard = ({ fileName, fileSize, onDelete, progress, errorMessage, imageUrl }: FileCardProps) => {
  const status = useMemo(() => getStatusFromProgress(progress), [progress]);
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const toggleImagePreviewModal = useCallback(() => {
    setShowImagePreviewModal((prev) => !prev);
  }, [setShowImagePreviewModal]);

  return (
    <div className="flex w-full md:w-[535px] flex-col justify-between pl-4 rounded-lg border border-silver-gray-100 bg-white shadow-md">
      <div className="flex w-full gap-4 py-2">
        <div className="flex items-center">
          {imageUrl ? (
            <img onClick={toggleImagePreviewModal} className="h-10 w-14 pb-2" src={imageUrl} />
          ) : (
            <Icon iconName="document-solid" fill="#617293" variant="3xl" />
          )}
        </div>
        <div id="filedetails" className="flex w-full flex-row items-center">
          <div className="w-full">
            <p className="text-primary-navy font-bold text-[15px] flex justify-between items-center">{status}</p>
            <div className="flex flex-row w-full justify-between items-center">
              <div className="float-left w-56">
                <p className="text-secondary text-sm truncate">{fileName}</p>
              </div>
              <div className="flex flex-row md:w-[180px] sm:w-[100px] justify-between items-center float-right">
                {fileSize && <p className="text-secondary text-sm">Size: {fileSizeFormatter(fileSize)}</p>}
                {progress > 0 && <p className="text-secondary text-sm">{progress}%</p>}
              </div>
            </div>
            {progress > 0 && <ProgressBar progress={progress} />}
            {errorMessage && <p className="text-primary-red text-sm">{errorMessage}</p>}
          </div>
        </div>
        <div className="relative bottom-1 right-1">
          <Icon
            iconName="cross"
            fill="#21345B"
            variant="sm"
            className="cursor-pointer"
            onClick={() => onDelete()}
            testId="close-icon"
          />
        </div>
      </div>
      {showImagePreviewModal && (
        <ImagePreviewModal show={showImagePreviewModal} onClose={toggleImagePreviewModal} imageUrl={imageUrl} />
      )}
    </div>
  );
};

export default FileCard;
