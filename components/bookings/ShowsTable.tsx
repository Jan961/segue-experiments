import { Show } from '@prisma/client';
import Table from 'components/core-ui-lib/Table';
import { bookingShowsTableConfig, styleProps } from './table/tableConfig';
import { useMemo, useRef, useState } from 'react';

const ShowsTable = ({ rowsData }: { rowsData: Show[] }) => {
  const tableRef = useRef(null);
  const [changesMade, setChangesMade] = useState<boolean>(false);
  const gridOptions = {
    getRowId: (params) => {
      return params.data.Id;
    },
  };
  const handleCellClick = () => {
    console.log(changesMade);
  };

  const filteredRows = useMemo(() => {
    return rowsData.sort((a, b) => a.Name.localeCompare(b.Name));
  }, [rowsData]);

  return (
    <Table
      columnDefs={bookingShowsTableConfig}
      ref={tableRef}
      rowData={filteredRows}
      styleProps={styleProps}
      onCellClicked={handleCellClick}
      gridOptions={gridOptions}
      onCellValueChange={() => {
        setChangesMade(true);
      }}
    />
  );
};

export default ShowsTable;
