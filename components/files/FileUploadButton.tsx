import { IFileData } from "interfaces";
import React, { useState } from "react";

interface FileUploadProps {
  fileData: IFileData;
  setFileData: (value: any) => void;
}

const FileUploadButton: React.FC<FileUploadProps> = ({
  fileData,
  setFileData,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const fileDT = new Date();
        const fileContent = new Uint8Array(reader.result as ArrayBuffer);
        setFileData({
          description: "",
          originalFilename: file.name,
          fileDT,
          fileContent,
        });
      };
    }
  };

  return (
    <>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        className="w-auto h-10 text-sm text-white mt-1 ml-4 px-2 border-primary-pink border-2 bg-primary-pink hover:bg-primary-pink hover:text-white rounded-md transition-all duration-200 ease--in-out"
        
        />
      {fileData && <p className="mt-2">Selected file: {fileData.originalFilename}</p>}
        </>
  );
};

export default FileUploadButton;
