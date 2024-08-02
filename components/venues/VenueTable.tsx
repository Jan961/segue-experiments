import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';
import { Venue } from 'interfaces';
import { UiTransformedVenue } from 'utils/venue';
type Props = {
  items?: Venue[];
  onSelectVenue: (venue: UiTransformedVenue) => void;
};

const gridOptions = {
  getRowNodeId: (data) => {
    return data.venueCode;
  },
  onRowDataUpdated: (params) => {
    params.api.forEachNode((rowNode) => {
      rowNode.id = rowNode.data.venueCode;
    });
  },
};

const VenueTable = ({ items, onSelectVenue }: Props) => {
  const handleCellClick = (e: { data: UiTransformedVenue }) => {
    onSelectVenue(e.data);
  };

  return (
    <div className="w-full h-[calc(100%-140px)] min-h-[150px]">
      <Table
        testId="venue-table"
        onCellClicked={handleCellClick}
        columnDefs={items === null ? null : venueColumnDefs}
        rowData={items}
        styleProps={styleProps}
        gridOptions={gridOptions}
      />
    </div>
  );
};

export default VenueTable;
