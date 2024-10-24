import axios from 'axios';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { attachmentsColDefs, styleProps } from '../table/tableConfig';
import UploadModal from 'components/core-ui-lib/UploadModal';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';
import { Spinner } from 'components/global/Spinner';
import { attachmentMimeTypes } from 'components/core-ui-lib/UploadModal/interface';

interface AttachmentsTabProps {
  bookingId: string;
}

export interface AttachmentsTabRef {
  resetData: () => void;
}

const AttachmentsTab = forwardRef<AttachmentsTabRef, AttachmentsTabProps>((props, ref) => {
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [venueAttachRows, setVenueAttachRows] = useState([]);
  const [prodAttachRows, setProdAttachRows] = useState([]);
  const [attachType, setAttachType] = useState<string>('');
  const [attachRow, setAttachRow] = useState(null);
  const [attachIndex, setAttachIndex] = useState(-1);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [bookingIdVal, setBookingIdVal] = useState(null);
  const [dataAvailable, setDataAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useImperativeHandle(ref, () => ({
    resetData: () => {
      setDataAvailable(false);
    },
  }));

  const onSave = async (file, onProgress, onError) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', 'marketing');

    let progress = 0; // to track overall progress
    let slowProgressInterval; // interval for slow progress simulation

    try {
      const response = await axios.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (percentCompleted <= 50) {
            progress = percentCompleted;
          } else if (percentCompleted === 100) {
            progress = 50;
            clearInterval(slowProgressInterval);
            slowProgressInterval = setInterval(() => {
              if (progress < 95) {
                progress += 0.5;
                onProgress(file[0].file, progress);
              } else {
                clearInterval(slowProgressInterval);
              }
            }, 100);
          }
          onProgress(file[0].file, progress);
        },
      });

      progress = 100;
      onProgress(file[0].file, progress);
      clearInterval(slowProgressInterval);

      const fileRec = {
        BookingFileBookingId: parseInt(bookingIdVal),
        BookingFileDescription: attachType,
        BookingFileFileId: response.data.id,
        BookingFileType: response.data.mediaType,
      };

      // update in the database
      const { data: uploadedFile } = await axios.post('/api/marketing/attachments/create', fileRec);

      // append to table to prevent the need for an API call to get new data
      if (attachType === 'Production') {
        setProdAttachRows([...prodAttachRows, uploadedFile]);
      } else if (attachType === 'Venue') {
        setVenueAttachRows([...venueAttachRows, uploadedFile]);
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
      clearInterval(slowProgressInterval);
    }
  };

  const getAttachments = async (bookingId) => {
    try {
      const response = await axios.get(`/api/marketing/attachments/${bookingId}`);

      if (Array.isArray(response.data)) {
        if ('error' in response.data) {
          return;
        }

        const venueAttach = response.data.filter((attach) => attach.FileDescription === 'Venue');
        const prodAttach = response.data.filter((attach) => attach.FileDescription === 'Production');

        setVenueAttachRows(venueAttach);
        setProdAttachRows(prodAttach);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setVenueAttachRows([]);
      setProdAttachRows([]);
      setIsLoading(false);
    }
  };

  const toggleUploadModal = (type) => {
    setAttachType(type);
    setShowUploadModal(true);
  };

  const handleCellClicked = (event) => {
    if (event.column.colId === 'ViewBtn') {
      const fileUrl = event.data.FileURL;
      window.open(fileUrl, '_blank');
    } else if (event.column.colId === 'icons') {
      setAttachRow(event.data);
      setAttachIndex(event.rowIndex);
      setShowConfirm(true);
    }
  };

  const deleteAttachment = async (data, rowIndex) => {
    try {
      await axios.post('/api/marketing/attachments/delete', data);

      if (data.FileDescription === 'Venue') {
        const newRows = [...venueAttachRows];
        if (rowIndex !== -1) {
          newRows.splice(rowIndex, 1);
        }
        setVenueAttachRows(newRows);
      } else if (data.FileDescription === 'Production') {
        const newRows = [...prodAttachRows];
        if (rowIndex !== -1) {
          newRows.splice(rowIndex, 1);
        }
        setProdAttachRows(newRows);
      }

      setShowConfirm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCellValueChange = async (event) => {
    await axios.post('/api/marketing/attachments/update', event.data);
  };

  useEffect(() => {
    if (props.bookingId !== undefined && props.bookingId !== null) {
      setBookingIdVal(props.bookingId.toString());
      getAttachments(props.bookingId.toString());
      setDataAvailable(true);
    }
  }, [props.bookingId]);

  if (dataAvailable) {
    if (isLoading) {
      return (
        <div className="mt-[150px] text-center">
          <Spinner size="lg" className="mr-3" />
        </div>
      );
    } else {
      return (
        <div>
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="text-xl text-primary-navy font-bold">Venue Attachments</div>
            <Button
              text="Upload New File"
              className="w-[160px]"
              onClick={() => toggleUploadModal('Venue')}
              testId="btnUpdFileByVenue"
            />
          </div>

          <div className="mb-5">
            <Table
              columnDefs={attachmentsColDefs}
              rowData={venueAttachRows}
              styleProps={styleProps}
              tableHeight={250}
              onCellClicked={(e) => handleCellClicked(e)}
              onCellValueChange={handleCellValueChange}
              testId="tableVenueAttach"
            />
          </div>

          <div className="flex flex-row justify-between items-center mb-4">
            <div className="text-xl text-primary-navy font-bold">Production Attachments</div>
            <Button
              text="Upload New File"
              className="w-[160px]"
              onClick={() => toggleUploadModal('Production')}
              testId="btnUpdProdAttach"
            />
          </div>

          <Table
            columnDefs={attachmentsColDefs}
            rowData={prodAttachRows}
            styleProps={styleProps}
            tableHeight={250}
            onCellClicked={(e) => handleCellClicked(e)}
            onCellValueChange={handleCellValueChange}
            testId="tableProdAttach"
          />

          {showUploadModal && (
            <UploadModal
              visible={showUploadModal}
              title={attachType + ' Attachment'}
              info="Please upload your file by dragging it into the grey box below or by clicking the upload cloud."
              allowedFormats={attachmentMimeTypes.genericAttachment}
              onClose={() => setShowUploadModal(false)}
              maxFileSize={5120 * 1024} // 5MB
              onSave={onSave}
            />
          )}

          <ConfirmationDialog
            variant="delete"
            show={showConfirm}
            onYesClick={() => deleteAttachment(attachRow, attachIndex)}
            onNoClick={() => setShowConfirm(false)}
            hasOverlay={false}
            testId="confDialog"
          />
        </div>
      );
    }
  }
});

AttachmentsTab.displayName = 'AttachmentsTab';
export default AttachmentsTab;
