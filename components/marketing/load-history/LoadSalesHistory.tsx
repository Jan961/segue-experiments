import LoadSalesHistoryFilters from './LoadSalesHistoryFilters';
import { Button, UploadModal, Table } from 'components/core-ui-lib';
import { loadSalesHistoryColDefs, styleProps } from '../table/tableConfig';
import { useState } from 'react';
import { uploadFile } from 'requests/upload';
import { getFileUrl } from 'lib/s3';
import { attachmentMimeTypes } from 'components/core-ui-lib/UploadModal/interface';
import { isNullOrEmpty } from 'utils';
import { validateSpreadsheetFile } from '../utils';
// import axios from 'axios';
// import { useRecoilValue } from 'recoil';
// import { productionJumpState } from 'state/booking/productionJumpState';

const LoadSalesHistory = () => {
  const [uploadSalesVisible, setUploadSalesVisible] = useState(false);
  const [salesHistoryRows, setSalesHistoryRows] = useState([]);
  // const [uploadedFile, setUploadedFile] = useState();

  // const productionJump = useRecoilValue(productionJumpState);

  //   const onUploadSuccess = async ({ fileId }) => {
  //     try {
  //       await axios.post('/api/admin/accountDetails/accountLogo/update', { fileId });
  //     } catch (error) {
  //       console.log(error, 'Failed to update database with file.');
  //     }
  //   };

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    file = await validateSpreadsheetFile(file);
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
        // onUploadSuccess({ fileId: response.id });
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
    </div>
  );
};

export default LoadSalesHistory;
