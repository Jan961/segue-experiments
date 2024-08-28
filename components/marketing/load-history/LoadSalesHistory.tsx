import LoadSalesHistoryFilters from './LoadSalesHistoryFilters';
import { Button, UploadModal, Table } from 'components/core-ui-lib';
import { loadSalesHistoryColDefs, styleProps } from '../table/tableConfig';
import { useState } from 'react';
import { uploadFile } from 'requests/upload';
import { getFileUrl } from 'lib/s3';
import { attachmentMimeTypes } from 'components/core-ui-lib/UploadModal/interface';
import { isNullOrEmpty } from 'utils';
import SpreadsheetUploadModal from './SpreadsheetUploadModal';

const LoadSalesHistory = () => {
  const [uploadSalesVisible, setUploadSalesVisible] = useState(false);
  const [salesHistoryRows, setSalesHistoryRows] = useState([]);

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    handleUpload(file, onProgress, onError, onUploadingImage);
  };

  const handleUpload = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `marketing/salesHistory`);

    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage);
      if (response.status >= 400 && response.status < 600) {
        onError(file[0].file, 'Error uploading file. Please try again.');
      } else {
        const newFile = {
          name: response.originalFilename,
          dateUploaded: response.uploadDateTime,
          fileURL: getFileUrl(response.location),
        };

        setSalesHistoryRows([...salesHistoryRows, newFile]);
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
    }
  };

  const handleCellClick = async (params) => {
    const column = params.column.colId;
    if (column === 'ViewBtn') {
      if (isNullOrEmpty(params.data?.fileURL)) {
        window.open(URL.createObjectURL(params.data.file), '_blank');
      } else {
        window.open(params.data.fileURL, '_blank');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <LoadSalesHistoryFilters />
        <div className="flex gap-x-3">
          <Button text="Download Template" className="w-[155px]" />
          <Button text="Upload Template" className="w-[155px]" onClick={() => setUploadSalesVisible(true)} />
        </div>
      </div>
      <Table
        columnDefs={loadSalesHistoryColDefs}
        rowData={salesHistoryRows}
        styleProps={styleProps}
        onCellClicked={handleCellClick}
      />
      {uploadSalesVisible && (
        <UploadModal
          title="Upload Template"
          visible={uploadSalesVisible}
          info=""
          allowedFormats={attachmentMimeTypes.spreadsheetAttachment}
          onClose={() => {
            setUploadSalesVisible(false);
          }}
          onSave={onSave}
        />
      )}
      <SpreadsheetUploadModal />
    </div>
  );
};

export default LoadSalesHistory;
