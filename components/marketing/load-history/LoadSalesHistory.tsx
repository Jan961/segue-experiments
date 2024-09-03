import LoadSalesHistoryFilters from './LoadSalesHistoryFilters';
import { Button, UploadModal, Table } from 'components/core-ui-lib';
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
import { venueState } from 'state/booking/venueState';
import { dateToSimple } from 'services/dateService';
import validateSpreadsheetFile from '../utils/validateSpreadsheet';
import SpreadsheetDeleteModal from './SpreadsheetDeleteModal';
import axios from 'axios';

const LoadSalesHistory = () => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [uploadDisabled, setUploadDisabled] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [salesHistoryRows, setSalesHistoryRows] = useState([]);
  const [uploadParams, setUploadParams] = useState<UploadParamType>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile[]>();

  const { productions, selected } = useRecoilValue(productionJumpState);
  const selectedProducton = productions.filter((prod) => prod.Id === selected)[0];
  const prodCode = selectedProducton ? selectedProducton.ShowCode : null;
  const venueList = useRecoilValue(venueState);
  const dateRange = selectedProducton
    ? dateToSimple(selectedProducton.StartDate) + '-' + dateToSimple(selectedProducton.EndDate)
    : null;

  const onUploadSuccess = async ({ fileId }) => {
    try {
      await axios.post('/api/marketing/load-history/create', { fileId, selected });
    } catch (error) {
      console.log(error, 'Failed to update database with file.');
    }
  };

  const fetchSpreadsheet = async () => {
    console.log('called');
    try {
      const response = await axios.get('/api/marketing/load-history/read', {
        params: { selected },
      });
      if (response.data.ProductionFile) {
        const file = response.data.ProductionFile.File;
        const newFile = {
          name: file.OriginalFilename,
          dateUploaded: file.UploadDateTime,
          fileURL: getFileUrl(file.Location),
          location: file.Location,
          fileId: file.Id,
        };
        setSalesHistoryRows([newFile]);
      } else {
        setSalesHistoryRows([]);
      }
    } catch (error) {
      console.log(error, 'Failed to fetch Sales History Spreadsheet');
    }
  };

  const onSave = async (file, onProgress, onError, onUploadingImage) => {
    const { file: validateFile, spreadsheetIssues } = await validateSpreadsheetFile(
      file,
      prodCode,
      venueList,
      dateRange,
    );
    const spreadsheetErrorOccured = spreadsheetIssues.spreadsheetErrorOccurred;
    const spreadsheetWarningOccured = spreadsheetIssues.spreadsheetWarningOccurred;
    setUploadedFile(validateFile);
    setUploadParams({ onProgress, onError, onUploadingImage, spreadsheetErrorOccured, spreadsheetWarningOccured });
    setConfirmationModalVisible(true);
  };

  const handleUpload = async (file, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `marketing/salesHistory`);

    try {
      const response = await uploadFile(formData, onProgress, onError, onUploadingImage, {
        onSuccess: 'Spreadsheet uploaded successfully',
        onFailure: 'Spreadsheet failed to upload',
      });
      if (response.status >= 400 && response.status < 600) {
        onError(file[0].file, 'Error uploading file. Please try again.');
      } else {
        const newFile = {
          name: response.originalFilename,
          dateUploaded: response.uploadDateTime,
          fileURL: getFileUrl(response.location),
          fileId: response.id,
          location: response.location,
        };
        console.log(newFile.fileURL);
        setSalesHistoryRows([newFile]);
        onUploadSuccess({ fileId: response.id });
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
    }
  };

  const deleteSalesHistory = async () => {
    if (salesHistoryRows) {
      const file = salesHistoryRows[0];
      try {
        await axios.delete(`/api/file/delete?location=${file.location}`);
      } catch (err) {
        console.log(err, 'Failed to delete Sales History Spreadsheet');
      }
    }
    setSalesHistoryRows([]);
    setUploadedFile(null);
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

  const downloadExample = () => {
    const a = document.createElement('a');
    a.href = getFileUrl('marketing/salesHistory/exampleTemplate/Example+Sales+History+Template.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (salesHistoryRows.length >= 1) {
      setUploadDisabled(true);
    } else {
      setUploadDisabled(false);
    }
  }, [salesHistoryRows]);

  useEffect(() => {
    if (!selectedProducton.IsArchived) {
      setUploadDisabled(true);
    }
    fetchSpreadsheet();
  }, [selectedProducton]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <LoadSalesHistoryFilters />
        <div className="flex gap-x-3">
          <Button text="Download Template" className="w-[155px]" onClick={() => downloadExample()} />
          <Button
            text="Upload Spreadsheet"
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
          closeUploadModal={() => setUploadModalVisible(false)}
        />
      )}
      {showConfirmDelete && (
        <SpreadsheetDeleteModal
          visible={showConfirmDelete}
          onNoClick={() => setShowConfirmDelete(false)}
          onDeleteClick={() => deleteSalesHistory()}
          salesHistoryRows={salesHistoryRows}
        />
      )}
    </div>
  );
};

export default LoadSalesHistory;
