import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, companyContractsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../../bookings/utils';
import { ContractTableRowType } from 'interfaces';
import EditVenueContractModal from '../modal/EditVenueContractModal';
import { addEditContractsState } from '../../../state/contracts/contractsState';
import { RowDoubleClickedEvent } from 'ag-grid-community';

interface ContractsTableProps {
  rowData?: ContractTableRowType[];
}

export default function CompanyContractsTable({ rowData }: ContractsTableProps) {
  const tableRef = useRef(null);
  const [editContractData, setEditContractData] = useRecoilState(addEditContractsState);
  const [rows, setRows] = useState([]);
  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.status === 'U' ? { fontStyle: 'italic' } : '';
    },
  };

  useEffect(() => {
    if (rowData) {
      let formattedRows = formatRowsForPencilledBookings(rowData);
      formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);

      setRows(formattedRows);
    }
  }, [rowData]);

  const handleRowDoubleClicked = (e: RowDoubleClickedEvent) => {
    setEditContractData({
      visible: true,
      contract: e.data,
    });
  };

  const handleClose = () => {
    setEditContractData({
      visible: false,
    });
  };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]">
        <Table
          columnDefs={companyContractsColumnDefs}
          rowData={rows}
          styleProps={contractsStyleProps}
          gridOptions={gridOptions}
          ref={tableRef}
          onRowDoubleClicked={handleRowDoubleClicked}
        />
      </div>
      {editContractData.visible && <EditVenueContractModal {...editContractData} onClose={handleClose} />}
    </>
  );
}
