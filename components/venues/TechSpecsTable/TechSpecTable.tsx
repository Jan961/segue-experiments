import { attachmentsColDefs } from './tableConfig';
import { Table, UploadModal } from '../../core-ui-lib';
import Button from '../../core-ui-lib/Button';
import { techSpecsFileFormats } from '../techSpecsFileFormats';
import { UploadedFile } from '../../core-ui-lib/UploadModal/interface';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface TechSpecTableProps {
  venueId: number;
}

export const TechSpecTable = ({ venueId }: TechSpecTableProps) => {
  const [uploadVisible, setUploadVisible] = useState<boolean>(null);
  const [fileWidgets, setFileWidgets] = useState<UploadedFile[]>([]);
  const [rowData, setRowData] = useState([]);

  const fetchFileList = async () => {
    const fileList: any[] = (await axios.post('/api/venue/techSpecs/list', { VenueId: venueId })).data;
    console.log(fileList);
    setFileWidgets([]);
    setRowData(fileList);
  };

  useEffect(() => {
    if (venueId && uploadVisible !== true) {
      fetchFileList();
    }
  }, [uploadVisible]);

  const onSave = () => {
    console.log('sss');
  };

  return (
    <div>
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

      <Table columnDefs={attachmentsColDefs} rowData={rowData} />
    </div>
  );
};
