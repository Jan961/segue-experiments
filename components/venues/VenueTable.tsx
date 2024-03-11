import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';

export default function VenueTable() {
  return (
    <div className="w-full h-[calc(100%-140px)]">
      <Table
        columnDefs={venueColumnDefs}
        //   rowData={rows}
        styleProps={styleProps}
        //   onCellClicked={handleCellClick}
        //   gridOptions={gridOptions}
        //   ref={tableRef}
      />
    </div>
  );
}
