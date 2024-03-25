import { useCallback, useEffect, useMemo, useState } from 'react';
import Layout from 'components/Layout';
import VenueFilter from 'components/venues/VenueFilter';
import VenueTable from 'components/venues/VenueTable';
import AddEditVenueModal from 'components/venues/modal/AddEditVenueModal';

import { getUniqueVenueCountrylist, getUniqueVenueTownlist } from 'services/venueService';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getProductionJumpState } from 'utils/getProductionJumpState';
import { getAccountIdFromReq } from 'services/userService';
import { InitialState } from 'lib/recoil';
import axios from 'axios';
import { defaultVenueFilters } from 'config/bookings';
import { debounce } from 'radash';

export type VenueFilters = {
  venueId: string;
  town: string;
  country: string;
  productionId: string;
  search: string;
};
export default function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { venueTownList = [], venueCountryList = [] } = props;
  const [filters, setFilters] = useState<VenueFilters>(defaultVenueFilters);
  const [venues, setVenues] = useState([]);
  const { productionId, town, country, search } = filters;
  const filterVenues = useMemo(() => debounce({ delay: 1000 }, (payload) => fetchVenues(payload)), []);
  const townOptions = useMemo(() => venueTownList.map(({ Town }) => ({ text: Town, value: Town })), [venueTownList]);
  const countryOptions = useMemo(
    () => venueCountryList.map(({ Country }) => ({ text: Country, value: Country })),
    [venueCountryList],
  );

  const fetchVenues = useCallback(async (payload) => {
    setVenues(null);
    try {
      const { data } = await axios.post('/api/venue/list', {
        ...payload,
      });
      const venusList = data?.map(({ Code, Id, Name, Seats, VenueAddress }) => ({
        Code,
        Id,
        Name,
        Seats,
        Town: VenueAddress?.[0]?.Town,
      }));
      setVenues(venusList);
    } catch (err) {
      setVenues([]);
    }
  }, []);

  useEffect(() => {
    if (productionId || town || country || search) {
      filterVenues({ productionId, town, country, searchQuery: search });
    } else {
      setVenues([]);
    }
  }, [productionId, town, country, search]);

  const updateFilters = (change) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...change }));
  };

  return (
    <>
      <Layout title="Venues | Segue" flush>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 ">
            <VenueFilter
              townOptions={townOptions}
              countryOptions={countryOptions}
              onFilterChange={updateFilters}
              filters={filters}
            />
          </div>
          <VenueTable items={venues} />
        </div>
      </Layout>
      <AddEditVenueModal />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const AccountId = await getAccountIdFromReq(ctx.req);
  const productionJump = await getProductionJumpState(ctx, 'bookings', AccountId);
  const venueTownList = await getUniqueVenueTownlist();
  const venueCountryList = await getUniqueVenueCountrylist();
  const initialState: InitialState = {
    global: {
      productionJump,
    },
  };
  return {
    props: {
      venueTownList,
      venueCountryList,
      initialState,
    },
  };
};
