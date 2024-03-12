import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';
import { Venue } from 'interfaces';

type Props = {
  items: Venue[];
};

const VenueTable = ({ items }: Props, props: any) => {
  console.log('props :>> ', props);

  const modifiedVenues = items.map((v) => {
    const townFromName = v.Name.includes(',') ? v.Name.split(',')[1].trim() : v.Name.split(' ')[0].trim();

    return {
      Id: v.Id,
      Code: v.Code,
      Name: v.Name,
      Town: townFromName,
      Seats: v.Seats,
      Count: 0,
    };
  });

  console.log('items :>> ', items);
  console.log('modifiedVenues :>> ', modifiedVenues);

  return (
    <div className="w-full h-[calc(100%-140px)]">
      <Table columnDefs={venueColumnDefs} rowData={modifiedVenues} styleProps={styleProps} />
    </div>
  );
};

export default VenueTable;

// export const getServerSideProps = async () => {
//   const venues = await getAllVenuesMin();
//   return {
//     props: {
//       venues,
//     },
//   };
// };
