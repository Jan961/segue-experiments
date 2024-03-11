import Table from 'components/core-ui-lib/Table';
import { styleProps, venueColumnDefs } from 'components/bookings/table/tableConfig';
import { Venue } from 'interfaces';
import { useEffect, useState } from 'react';
import { getAllVenuesMin } from 'services/venueService';

type Props = {
  items: Venue[];
};

const VenueTable = ({ items }: Props) => {
  const [venuesData, setVenuesData] = useState<Venue[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await getAllVenuesMin();
        const venues = await getAllVenuesMin();

        console.log('venuesS :>> ', venues);

        setVenuesData(venues);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs once when the component mounts.

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
  console.log('venuesData :>> ', venuesData);

  return (
    <div className="w-full h-[calc(100%-140px)]">
      <Table columnDefs={venueColumnDefs} rowData={modifiedVenues} styleProps={styleProps} />
    </div>
  );
};

export default VenueTable;
