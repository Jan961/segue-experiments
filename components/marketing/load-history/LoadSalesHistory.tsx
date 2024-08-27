import LoadSalesHistoryFilters from './LoadSalesHistoryFilters';
import { Button, UploadModal, Table } from 'components/core-ui-lib';
import { loadSalesHistoryColDefs, styleProps } from '../table/tableConfig';
import { useState } from 'react';

const LoadSalesHistory = () => {
  const [uploadSalesVisible, setUploadSalesVisible] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <LoadSalesHistoryFilters />
        <div className="flex gap-x-3">
          <Button text="Download Template" className="w-[155px]" />
          <Button text="Upload Template" className="w-[155px]" onClick={() => setUploadSalesVisible(true)} />
        </div>
      </div>
      <Table columnDefs={loadSalesHistoryColDefs} rowData={[]} styleProps={styleProps} />
      <UploadModal
        title="Upload Template"
        visible={uploadSalesVisible}
        info=""
        allowedFormats={[]}
        onClose={() => {
          setUploadSalesVisible(false);
        }}
      />
    </div>
  );
};

export default LoadSalesHistory;
