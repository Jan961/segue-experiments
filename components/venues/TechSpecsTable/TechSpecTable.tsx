import { attachmentsColDefs } from './tableConfig';
import { ConfirmationDialog, Table, UploadModal } from '../../core-ui-lib';
import Button from '../../core-ui-lib/Button';
import { techSpecsFileFormats } from '../techSpecsFileFormats';
import { UploadedFile } from '../../core-ui-lib/UploadModal/interface';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { isNullOrEmpty } from 'utils';

interface TechSpecTableProps {
  venueId: number;
  setFilesToSend: (params: any) => void;
}

export const TechSpecTable = ({ venueId, setFilesToSend }: TechSpecTableProps) => {
  const [uploadVisible, setUploadVisible] = useState<boolean>(null);
  const [fileWidgets, setFileWidgets] = useState<UploadedFile[]>([]);
  const [rowData, setRowData] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
  const [filesToUpload, setFilesToUpload] = useState<UploadedFile[]>([]);
  const [fileToDelete, setFileToDelete] = useState<UploadedFile>(null);
  const fetchFileList = async () => {
    const fileList: any[] = (await axios.post('/api/venue/techSpecs/list', { VenueId: venueId })).data;
    setFileWidgets([]);
    setRowData([...filesToUpload, ...fileList]);
  };

  useEffect(() => {
    if (venueId && confirmVisible === false && uploadVisible !== true) {
      fetchFileList();
    }
  }, [confirmVisible]);

  const onSave = (files) => {
    console.log('sss');
    console.log(files);

    let maxFileId = 0;
    filesToUpload.forEach((file) => {
      if (file?.fileId > maxFileId && isNullOrEmpty(file?.imageUrl)) maxFileId = file.fileId;
    });

    const newRowData = files.map((file) => {
      return { ...file, fileId: maxFileId++ };
    });
    console.log(newRowData);
    setRowData((prevRowData) => [...newRowData, ...prevRowData]);
    setFilesToUpload((prevFilesList) => [...newRowData, ...prevFilesList]);
    setFilesToSend((prevFilesList) => [...newRowData, ...prevFilesList]);
    setUploadVisible(false);
  };
  const onChange = (params) => {
    console.log(params);
  };
  const onDelete = async () => {
    if (isNullOrEmpty(fileToDelete?.imageUrl)) {
      setFilesToSend((prevFilesList) => prevFilesList.filter((file) => file.fileId !== fileToDelete.fileId));
      setFilesToUpload((prevFilesList) => prevFilesList.filter((file) => file.fileId !== fileToDelete.fileId));
    } else {
      await axios.post('/api/venue/techSpecs/delete', { fileId: fileToDelete.fileId });
    }

    setFileToDelete(null);
    setConfirmVisible(false);
  };
  const handleCellClick = async (params) => {
    console.log(params);
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
          value={fileWidgets}
          isMultiple={true}
          maxFiles={30}
          maxFileSize={15360 * 1024}
          onChange={onChange}
        />
      )}
      <Button
        testId="upload-venue-tech-spec-btn"
        text={fileWidgets.length > 0 ? 'NEW View/ Edit Tech Specs' : 'NEW Upload Tech Specs'}
        onClick={async () => {
          await fetchFileList();
          setUploadVisible(true);
        }}
      />

      <Table columnDefs={attachmentsColDefs} rowData={rowData} onCellClicked={handleCellClick} />
    </div>
  );
};
