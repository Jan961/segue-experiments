import classNames from 'classnames';
import { IFileData } from 'interfaces';
import React from 'react';
import { newDate } from 'services/dateService';

interface FileUploadProps {
  fileData: IFileData;
  disabled: boolean;
  setFileData: (value: any) => void;
}

const FileUploadButton: React.FC<FileUploadProps> = ({ disabled = false, setFileData }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const fileDT = newDate();
        const fileContent = new Uint8Array(reader.result as ArrayBuffer);
        setFileData({
          description: '',
          originalFilename: file.name,
          fileDT,
          fileContent,
        });
      };
    }
  };

  let baseClass = 'p-2 px-8  text-white rounded-md inline-block';
  if (disabled) baseClass = classNames(baseClass, 'cursor-not-allowed bg-gray-300');
  else baseClass = classNames(baseClass, 'cursor-pointer bg-primary-pink');

  return (
    <>
      <input type="file" id="fileInput" disabled={disabled} onChange={handleFileChange} style={{ display: 'none' }} />
      <label htmlFor="fileInput" className={baseClass}>
        Add Artifact
      </label>
    </>
  );
};

export default FileUploadButton;
