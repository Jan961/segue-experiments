import LoadSalesHistoryFilters from './LoadSalesHistoryFilters';
import { Button, UploadModal, Table, ConfirmationDialog } from 'components/core-ui-lib';
import { loadSalesHistoryColDefs, styleProps } from '../table/tableConfig';
import { useEffect, useState } from 'react';
import { uploadFile } from 'requests/upload';
import { getFileUrl } from 'lib/s3';
import { attachmentMimeTypes, UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { isNullOrEmpty } from 'utils';
import SpreadsheetConfirmationModal from './SpreadsheetConfirmationModal';
import { UploadParamType } from 'interfaces';
import { useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';

const LoadSalesHistory = () => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [salesHistoryRows, setSalesHistoryRows] = useState([]);
  const [uploadParams, setUploadParams] = useState<UploadParamType>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile[]>();
  const { selected } = useRecoilValue(productionJumpState);

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    setConfirmationModalVisible(true);
    setUploadedFile(file);
    setUploadParams({ onProgress, onError, onUploadingImage });
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

  const deleteSalesHistory = () => {
    // delete file from s3
    // delete file from DB
    // remove from table
    setSalesHistoryRows([]);
    setShowConfirmDelete(false);
  };

  const handleCellClick = async (params) => {
    const column = params.column.colId;
    if (column === 'ViewBtn') {
      if (isNullOrEmpty(params.data?.fileURL)) {
        window.open(URL.createObjectURL(params.data.file), '_blank');
      } else {
        window.open(params.data.fileURL, '_blank');
      }
    } else if (column === 'icons') {
      setShowConfirmDelete(true);
    }
  };

  useEffect(() => {
    salesHistoryRows.length >= 1 ? setUploadDisabled(true) : setUploadDisabled(false);
  }, [salesHistoryRows]);

  useEffect(() => {
    !selected ? setUploadDisabled(true) : setUploadDisabled(false);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <LoadSalesHistoryFilters />
        <div className="flex gap-x-3">
          <Button text="Download Template" className="w-[155px]" />
          <Button
            text="Upload Template"
            className="w-[155px]"
            onClick={() => setUploadModalVisible(true)}
            disabled={uploadDisabled}
          />
        </div>
      </div>
      <Table
        columnDefs={loadSalesHistoryColDefs}
        rowData={salesHistoryRows}
        styleProps={styleProps}
        onCellClicked={handleCellClick}
      />
      {uploadModalVisible && (
        <UploadModal
          title="Upload Template"
          visible={uploadModalVisible}
          info="Please upload Sales History information in the form of an Excel (.xlsx) spreadsheet. The format should take on the exact structure of the example spreadsheet provided."
          allowedFormats={attachmentMimeTypes.spreadsheetAttachment}
          onClose={() => {
            setUploadModalVisible(false);
          }}
          onSave={onSave}
        />
      )}
      {confirmationModalVisible && (
        <SpreadsheetConfirmationModal
          visible={confirmationModalVisible}
          onClose={() => setConfirmationModalVisible(false)}
          handleUpload={handleUpload}
          uploadedFile={uploadedFile}
          uploadParams={uploadParams}
        />
      )}
      <ConfirmationDialog
        variant="delete"
        show={showConfirmDelete}
        onNoClick={() => setShowConfirmDelete(false)}
        onYesClick={() => deleteSalesHistory()}
      />
    </div>
  );
};

export default LoadSalesHistory;
