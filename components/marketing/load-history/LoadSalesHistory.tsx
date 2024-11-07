import LoadSalesHistoryFilters from './LoadSalesHistoryFilters';
import { Button, UploadModal, Table } from 'components/core-ui-lib';
import { loadSalesHistoryColDefs, styleProps } from '../table/tableConfig';
import { useEffect, useState } from 'react';
import { uploadFile } from 'requests/upload';
import { getFileUrl } from 'lib/s3';
import { attachmentMimeTypes, UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { isNullOrEmpty } from 'utils';
import SpreadsheetConfirmationModal from './SpreadsheetConfirmationModal';
import { UploadParamType } from 'types/SpreadsheetValidationTypes';
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
  const prodShowCode = selectedProducton ? selectedProducton.ShowCode + selectedProducton.Code : null;
  const venueList = useRecoilValue(venueState);
  const dateRange = selectedProducton
    ? dateToSimple(selectedProducton.StartDate) + '-' + dateToSimple(selectedProducton.EndDate)
    : null;

  const fetchSpreadsheet = async () => {
    if (!selected) {
      return;
    }
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
    try {
      const {
        file: validateFile,
        spreadsheetIssues,
        spreadsheetData,
      } = await validateSpreadsheetFile(file, prodShowCode, venueList, dateRange);
      setUploadedFile(validateFile);
      setUploadParams({ onProgress, onError, onUploadingImage, spreadsheetIssues, spreadsheetData });
      setConfirmationModalVisible(true);
    } catch (err) {
      console.error(err, 'An error occured when trying to validate the spreadsheet data');
    }
  };

  const handleUpload = async (file, spreadsheetData, onProgress, onError, onUploadingImage) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', `marketing/salesHistory`);

    try {
      const fileCreateResponse = await uploadFile(formData, onProgress, onError, onUploadingImage, {
        onSuccess: 'Spreadsheet uploaded successfully',
        onFailure: 'Spreadsheet failed to upload',
      });
      if (fileCreateResponse.status >= 400 && fileCreateResponse.status < 600) {
        throw new Error('Failed to upload Spreadsheet File to S3');
      }

      const fileID = fileCreateResponse.id;
      const DBUpdateResponse = await axios.post('/api/marketing/load-history/create', {
        spreadsheetData,
        selectedProdId: selected,
        fileID,
      });
      // if there is an error when updating the DB, delete the file
      if (DBUpdateResponse.status !== 200) {
        try {
          await axios.delete(`/api/file/delete?location=${fileCreateResponse.location}`);
        } catch (error) {
          console.error(error, 'Failed to delete file from S3 after DB operations failed.');
        }
      }

      const newFile = {
        name: fileCreateResponse.originalFilename,
        dateUploaded: fileCreateResponse.uploadDateTime,
        fileURL: getFileUrl(fileCreateResponse.location),
        fileId: fileCreateResponse.id,
        location: fileCreateResponse.location,
      };
      setSalesHistoryRows([newFile]);
    } catch (error) {
      console.error(error, 'Error attempting to modify Sales History Data');
    }
  };

  const deleteSalesHistory = async () => {
    if (salesHistoryRows) {
      const file = salesHistoryRows[0];
      try {
        await axios.delete(`/api/file/delete?location=${file.location}`);
        await axios.post('/api/marketing/load-history/delete-sales', { productionID: selected });
        setSalesHistoryRows([]);
        setUploadedFile(null);
        setShowConfirmDelete(false);
      } catch (err) {
        console.log(err, 'Failed to delete Sales History Spreadsheet');
      }
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
    } else if (column === 'icons') {
      setShowConfirmDelete(true);
    }
  };

  const downloadInstructions = () => {
    window.open(getFileUrl('marketing/salesHistory/instructions/Sales_History_Upload_Instructions.pdf'), '_blank');
  };

  const downloadExample = () => {
    const a = document.createElement('a');
    a.href = getFileUrl('marketing/salesHistory/exampleTemplate/ExampleTemplate_v2.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (salesHistoryRows.length >= 1) {
      setUploadDisabled(true);
    } else {
      if (!selectedProducton?.IsArchived) {
        setUploadDisabled(true);
      } else {
        setUploadDisabled(false);
      }
    }
  }, [salesHistoryRows]);

  useEffect(() => {
    if (!selectedProducton?.IsArchived) {
      setUploadDisabled(true);
    }
    setSalesHistoryRows([]);
    fetchSpreadsheet();
  }, [selectedProducton]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <LoadSalesHistoryFilters />

        <div className="">
          {!selectedProducton ? (
            <div className="text-gray-600 text-sm mb-1"> Please select a production to continue </div>
          ) : uploadDisabled ? (
            <div className="text-gray-600 text-sm mb-1">
              {' '}
              A file has already been uploaded for this production. Please delete the previous upload to continue{' '}
            </div>
          ) : (
            <div className="text-gray-600 text-sm mb-1"> No Sales History has been added for this Production </div>
          )}

          <div className="flex gap-x-3 place-content-end">
            <Button text="Instructions" className="w-[155px]" onClick={downloadInstructions} />
            <Button text="Download Template" className="w-[155px]" onClick={downloadExample} />
            <Button
              text="Upload Spreadsheet"
              className="w-[155px]"
              onClick={() => setUploadModalVisible(true)}
              disabled={uploadDisabled}
            />
          </div>
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
          handleUpload={() =>
            handleUpload(
              uploadedFile,
              uploadParams.spreadsheetData,
              uploadParams.onProgress,
              uploadParams.onError,
              uploadParams.onUploadingImage,
            )
          }
          uploadParams={uploadParams}
          uploadedFile={uploadedFile}
          closeUploadModal={() => setUploadModalVisible(false)}
          prodShowCode={prodShowCode}
        />
      )}
      {showConfirmDelete && (
        <SpreadsheetDeleteModal
          visible={showConfirmDelete}
          onNoClick={() => setShowConfirmDelete(false)}
          onDeleteClick={deleteSalesHistory}
          salesHistoryRows={salesHistoryRows}
        />
      )}
    </div>
  );
};

export default LoadSalesHistory;
