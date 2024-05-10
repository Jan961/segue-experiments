import Icon from 'components/core-ui-lib/Icon';
import ProgressBar from '../ProgressBar';
import Tooltip from '../Tooltip';
import { fileSizeFormatter, getStatusFromProgress } from 'utils/index';
import { FileCardProps } from './interface';
import { useMemo } from 'react';

const FileCard = ({ file, index, onDelete, progress, errorMessage }: FileCardProps) => {
  const status = useMemo(() => getStatusFromProgress(progress), [progress]);

  return (
    <div className="flex w-full md:w-[535px] flex-col justify-between pl-4 rounded-lg border border-primary-border bg-white shadow-md">
      <div className="flex w-full gap-4 py-2">
        <div className="flex items-center">
          <Icon iconName={'document-solid'} fill="#617293" variant="3xl" />
        </div>
        <div id="filedetails" className="flex w-full flex-row items-center">
          <div className="w-full">
            <p className="text-primary-navy font-bold text-[15px] flex justify-between items-center">{status}</p>
            <div className="flex flex-row w-full justify-between items-center">
              <div className="float-left">
                <Tooltip title={file.name} body={file.name.length > 30 ? file.name : ''}>
                  <p className={`text-secondary text-sm`}>
                    {file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}
                  </p>
                </Tooltip>
              </div>
              <div className="flex flex-row md:w-[180px] sm:w-[100px] justify-between items-center float-right">
                <p className="text-secondary text-sm">Size: {fileSizeFormatter(file.size)}</p>
                {progress > 0 && <p className="text-secondary text-sm">{progress}%</p>}
              </div>
            </div>
            {progress > 0 && <ProgressBar progress={progress} />}
            {errorMessage && <p className="text-primary-red text-sm">{errorMessage}</p>}
          </div>
        </div>
        <div className="relative bottom-1 right-1">
          <Icon
            iconName={'cross'}
            fill="#21345B"
            variant="sm"
            className="cursor-pointer"
            onClick={() => onDelete(index)}
          />
        </div>
      </div>
    </div>
  );
};

export default FileCard;
