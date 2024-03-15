import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';
import { Venue } from 'interfaces';
type Props = {
  items: Venue[];
};

const VenueTable = ({ items }: Props) => {
  return (
    <div className="w-full h-[calc(100%-140px)]">
      <Table
        columnDefs={venueColumnDefs}
        rowData={items}
        styleProps={styleProps}
        pagination={true}
        paginationPageSize={50}
      />
    </div>
  );
};

export default VenueTable;
