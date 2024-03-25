import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';
import { Venue } from 'interfaces';
type Props = {
  items?: Venue[];
};

const VenueTable = ({ items }: Props) => {
  return (
    <div className="w-full h-[calc(100%-140px)]">
      <Table columnDefs={items === null ? null : venueColumnDefs} rowData={items} styleProps={styleProps} />
    </div>
  );
};

export default VenueTable;
