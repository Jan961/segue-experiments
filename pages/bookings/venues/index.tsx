import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';

import { useEffect, useState } from 'react';
import { getAllVenues, getAllVenuesMin } from 'services/venueService';

export default function Index(props: any) {
  const [venues, setVenues] = useState([]);

  console.log('props :>> ', props);
  useEffect(() => {
    // const venue = objectify(
    //   venues,
    //   (v) => v.Id,
    //   (v: any) => {
    //     const Town: string | null = v.VenueAddress.find((address: any) => address?.TypeName === 'Main')?.Town ?? null;
    //     return { Id: v.Id, Code: v.Code, Name: v.Name, Town, Seats: v.Seats, Count: 0 };
    //   },
    // );
    // console.log('venue :>> ', venue);
    setVenues(props.venues);
  }, []);

  return (
    <Layout title="Venues | Segue" flush>
      <div className="mb-8">
        <VenueFilter />
      </div>
      <VenueTable items={venues} />
    </Layout>
  );
}
export const getServerSideProps = async () => {
  const venues = await getAllVenuesMin();
  const venues2 = await getAllVenues();
  return {
    props: {
      venues,
      venues2,
    },
  };
};
