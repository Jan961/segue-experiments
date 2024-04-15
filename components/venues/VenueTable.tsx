import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';
import { Venue } from 'interfaces';
import { UiTransformedVenue } from 'utils/venue';
type Props = {
  items?: Venue[];
  onSelectVenue: (venue: UiTransformedVenue) => void;
};

const VenueTable = ({ items, onSelectVenue }: Props) => {
  const onRowSelected = (e: any) => {
    onSelectVenue(e.data);
  };

  return (
    <div className="w-full h-[calc(100%-140px)] min-h-[150px]">
      <Table
        onRowSelected={onRowSelected}
        columnDefs={items === null ? null : venueColumnDefs}
        rowData={items}
        styleProps={styleProps}
      />
    </div>
  );
};

export default VenueTable;
