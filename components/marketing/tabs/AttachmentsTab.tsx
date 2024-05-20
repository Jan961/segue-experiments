import axios from 'axios';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { useEffect, useState } from 'react';
import useAxios from 'hooks/useAxios';
import { attachmentsColDefs, styleProps } from '../table/tableConfig';
import UploadModal from 'components/core-ui-lib/UploadModal';
import ConfirmationDialog from 'components/core-ui-lib/ConfirmationDialog';

interface AttachmentsTabProps {
  bookingId: string;
}

export default function AttachmentsTab({ bookingId }: AttachmentsTabProps) {
  const { fetchData } = useAxios();

  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [venueAttachRows, setVenueAttachRows] = useState([]);
  const [prodAttachRows, setProdAttachRows] = useState([]);
  const [attachType, setAttachType] = useState<string>('');
  const [attachRow, setAttachRow] = useState(null);
  const [attachIndex, setAttachIndex] = useState(-1);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const onSave = async (file, onProgress, onError) => {
    const formData = new FormData();
    formData.append('file', file[0].file);
    formData.append('path', 'marketing/');

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
        FileBookingBookingId: parseInt(bookingId),
        FileDateTime: new Date(),
        FileDescription: attachType,
        FileOriginalFilename: response.data.originalFilename,
        FileUrl: 'https://d1e9vbizioozy0.cloudfront.net/' + response.data.location,
        FileUploadedDateTime: new Date(),
      };

      // update in the database
      await fetchData({
        url: '/api/marketing/attachments/create',
        method: 'POST',
        data: fileRec,
      });

      // append to table to prevent the need for an API call to get new data
      if (attachType === 'Production') {
        setProdAttachRows([...prodAttachRows, fileRec]);
      } else if (attachType === 'Venue') {
        setVenueAttachRows([...venueAttachRows, fileRec]);
      }
    } catch (error) {
      onError(file[0].file, 'Error uploading file. Please try again.');
      clearInterval(slowProgressInterval);
    }
  };

  const getAttachments = async (bookingId) => {
    try {
      const data = await fetchData({
        url: '/api/marketing/attachments/' + bookingId,
        method: 'POST',
      });

      if (Array.isArray(data)) {
        if ('error' in data) {
          return;
        }

        const venueAttach = data.filter((attach) => attach.FileDescription === 'Venue');
        const prodAttach = data.filter((attach) => attach.FileDescription === 'Production');

        setVenueAttachRows(venueAttach);
        setProdAttachRows(prodAttach);
      }
    } catch (error) {
      console.log(error);
      setVenueAttachRows([]);
    }
  };

  const toggleUploadModal = (type) => {
    setAttachType(type);
    setShowUploadModal(true);
  };

  const handleCellClicked = (event) => {
    if (event.column.colId === 'ViewBtn') {
      const fileUrl = event.data.FileUrl;
      window.open(fileUrl, '_blank');
    } else if (event.column.colId === 'icons') {
      setAttachRow(event.data);
      setAttachIndex(event.rowIndex);
      setShowConfirm(true);
    }
  };

  const deleteAttachment = async (data, rowIndex) => {
    await fetchData({
      url: '/api/marketing/attachments/delete',
      method: 'POST',
      data,
    });

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
  };

  const handleCellValueChange = async (event) => {
    await fetchData({
      url: '/api/marketing/attachments/update',
      method: 'POST',
      data: event.data,
    });
  };

  useEffect(() => {
    getAttachments(bookingId.toString());
  }, [bookingId]);

  return (
    <>
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-xl text-primary-navy font-bold">Venue Attachments</div>
        <Button text="Upload New File" className="w-[160px]" onClick={() => toggleUploadModal('Venue')} />
      </div>

      <div className="mb-5">
        <Table
          columnDefs={attachmentsColDefs}
          rowData={venueAttachRows}
          styleProps={styleProps}
          tableHeight={250}
          onCellClicked={(e) => handleCellClicked(e)}
          onCellValueChange={handleCellValueChange}
        />
      </div>

      <div className="flex flex-row justify-between items-center mb-4">
        <div className="text-xl text-primary-navy font-bold">Production Attachments</div>
        <Button text="Upload New File" className="w-[160px]" onClick={() => toggleUploadModal('Production')} />
      </div>

      <Table
        columnDefs={attachmentsColDefs}
        rowData={prodAttachRows}
        styleProps={styleProps}
        tableHeight={250}
        onCellClicked={(e) => handleCellClicked(e)}
        onCellValueChange={handleCellValueChange}
      />

      <UploadModal
        visible={showUploadModal}
        title={attachType + ' Attachment'}
        info="Please upload your file by dragging it into the grey box below or by clicking the upload cloud."
        allowedFormats={[
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/bmp',
          'image/webp',
          'text/plain',
        ]}
        onClose={() => setShowUploadModal(false)}
        maxFileSize={500 * 1024} // 500kb
        onSave={onSave}
      />

      <ConfirmationDialog
        variant={'delete'}
        show={showConfirm}
        onYesClick={() => deleteAttachment(attachRow, attachIndex)}
        onNoClick={() => setShowConfirm(false)}
        hasOverlay={false}
      />
    </>
  );
}
