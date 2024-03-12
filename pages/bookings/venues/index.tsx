import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';
import AddEditVenueModal from 'components/venues/modal/AddEditVenueModal';

export default function index() {
  return (
    <>
      <Layout title="Venues | Segue" flush>
        <div className="mb-8">
          <VenueFilter />
        </div>
        <VenueTable />
      </Layout>
      <AddEditVenueModal />
    </>
  );
}
