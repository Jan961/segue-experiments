import { attachmentsColDefs, styleProps } from './tableConfig';
import { ConfirmationDialog, Table, UploadModal } from 'components/core-ui-lib';
import Button from 'components/core-ui-lib/Button';
import { techSpecsFileFormats } from '../techSpecsFileFormats';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { isNullOrEmpty } from 'utils';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';
import { useRecoilValue } from 'recoil';

interface TechSpecTableProps {
  venueId: number;
  setFilesToSend: (params: any) => void;
  setFilesToDelete: (params: any) => void;
  disabled?: boolean;
}

export const TechSpecTable = ({ venueId, setFilesToSend, setFilesToDelete, disabled }: TechSpecTableProps) => {
  const permissions = useRecoilValue(accessBookingsHome);
  const [uploadVisible, setUploadVisible] = useState<boolean>(null);
  const [rowData, setRowData] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [filesToUpload, setFilesToUpload] = useState<UploadedFile[]>([]);
  const [fileToDelete, setFileToDelete] = useState<UploadedFile>(null);
  const fetchFileList = async () => {
    try {
      const fileList: any[] = (await axios.post('/api/venue/techSpecs/list', { VenueId: venueId })).data;
      setRowData([...filesToUpload, ...fileList]);
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    if (venueId && confirmVisible === false && uploadVisible !== true) {
      fetchFileList();
    }
  }, []);

  const onSave = (files) => {
    let maxFileId = 0;
    filesToUpload.forEach((file) => {
      if (file?.fileId > maxFileId && isNullOrEmpty(file?.imageUrl)) maxFileId = file.fileId;
    });
    const newRowData = files.map((file) => {
      return { ...file, fileId: maxFileId++, uploadDateTime: new Date().toISOString() };
    });
    setRowData((prevRowData) => [...newRowData, ...prevRowData]);
    setFilesToUpload((prevFilesList) => [...newRowData, ...prevFilesList]);
    setFilesToSend((prevFilesList) => [...newRowData, ...prevFilesList]);
    setUploadVisible(false);
  };

  const onDelete = async () => {
    const delId = fileToDelete.fileId;
    if (isNullOrEmpty(fileToDelete?.imageUrl)) {
      setFilesToSend((prevFilesList) => prevFilesList.filter((file) => file.fileId !== delId));
      setFilesToUpload((prevFilesList) => prevFilesList.filter((file) => file.fileId !== delId));
      setRowData((prevFilesList) => prevFilesList.filter((file) => file.fileId !== delId));
    } else {
      setRowData((prevRowData) => prevRowData.filter((file) => file.fileId !== delId));
      setFilesToDelete((prevFileList) => [...prevFileList, fileToDelete.fileId]);
    }
    setFileToDelete(null);
    setConfirmVisible(false);
  };
  const handleCellClick = async (params) => {
    const column = params.column.colId;
    if (column === 'ViewBtn') {
      if (isNullOrEmpty(params.data?.imageUrl)) {
        window.open(URL.createObjectURL(params.data.file), '_blank');
      } else {
        window.open(params.data.imageUrl, '_blank');
      }
    } else if (column === 'icons') {
      setFileToDelete(params.data);
      setConfirmVisible(true);
    }
  };
  return (
    <div>
      {confirmVisible && (
        <ConfirmationDialog
          variant="delete"
          show={confirmVisible}
          onNoClick={() => {
            setConfirmVisible(false);
          }}
          onYesClick={onDelete}
        />
      )}
      {uploadVisible && (
        <UploadModal
          title="Upload Tech Specs"
          visible={uploadVisible}
          info="Upload or view this venues tech specs. You can upload a maximum of 30 files each with a maxiumum file size of 15MB."
          allowedFormats={techSpecsFileFormats}
          onClose={() => {
            setUploadVisible(false);
          }}
          onSave={onSave}
          isMultiple={true}
          maxFiles={30}
          maxFileSize={15360 * 1024}
        />
      )}
      <div className="ag-floating-top mb-4 flex justify-end">
        <Button
          testId="upload-venue-tech-spec-btn"
          text="Upload Tech Specs"
          onClick={async () => {
            await fetchFileList();
            setUploadVisible(true);
          }}
          disabled={!permissions.includes('UPLOAD_ATTACHMENTS') || disabled}
        />
      </div>
      {rowData.length > 0 && (
        <Table
          columnDefs={attachmentsColDefs}
          styleProps={styleProps}
          rowData={rowData}
          onCellClicked={handleCellClick}
        />
      )}
    </div>
  );
};
