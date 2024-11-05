import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, contractsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractsFilterState } from 'state/contracts/contractsFilterState';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../../bookings/utils';
import { ContractTableRowType } from 'interfaces';
import EditVenueContractModal from '../modal/EditVenueContractModal';
import { addEditContractsState } from '../../../state/contracts/contractsState';
import { RowDoubleClickedEvent } from 'ag-grid-community';
import { accessVenueContracts } from 'state/account/selectors/permissionSelector';

interface ContractsTableProps {
  rowData?: ContractTableRowType;
}

export default function ContractsTable({ rowData }: ContractsTableProps) {
  const permissions = useRecoilValue(accessVenueContracts);
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const [editContractData, setEditContractData] = useRecoilState(addEditContractsState);
  const [rows, setRows] = useState([]);
  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.status === 'U' ? { fontStyle: 'italic' } : '';
    },
    getRowNodeId: (data) => {
      return data.id;
    },
    onRowDataUpdated: (params) => {
      params.api.forEachNode((rowNode) => {
        rowNode.id = rowNode.data.date;
      });
    },
  };

  useEffect(() => {
    if (tableRef && tableRef.current && filter?.scrollToDate) {
      const rowIndex = rowData.findIndex(({ date }) => date === filter.scrollToDate);
      if (rowIndex !== -1) {
        tableRef.current?.getApi().ensureIndexVisible(rowIndex, 'middle');
        setFilter({ ...filter, scrollToDate: '' });
      }
    }
  }, [filter, setFilter, rowData]);

  useEffect(() => {
    if (rowData) {
      let formattedRows = formatRowsForPencilledBookings(rowData);
      formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);

      setRows(formattedRows);
    }
  }, [rowData]);

  const handleRowDoubleClicked = (e: RowDoubleClickedEvent) => {
    if (e.data.dayType === 'Performance') {
      setEditContractData({
        visible: !!permissions.includes('ACCESS_DEAL_MEMO_AND_CONTRACT_OVERVIEW'),
        contract: e.data,
      });
    }
  };

  const handleClose = () => {
    setEditContractData({
      visible: false,
    });
  };

  return (
    <>
      <div className="w-full h-[calc(100%-140px)]" data-testid="venue-contracts-table">
        <Table
          columnDefs={contractsColumnDefs}
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
