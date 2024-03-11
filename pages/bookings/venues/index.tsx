import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';
import { useEffect, useState } from 'react';

export default function Index() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    async function getVenueData() {
      try {
        // TBC CHANGE HARDCODED VALUE FOR DYNAMIC USER
        const response = await fetch('/api/venue');
        if (response.ok) {
          const data = await response.json();

          setVenues(data);
        } else {
          throw new Error();
        }
      } catch (error) {
        console.error(error);
      }
    }
    getVenueData();
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
