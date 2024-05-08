import Icon from 'components/core-ui-lib/Icon';
import ProgressBar from '../ProgressBar';
import Tooltip from '../Tooltip';
import { fileSizeFormatter } from './util';

interface FileProps {
  size: number;
  name: string;
  status: 'selected' | 'uploading' | 'uploaded';
  progress?: number;
  error?: string;
  file: File;
}

interface FileCardProps {
  file: FileProps;
  index: number;
  onDelete: (index: number) => void;
}

const FileCard = ({ file, index, onDelete }: FileCardProps) => {
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="flex w-full md:w-[535px] flex-col items-center justify-between pl-4 py-2 rounded-lg border border-[#D9D9D9] bg-white shadow-md">
      <div className="flex w-full items-center gap-4">
        <Icon iconName={'document-solid'} fill="#617293" variant="3xl" />
        <div id="filedetails" className="flex w-full flex-row items-center">
          <div className="mr-4 w-full">
            <p className="text-primary-navy font-bold text-[15px] flex justify-between items-center">
              {capitalizeFirstLetter(file.status)}
              <span className="float-right relative bottom-1 left-3">
                <Icon
                  iconName={'cross'}
                  fill="#21345B"
                  variant="sm"
                  className="cursor-pointer ml-2"
                  onClick={() => onDelete(index)}
                />
              </span>
            </p>
            <div className="flex flex-row w-full justify-between items-center">
              <div className="float-left">
                <Tooltip title={file.name} position="top" body={file.name.length > 30 ? file.name : ''}>
                  <p className={`text-secondary text-sm`}>
                    {file.name.length > 30 ? file.name.slice(0, 30) + '...' : file.name}
                  </p>
                </Tooltip>
              </div>
              <div className="flex flex-row md:w-[180px] sm:w-[100px] justify-between items-center float-right">
                <p className="text-secondary text-sm">Size: {fileSizeFormatter(file.size)}</p>
                {file.progress !== 0 && <p className="text-secondary text-sm">{file.progress}%</p>}
              </div>
            </div>
            {file.progress !== 0 && <ProgressBar progress={file.progress} />}
            {file.error && <p className="text-red-500 text-sm">{file.error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
